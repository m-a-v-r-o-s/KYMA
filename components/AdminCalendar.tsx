"use client";

import { useMemo, useRef, useState } from "react";
import type { Booking } from "@/lib/types";

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

// expand an inclusive range [from..to] into individual dates
function expand(from: string, to: string): string[] {
  const out: string[] = [];
  let cur = from;
  while (cur <= to) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type DayStatus = "confirmed" | "pending" | "blocked" | "empty";

interface DayInfo {
  confirmed: boolean;
  pending: boolean;
  blocked: boolean;
  names: string[];
}

function statusOf(info: DayInfo | undefined): DayStatus {
  if (!info) return "empty";
  if (info.confirmed) return "confirmed";
  if (info.pending) return "pending";
  if (info.blocked) return "blocked";
  return "empty";
}

export default function AdminCalendar({
  bookings,
  blockedDates,
  onSelectName,
  onToggleBlock,
}: {
  bookings: Booking[];
  blockedDates: string[];
  onSelectName?: (name: string) => void;
  onToggleBlock?: (date: string, block: boolean) => void;
}) {
  const today = ymd(new Date());
  const [view, setView] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  // which day's block/unblock confirmation popover is open (null = none)
  const [menuDate, setMenuDate] = useState<string | null>(null);

  // Map each calendar date to who occupies it. A booking blocks its nights
  // [checkIn .. checkOut-1]; the checkout day itself is free.
  const dayMap = useMemo(() => {
    const map = new Map<string, DayInfo>();
    const ensure = (d: string): DayInfo => {
      let e = map.get(d);
      if (!e) {
        e = { confirmed: false, pending: false, blocked: false, names: [] };
        map.set(d, e);
      }
      return e;
    };
    blockedDates.forEach((d) => (ensure(d).blocked = true));
    bookings.forEach((b) => {
      if (b.status === "cancelled") return;
      const lastNight = addDays(b.checkOut, -1);
      if (lastNight < b.checkIn) return;
      expand(b.checkIn, lastNight).forEach((d) => {
        const e = ensure(d);
        if (b.status === "confirmed") e.confirmed = true;
        else e.pending = true;
        if (!e.names.includes(b.name)) e.names.push(b.name);
      });
    });
    return map;
  }, [bookings, blockedDates]);

  // calendar grid for the current view month (Monday-first)
  const grid = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDow = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(ymd(new Date(view.y, view.m, d)));
    return cells;
  }, [view]);

  // tallies for the visible month
  const monthCounts = useMemo(() => {
    let confirmed = 0, pending = 0, blocked = 0, free = 0;
    grid.forEach((cell) => {
      if (!cell) return;
      const s = statusOf(dayMap.get(cell));
      if (s === "confirmed") confirmed++;
      else if (s === "pending") pending++;
      else if (s === "blocked") blocked++;
      else free++;
    });
    return { confirmed, pending, blocked, free };
  }, [grid, dayMap]);

  function shiftMonth(delta: number) {
    setMenuDate(null);
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }
  function goToday() {
    setMenuDate(null);
    const n = new Date();
    setView({ y: n.getFullYear(), m: n.getMonth() });
  }

  // Long-press (press & hold) is the mobile equivalent of right-click: touch
  // devices don't fire a reliable contextmenu event, so we time the hold here.
  const longPress = useRef<{ timer: ReturnType<typeof setTimeout> | null; fired: boolean }>({
    timer: null,
    fired: false,
  });
  function cancelLongPress() {
    if (longPress.current.timer) {
      clearTimeout(longPress.current.timer);
      longPress.current.timer = null;
    }
  }
  function startLongPress(action: (() => void) | null) {
    cancelLongPress();
    longPress.current.fired = false;
    if (!action) return;
    longPress.current.timer = setTimeout(() => {
      longPress.current.fired = true;
      action();
    }, 500);
  }

  const cellStyle: Record<DayStatus, string> = {
    confirmed: "bg-aegean text-white",
    pending: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-300",
    blocked: "bg-ink/15 text-ink/55",
    empty: "text-ink/70",
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftMonth(-1)}
            className="rounded-full p-2 text-aegean transition hover:bg-aegean-wash"
            aria-label="Previous month"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <p className="min-w-[10rem] text-center font-display text-xl text-aegean-dark">
            {MONTHS[view.m]} {view.y}
          </p>
          <button
            onClick={() => shiftMonth(1)}
            className="rounded-full p-2 text-aegean transition hover:bg-aegean-wash"
            aria-label="Next month"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <button
          onClick={goToday}
          className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/60 transition hover:border-aegean hover:text-aegean"
        >
          Today
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/40">
          {DOW.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {grid.map((cell, i) => {
            if (!cell) return <div key={i} />;
            const day = Number(cell.slice(-2));
            const info = dayMap.get(cell);
            const status = statusOf(info);
            const isToday = cell === today;
            const booked = status === "confirmed" || status === "pending";
            const names = info?.names ?? [];
            const canBlock = !!onToggleBlock && status === "empty" && cell >= today;
            const canUnblock = !!onToggleBlock && status === "blocked";
            // right-click / long-press opens a confirmation popover on the day
            const openMenu = canBlock || canUnblock ? () => setMenuDate(cell) : null;
            const menuOpen = menuDate === cell;
            const col = i % 7;
            const lastRow = i >= grid.length - 7;
            const title = booked
              ? `${cell} · ${names.join(", ")}`
              : status === "blocked"
              ? `${cell} · Blocked${onToggleBlock ? " — right-click / hold to unblock" : ""}`
              : canBlock
              ? `${cell} · right-click or press & hold to block`
              : cell;
            return (
              <div key={cell} className={["relative", menuOpen ? "z-50" : ""].join(" ")}>
                <button
                  type="button"
                  title={title}
                  onClick={() => {
                    // swallow the click that follows a long-press
                    if (longPress.current.fired) {
                      longPress.current.fired = false;
                      return;
                    }
                    if (booked) onSelectName?.(names[0]);
                  }}
                  onContextMenu={(e) => {
                    if (openMenu) {
                      e.preventDefault();
                      openMenu();
                    }
                  }}
                  onTouchStart={() => startLongPress(openMenu)}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  onTouchCancel={cancelLongPress}
                  className={[
                    "flex h-11 w-full select-none flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg p-1 text-sm transition [-webkit-touch-callout:none] sm:h-12",
                    cellStyle[status],
                    booked && onSelectName ? "cursor-pointer hover:opacity-90" : "",
                    canBlock || canUnblock ? "cursor-context-menu hover:opacity-90" : "",
                    !booked && !canBlock && !canUnblock ? "cursor-default" : "",
                    isToday ? "ring-2 ring-aegean ring-offset-1" : "",
                  ].join(" ")}
                >
                  <span className="leading-none">{day}</span>
                  {booked && names.length > 0 && (
                    <span className="w-full truncate text-center text-[9px] font-medium leading-tight sm:text-[10px]">
                      {names[0].split(" ")[0]}
                      {names.length > 1 ? ` +${names.length - 1}` : ""}
                    </span>
                  )}
                </button>

                {menuOpen && (
                  <div
                    className={[
                      "absolute w-36 rounded-xl border border-ink/10 bg-white p-2 text-left shadow-xl",
                      lastRow ? "bottom-full mb-1" : "top-full mt-1",
                      col <= 1 ? "left-0" : col >= 5 ? "right-0" : "left-1/2 -translate-x-1/2",
                    ].join(" ")}
                  >
                    <p className="px-1 pb-1.5 text-xs text-ink/60">
                      {canBlock ? "Block off this day?" : "Unblock this day?"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleBlock!(cell, canBlock);
                        setMenuDate(null);
                      }}
                      className={[
                        "w-full rounded-md px-2 py-1.5 text-xs font-semibold text-white transition",
                        canBlock ? "bg-ink/70 hover:bg-ink" : "bg-aegean hover:bg-aegean-dark",
                      ].join(" ")}
                    >
                      {canBlock ? "Block off" : "Unblock"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuDate(null)}
                      className="mt-1 w-full rounded-md border border-ink/15 px-2 py-1.5 text-xs font-semibold text-ink/60 transition hover:border-ink/30"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* click-away layer that dismisses the open confirmation popover */}
        {menuDate && (
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setMenuDate(null);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuDate(null);
            }}
          />
        )}

        {/* legend + month summary */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/10 pt-3 text-xs text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-aegean" /> Confirmed ({monthCounts.confirmed})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-100 ring-1 ring-inset ring-amber-300" /> Pending ({monthCounts.pending})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-ink/15" /> Blocked ({monthCounts.blocked})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-ink/15 bg-white" /> Free ({monthCounts.free})
          </span>
        </div>

        {onToggleBlock && (
          <p className="mt-2 text-xs text-ink/45">
            Tip: right-click (or press &amp; hold on mobile) a day, then confirm to block or unblock it. Tap a booked day to find the guest.
          </p>
        )}
      </div>
    </section>
  );
}
