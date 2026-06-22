"use client";

import { useEffect, useMemo, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/types";
import AdminCalendar from "@/components/AdminCalendar";
import BookingDetailsModal from "@/components/BookingDetailsModal";
import AddBookingModal from "@/components/AddBookingModal";

const PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "kyma2025";

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-aegean-wash text-aegean-dark",
  cancelled: "bg-red-100 text-red-700 line-through",
};
const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

function freqLabel(f?: string): string | null {
  if (f === "daily") return "every day";
  if (f === "alt") return "every other day";
  return null;
}
function extrasLabel(b: Booking): string | null {
  const parts: string[] = [];
  const hk = freqLabel(b.housekeeping);
  if (hk) parts.push(`Housekeeping (${hk})`);
  if (b.chef === "specific") parts.push(`Chef (${b.chefDates?.length ?? 0} days)`);
  else if (freqLabel(b.chef)) parts.push(`Chef (${freqLabel(b.chef)})`);
  return parts.length ? parts.join(" · ") : null;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [items, setItems] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const [bRes, blkRes] = await Promise.all([
      fetch("/api/bookings", { cache: "no-store" }),
      fetch("/api/blocks", { cache: "no-store" }),
    ]);
    const data = await bRes.json();
    const blk = await blkRes.json();
    setItems(data.bookings ?? []);
    setBlockedDates(blk.dates ?? []);
    setLoading(false);
  }

  async function toggleBlock(date: string, block: boolean) {
    // optimistic update, then persist
    setBlockedDates((prev) =>
      block ? [...prev, date].sort() : prev.filter((d) => d !== date)
    );
    await fetch("/api/blocks", {
      method: block ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
  }

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  async function setStatus(id: string, status: BookingStatus) {
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  // Match against name, email, or phone. Phone is compared digits-only so that
  // spaces, "+", and other separators don't get in the way. Declared before the
  // auth gate below so the hook order stays stable across renders.
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const qDigits = q.replace(/\D/g, "");
    return items.filter((b) => {
      const phoneDigits = b.phone.replace(/\D/g, "");
      return (
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        (qDigits.length > 0 && phoneDigits.includes(qDigits))
      );
    });
  }, [items, query]);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-aegean-dark px-5">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <p className="font-display text-3xl text-aegean-dark">Villa Kyma</p>
          <p className="mt-1 text-sm text-ink/60">Owner dashboard</p>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && pw === PW && setAuthed(true)}
            className="mt-5 w-full rounded-lg border border-ink/15 px-3.5 py-2.5 outline-none focus:border-aegean focus:ring-2 focus:ring-aegean/20"
          />
          <button
            onClick={() => pw === PW && setAuthed(true)}
            className="mt-3 w-full rounded-full bg-aegean px-6 py-3 text-sm font-semibold text-white hover:bg-aegean-dark"
          >
            Sign in
          </button>
          <p className="mt-3 text-center text-xs text-ink/40">Demo password: {PW}</p>
        </div>
      </div>
    );
  }

  // look the selected booking up live so the modal reflects status changes
  const selected = selectedId ? items.find((b) => b.id === selectedId) ?? null : null;

  const shown = searched.filter((b) => filter === "all" || b.status === filter);
  const counts = {
    all: searched.length,
    pending: searched.filter((b) => b.status === "pending").length,
    confirmed: searched.filter((b) => b.status === "confirmed").length,
    cancelled: searched.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div
      className="min-h-screen bg-whitewash"
      onClick={(e) => {
        // Clicking blank / non-interactive space clears the active selection
        // (the guest filled into the search box, e.g. from tapping a day).
        const t = e.target as HTMLElement;
        if (query && !t.closest("button, a, input, select, textarea, label, table")) {
          setQuery("");
        }
      }}
    >
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div>
            <p className="font-display text-2xl text-aegean-dark">Villa Kyma · Bookings</p>
            <p className="text-xs text-ink/50">Confirmed stays block the public calendar</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-aegean px-4 py-2 text-sm font-semibold text-white transition hover:bg-aegean-dark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
              Add booking
            </button>
            <button onClick={load} className="rounded-full border border-aegean px-4 py-2 text-sm font-semibold text-aegean hover:bg-aegean hover:text-white">
              {loading ? "…" : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {/* availability overview */}
        <div className="mb-6">
          <h2 className="mb-3 font-display text-lg text-aegean-dark">Availability</h2>
          <AdminCalendar
            bookings={items}
            blockedDates={blockedDates}
            onSelectName={(name) => setQuery(name)}
            onToggleBlock={toggleBlock}
          />
        </div>

        {/* search by guest name, email, or phone */}
        <div className="mb-5">
          <h2 className="mb-3 font-display text-lg text-aegean-dark">Bookings</h2>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search past or active bookings by name, email, or phone…"
              className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-11 pr-10 text-sm outline-none transition focus:border-aegean focus:ring-2 focus:ring-aegean/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/40 transition hover:bg-ink/5 hover:text-ink/70"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            )}
          </div>
          {query && (
            <p className="mt-2 text-xs text-ink/50">
              {searched.length} {searched.length === 1 ? "match" : "matches"} for “{query.trim()}”
            </p>
          )}
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f ? "bg-aegean text-white" : "bg-white text-ink/60 hover:text-aegean"
              }`}
            >
              {f === "all" ? "All" : STATUS_LABEL[f]} ({counts[f]})
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-aegean-wash/60 text-xs uppercase tracking-wide text-aegean-dark">
              <tr>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3 hidden sm:table-cell">Guests · Nights</th>
                <th className="px-4 py-3 hidden md:table-cell">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {shown.map((b) => (
                <tr key={b.id} className="align-top">
                  <td className="px-4 py-3 font-medium text-aegean-dark">
                    {b.checkIn}
                    <span className="block text-ink/50">→ {b.checkOut}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedId(b.id)}
                      className="text-left font-medium text-aegean hover:underline"
                    >
                      {b.name}
                    </button>
                    <span className="block text-ink/55">{b.phone}</span>
                    <span className="block text-ink/45">{b.email}</span>
                    {b.message && <span className="mt-1 block text-xs italic text-ink/45">“{b.message}”</span>}
                    {extrasLabel(b) && (
                      <span className="mt-1 block text-xs font-medium text-aegean">+ {extrasLabel(b)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-ink/70">
                    {b.guests} · {b.nights}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-semibold text-aegean-dark">€{b.total}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      {b.status !== "confirmed" && (
                        <button onClick={() => setStatus(b.id, "confirmed")} className="rounded-md bg-aegean px-3 py-1.5 text-xs font-semibold text-white hover:bg-aegean-dark">
                          Confirm
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button onClick={() => setStatus(b.id, "cancelled")} className="rounded-md border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/60 hover:border-red-400 hover:text-red-600">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink/50">
                    {query.trim()
                      ? `No bookings match “${query.trim()}”. Try a different name, email, or phone number.`
                      : "No booking requests here yet. Submit one from the homepage to see it appear."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink/40">
          Demo: data is temporary (server memory) and resets on every restart.
        </p>
      </main>

      {selected && (
        <BookingDetailsModal
          booking={selected}
          onClose={() => setSelectedId(null)}
          onStatus={setStatus}
        />
      )}

      {adding && (
        <AddBookingModal
          onClose={() => setAdding(false)}
          onCreated={() => {
            setAdding(false);
            load();
          }}
        />
      )}
    </div>
  );
}
