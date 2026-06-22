"use client";

import { useEffect, useMemo, useState } from "react";
import { VILLA } from "@/lib/config";
import {
  altAllowed,
  chefDinnerCount,
  chefDinnerPrice,
  eligibleChefDates,
  housekeepingCost,
  serviceDays,
  type Frequency,
} from "@/lib/pricing";
import type { BookingStatus } from "@/lib/types";

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function nightsBetween(a: string, b: string): number {
  if (!a || !b) return 0;
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}
function chefDateLabel(d: string): string {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const field =
  "w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-aegean focus:ring-2 focus:ring-aegean/20";

export default function AddBookingModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const today = ymd(new Date());

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(VILLA.guestsMin);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [housekeeping, setHousekeeping] = useState<Frequency>("none");
  const [chef, setChef] = useState<Frequency>("none");
  const [chefDates, setChefDates] = useState<string[]>([]);
  const [status, setStatus] = useState<BookingStatus>("confirmed");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const nights = nightsBetween(checkIn, checkOut);

  // keep "every other day" valid for short stays
  useEffect(() => {
    if (!altAllowed(nights)) {
      setHousekeeping((f) => (f === "alt" ? "daily" : f));
      setChef((f) => (f === "alt" ? "daily" : f));
    }
  }, [nights]);

  const chefDateOptions = useMemo(
    () => (checkIn && checkOut && checkOut > checkIn ? eligibleChefDates(checkIn, checkOut) : []),
    [checkIn, checkOut]
  );
  // drop any chef dates that fall outside the current range
  useEffect(() => {
    setChefDates((prev) => prev.filter((d) => d >= checkIn && d < checkOut));
  }, [checkIn, checkOut]);

  const hkVisits = serviceDays(nights, housekeeping);
  const hkCost = housekeepingCost(nights, housekeeping);
  const chefDinners = chefDinnerCount(nights, chef, chefDates);
  const chefTotal = chefDinners * chefDinnerPrice(guests);
  const total = nights > 0 ? nights * VILLA.nightlyRate + VILLA.cleaningFee + hkCost + chefTotal : 0;

  function toggleChefDate(d: string) {
    setChefDates((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  }

  async function submit() {
    if (!checkIn || !checkOut) {
      setError("Pick both check-in and check-out dates.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Guest name and phone number are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn,
          checkOut,
          guests,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          housekeeping,
          chef,
          chefDates,
          status,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Could not save booking.");
      }
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save booking.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink/10 bg-white px-5 py-4">
          <div>
            <p className="font-display text-2xl text-aegean-dark">Add booking</p>
            <p className="text-xs text-ink/50">Record a reservation taken by phone, email, or in person</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-ink/40 transition hover:bg-ink/5 hover:text-ink/70"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {/* dates */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/45">Check-in</span>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={field}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/45">Check-out</span>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={field}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/45">Guests</span>
              <select className={field} value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                {Array.from({ length: VILLA.guestsMax - VILLA.guestsMin + 1 }).map((_, i) => (
                  <option key={i} value={VILLA.guestsMin + i}>{VILLA.guestsMin + i}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/45">Status</span>
              <select className={field} value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)}>
                <option value="confirmed">Confirmed (blocks calendar)</option>
                <option value="pending">Pending</option>
              </select>
            </label>
          </div>

          {/* guest details */}
          <input className={field} placeholder="Guest name *" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} inputMode="tel" placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className={field} type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <textarea className={field} rows={2} placeholder="Notes / message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} />

          {/* add-ons */}
          <div className="border-t border-ink/10 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/45">Extras</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink/75">Housekeeping</span>
                <select
                  value={housekeeping}
                  onChange={(e) => setHousekeeping(e.target.value as Frequency)}
                  className="shrink-0 rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm"
                >
                  <option value="none">None</option>
                  <option value="daily">Every day</option>
                  {altAllowed(nights) && <option value="alt">Every other day</option>}
                </select>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink/75">Private chef</span>
                <select
                  value={chef}
                  onChange={(e) => setChef(e.target.value as Frequency)}
                  className="shrink-0 rounded-lg border border-ink/15 px-2.5 py-1.5 text-sm"
                >
                  <option value="none">None</option>
                  <option value="daily">Every day</option>
                  {altAllowed(nights) && <option value="alt">Every other day</option>}
                  <option value="specific">Selected dates</option>
                </select>
              </div>
              {chef === "specific" && (
                <div className="rounded-lg bg-aegean-wash/40 p-3">
                  {chefDateOptions.length === 0 ? (
                    <p className="text-xs text-ink/55">Pick the dates above first.</p>
                  ) : (
                    <>
                      <p className="text-xs text-ink/55">Choose dinner dates</p>
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
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* live estimate */}
          {nights > 0 && (
            <div className="space-y-1.5 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between text-ink/70">
                <span>€{VILLA.nightlyRate} × {nights} {nights === 1 ? "night" : "nights"}</span>
                <span>€{nights * VILLA.nightlyRate}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Cleaning fee</span>
                <span>€{VILLA.cleaningFee}</span>
              </div>
              {hkCost > 0 && (
                <div className="flex justify-between text-ink/70">
                  <span>Housekeeping ({hkVisits} {hkVisits === 1 ? "visit" : "visits"})</span>
                  <span>€{hkCost}</span>
                </div>
              )}
              {chefTotal > 0 && (
                <div className="flex justify-between text-ink/70">
                  <span>Private chef ({chefDinners} {chefDinners === 1 ? "dinner" : "dinners"})</span>
                  <span>€{chefTotal}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 font-semibold text-aegean-dark">
                <span>Estimated total</span>
                <span>€{total}</span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* actions */}
        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-ink/10 bg-white px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/60 transition hover:border-ink/30"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="rounded-full bg-aegean px-5 py-2 text-sm font-semibold text-white transition hover:bg-aegean-dark disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
