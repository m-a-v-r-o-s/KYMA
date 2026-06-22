"use client";

import { useEffect, useMemo, useState } from "react";
import { VILLA, BLOCKED_RANGES } from "@/lib/config";
import { noTonos, tr, type Lang } from "@/lib/dict";
import {
  altAllowed,
  chefDinnerCount,
  chefDinnerPrice,
  eligibleChefDates,
  housekeepingCost,
  serviceDays,
  type Frequency,
} from "@/lib/pricing";

/* ---------- date helpers (local, no TZ surprises) ---------- */
const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
};
const nightsBetween = (a: string, b: string) =>
  Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);

// expand an inclusive-night range [from..to] into individual night dates
function expandNights(from: string, to: string): string[] {
  const out: string[] = [];
  let cur = from;
  while (cur <= to) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

const MONTHS = {
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  el: ["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"],
};
const DOW = { en: ["Mo","Tu","We","Th","Fr","Sa","Su"], el: ["Δε","Τρ","Τε","Πε","Πα","Σα","Κυ"] };

export default function BookingWidget({ lang }: { lang: Lang }) {
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [view, setView] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(VILLA.guestsMin);
  const [housekeeping, setHousekeeping] = useState<Frequency>("none");
  const [chef, setChef] = useState<Frequency>("none");
  const [chefDates, setChefDates] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);

  // build blocked nights from confirmed bookings + owner-blocked dates
  useEffect(() => {
    (async () => {
      const set = new Set<string>();
      try {
        const [bRes, blkRes] = await Promise.all([
          fetch("/api/bookings", { cache: "no-store" }),
          fetch("/api/blocks", { cache: "no-store" }),
        ]);
        const data = await bRes.json();
        const blk = await blkRes.json();
        (blk.dates ?? []).forEach((d: string) => set.add(d));
        (data.bookings ?? [])
          .filter((b: any) => b.status === "confirmed")
          .forEach((b: any) => expandNights(b.checkIn, addDays(b.checkOut, -1)).forEach((d: string) => set.add(d)));
      } catch {
        /* offline: fall back to the statically configured ranges */
        BLOCKED_RANGES.forEach((r) => expandNights(r.from, r.to).forEach((d) => set.add(d)));
      }
      setBlocked(set);
    })();
  }, []);

  const todayStr = ymd(new Date());

  function clickDay(dateStr: string) {
    if (dateStr < todayStr || blocked.has(dateStr)) return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut("");
      setError("");
      return;
    }
    if (dateStr <= checkIn) {
      setCheckIn(dateStr);
      return;
    }
    // validate no blocked night in [checkIn .. dateStr-1]
    const nights = expandNights(checkIn, addDays(dateStr, -1));
    if (nights.some((d) => blocked.has(d))) {
      setCheckIn(dateStr);
      setCheckOut("");
      setError(tr("cal_unavailable", lang));
      return;
    }
    setCheckOut(dateStr);
    setError("");
  }

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const subtotal = nights * VILLA.nightlyRate;

  // "Every other day" disappears for short stays — keep state valid if nights drop.
  useEffect(() => {
    if (!altAllowed(nights)) {
      setHousekeeping((f) => (f === "alt" ? "daily" : f));
      setChef((f) => (f === "alt" ? "daily" : f));
    }
  }, [nights]);

  // Dates the chef can cook (each night of the stay); prune selections if dates change.
  const chefDateOptions = checkIn && checkOut ? eligibleChefDates(checkIn, checkOut) : [];
  useEffect(() => {
    setChefDates((prev) => prev.filter((d) => d >= checkIn && d < checkOut));
  }, [checkIn, checkOut]);

  const hkVisits = serviceDays(nights, housekeeping);
  const hkCost = housekeepingCost(nights, housekeeping);
  const chefDinners = chefDinnerCount(nights, chef, chefDates);
  const chefTotal = chefDinners * chefDinnerPrice(guests);
  const total = nights > 0 ? subtotal + VILLA.cleaningFee + hkCost + chefTotal : 0;

  function toggleChefDate(d: string) {
    setChefDates((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  }
  // compact date label, e.g. "Mon 1 Sep"
  function chefDateLabel(d: string) {
    const dt = parse(d);
    return `${DOW[lang][(dt.getDay() + 6) % 7]} ${dt.getDate()} ${MONTHS[lang][dt.getMonth()].slice(0, 3)}`;
  }

  // calendar grid for current view month
  const grid = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDow = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(ymd(new Date(view.y, view.m, d)));
    return cells;
  }, [view]);

  const isPrevDisabled =
    view.y < new Date().getFullYear() ||
    (view.y === new Date().getFullYear() && view.m <= new Date().getMonth());

  function shiftMonth(delta: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  function inRange(d: string) {
    return checkIn && checkOut && d > checkIn && d < checkOut;
  }

  async function submit() {
    if (!checkIn || !checkOut || !name.trim() || !email.trim() || !phone.trim()) {
      setError(tr("f_required", lang));
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut, guests, nights, total, name, email, phone, message, housekeeping, chef, chefDates }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function payNow() {
    if (!checkIn || !checkOut || !name.trim() || !email.trim() || !phone.trim()) {
      setError(tr("f_required", lang));
      return;
    }
    setError("");
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut, guests, name, email, phone, message, housekeeping, chef, chefDates }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Could not start payment. Please try again.");
        return;
      }
      window.location.href = data.url; // redirect to Stripe Checkout
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-aegean/20 bg-aegean-wash/50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-aegean text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="font-display text-2xl text-aegean-dark">{tr("f_success_title", lang)}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink/70">{tr("f_success_body", lang)}</p>
        <button
          onClick={() => { setDone(false); setCheckIn(""); setCheckOut(""); setName(""); setEmail(""); setPhone(""); setMessage(""); }}
          className="mt-5 rounded-full border border-aegean px-5 py-2 text-sm font-semibold text-aegean transition hover:bg-aegean hover:text-white"
        >
          {tr("f_another", lang)}
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-ink outline-none transition focus:border-aegean focus:ring-2 focus:ring-aegean/20";

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:p-6">
      {/* calendar */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => shiftMonth(-1)}
          disabled={isPrevDisabled}
          className="rounded-full p-2 text-aegean transition hover:bg-aegean-wash disabled:opacity-30"
          aria-label="Previous month"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p className="font-display text-xl text-aegean-dark">
          {MONTHS[lang][view.m]} {view.y}
        </p>
        <button onClick={() => shiftMonth(1)} className="rounded-full p-2 text-aegean transition hover:bg-aegean-wash" aria-label="Next month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/40">
        {DOW[lang].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {grid.map((cell, i) => {
          if (!cell) return <div key={i} />;
          const day = Number(cell.slice(-2));
          const past = cell < todayStr;
          const isBlocked = blocked.has(cell);
          const disabled = past || isBlocked;
          const isStart = cell === checkIn;
          const isEnd = cell === checkOut;
          const between = inRange(cell);
          return (
            <button
              key={cell}
              onClick={() => clickDay(cell)}
              disabled={disabled}
              className={[
                "aspect-square rounded-lg text-sm transition",
                disabled ? "cursor-not-allowed text-ink/25 line-through" : "hover:bg-aegean-wash",
                isStart || isEnd ? "bg-aegean text-white hover:bg-aegean" : "",
                between ? "bg-aegean-wash text-aegean-dark" : "",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* selection summary */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-ink/12 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-ink/45">{noTonos(tr("cal_checkin", lang))}</p>
          <p className="font-semibold text-aegean-dark">{checkIn || tr("cal_pick", lang)}</p>
        </div>
        <div className="rounded-lg border border-ink/12 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-ink/45">{noTonos(tr("cal_checkout", lang))}</p>
          <p className="font-semibold text-aegean-dark">{checkOut || tr("cal_pick", lang)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-ink/70">
          {tr("cal_guests", lang)}
          <select className="rounded-lg border border-ink/15 px-2 py-1" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {Array.from({ length: VILLA.guestsMax - VILLA.guestsMin + 1 }).map((_, i) => (
              <option key={i} value={VILLA.guestsMin + i}>{VILLA.guestsMin + i}</option>
            ))}
          </select>
        </label>
        {(checkIn || checkOut) && (
          <button onClick={() => { setCheckIn(""); setCheckOut(""); setError(""); }} className="text-sm text-aegean hover:underline">
            {tr("cal_reset", lang)}
          </button>
        )}
      </div>

      {/* extras: daily housekeeping & private chef */}
      {nights > 0 && (
        <div className="mt-4 border-t border-ink/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">{noTonos(tr("ex_title", lang))}</p>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="hk" className="text-sm text-ink/75">
                {tr("ex_housekeeping", lang)}
                <span className="block text-xs text-ink/45">€{VILLA.housekeepingRate} / {tr("ex_visits", lang)}</span>
              </label>
              <select
                id="hk"
                value={housekeeping}
                onChange={(e) => setHousekeeping(e.target.value as Frequency)}
                className="shrink-0 rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm"
              >
                <option value="none">{tr("ex_none", lang)}</option>
                <option value="daily">{tr("ex_daily", lang)}</option>
                {altAllowed(nights) && <option value="alt">{tr("ex_alt", lang)}</option>}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="chef" className="text-sm text-ink/75">
                  {tr("ex_chef", lang)}
                  <span className="block text-xs text-ink/45">
                    €{VILLA.chefMenuPerGuest} {tr("ex_per_guest", lang)} · {tr("ex_min", lang)} {VILLA.chefMinGuests} {tr("ex_guests", lang)}
                  </span>
                </label>
                <select
                  id="chef"
                  value={chef}
                  onChange={(e) => setChef(e.target.value as Frequency)}
                  className="shrink-0 rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm"
                >
                  <option value="none">{tr("ex_none", lang)}</option>
                  <option value="daily">{tr("ex_daily", lang)}</option>
                  {altAllowed(nights) && <option value="alt">{tr("ex_alt", lang)}</option>}
                  <option value="specific">{tr("ex_specific", lang)}</option>
                </select>
              </div>

              {/* expand to choose exact dinner dates */}
              {chef === "specific" && (
                <div className="mt-3 rounded-lg bg-aegean-wash/40 p-3">
                  <p className="text-xs text-ink/55">{tr("ex_pick_days", lang)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {chefDateOptions.map((d) => {
                      const on = chefDates.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleChefDate(d)}
                          aria-pressed={on}
                          className={[
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                            on
                              ? "border-aegean bg-aegean text-white"
                              : "border-ink/20 bg-white text-ink/70 hover:border-aegean",
                          ].join(" ")}
                        >
                          {chefDateLabel(d)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* price breakdown */}
      {nights > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>€{VILLA.nightlyRate} × {nights} {tr("cal_nights", lang)}</span>
            <span>€{subtotal}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>{tr("cal_cleaning", lang)}</span>
            <span>€{VILLA.cleaningFee}</span>
          </div>
          {housekeeping !== "none" && (
            <div className="flex justify-between text-ink/70">
              <span>{tr("ex_housekeeping", lang)} ({hkVisits} {tr("ex_visits", lang)})</span>
              <span>€{hkCost}</span>
            </div>
          )}
          {chef !== "none" && (
            <div className="flex justify-between text-ink/70">
              <span>{tr("ex_chef", lang)} ({chefDinners} {tr("ex_dinners", lang)} × €{chefDinnerPrice(guests)})</span>
              <span>€{chefTotal}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 font-semibold text-aegean-dark">
            <span>{tr("cal_total", lang)}</span>
            <span>€{total}</span>
          </div>
        </div>
      )}

      {/* guest details — suppressHydrationWarning: password-manager extensions
          inject autofill styles/attributes into inputs before React hydrates */}
      <div className="mt-4 grid gap-3">
        <input suppressHydrationWarning className={field} placeholder={tr("f_name", lang)} value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input suppressHydrationWarning className={field} type="email" placeholder={tr("f_email", lang)} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input suppressHydrationWarning className={field} inputMode="tel" placeholder={tr("f_phone", lang)} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <textarea suppressHydrationWarning className={field} rows={2} placeholder={tr("f_message", lang)} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        onClick={payNow}
        disabled={paying || sending}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-aegean px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-aegean-dark disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
        </svg>
        {paying ? "…" : tr("f_pay", lang)}
      </button>
      <p className="mt-1.5 text-center text-xs text-ink/45">{tr("f_pay_hint", lang)}</p>

      <div className="my-3 flex items-center gap-3 text-xs uppercase tracking-wide text-ink/35">
        <span className="h-px flex-1 bg-ink/10" />
        {noTonos(tr("f_or", lang))}
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <button
        onClick={submit}
        disabled={sending || paying}
        className="w-full rounded-full border border-aegean px-6 py-3.5 text-sm font-semibold text-aegean transition hover:bg-aegean hover:text-white disabled:opacity-60"
      >
        {sending ? "…" : tr("f_submit", lang)}
      </button>
    </div>
  );
}
