"use client";

import { useEffect, type ReactNode } from "react";
import { VILLA } from "@/lib/config";
import {
  chefDinnerCount,
  chefDinnerPrice,
  housekeepingCost,
  serviceDays,
} from "@/lib/pricing";
import type { Booking, BookingStatus } from "@/lib/types";

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-aegean-wash text-aegean-dark",
  cancelled: "bg-red-100 text-red-700",
};
const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};
const FREQ_LABEL: Record<string, string> = {
  none: "Not requested",
  daily: "Every day",
  alt: "Every other day",
  specific: "Selected dates",
};

function fmtDate(s: string): string {
  const [y, m, d] = s.split("-").map(Number);
  if (!y) return s;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-ink/50">{label}</span>
      <span className="text-right font-medium text-ink/80">{children}</span>
    </div>
  );
}

export default function BookingDetailsModal({
  booking: b,
  onClose,
  onStatus,
}: {
  booking: Booking;
  onClose: () => void;
  onStatus?: (id: string, status: BookingStatus) => void;
}) {
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

  const accommodation = b.nights * VILLA.nightlyRate;
  const hkVisits = serviceDays(b.nights, b.housekeeping ?? "none");
  const hkCost = housekeepingCost(b.nights, b.housekeeping ?? "none");
  const chefDinners = chefDinnerCount(b.nights, b.chef ?? "none", b.chefDates ?? []);
  const chefPrice = chefDinnerPrice(b.guests);
  const chefCost = chefDinners * chefPrice;

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
            <p className="font-display text-2xl text-aegean-dark">{b.name}</p>
            <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[b.status]}`}>
              {STATUS_LABEL[b.status]}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-ink/40 transition hover:bg-ink/5 hover:text-ink/70"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* contact */}
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-aegean-dark/70">Contact</h3>
            <Row label="Email"><a href={`mailto:${b.email}`} className="text-aegean hover:underline">{b.email}</a></Row>
            <Row label="Phone"><a href={`tel:${b.phone}`} className="text-aegean hover:underline">{b.phone}</a></Row>
          </section>

          {/* stay */}
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-aegean-dark/70">Stay</h3>
            <Row label="Check-in">{fmtDate(b.checkIn)}</Row>
            <Row label="Check-out">{fmtDate(b.checkOut)}</Row>
            <Row label="Nights">{b.nights}</Row>
            <Row label="Guests">{b.guests}</Row>
            <Row label="Requested">{fmtDateTime(b.createdAt)}</Row>
            <Row label="Booking ID">{b.id}</Row>
          </section>

          {/* add-ons */}
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-aegean-dark/70">Add-ons</h3>
            <Row label="Housekeeping">
              {FREQ_LABEL[b.housekeeping ?? "none"]}
              {hkVisits > 0 ? ` · ${hkVisits} ${hkVisits === 1 ? "visit" : "visits"}` : ""}
            </Row>
            <Row label="Private chef">
              {b.chef === "specific"
                ? `${chefDinners} ${chefDinners === 1 ? "dinner" : "dinners"}`
                : FREQ_LABEL[b.chef ?? "none"]}
            </Row>
            {b.chef === "specific" && (b.chefDates?.length ?? 0) > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {b.chefDates!.map((d) => (
                  <span key={d} className="rounded-full bg-aegean-wash px-2.5 py-1 text-xs font-medium text-aegean-dark">
                    {fmtDate(d)}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* price breakdown */}
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-aegean-dark/70">Price breakdown</h3>
            <Row label={`€${VILLA.nightlyRate} × ${b.nights} ${b.nights === 1 ? "night" : "nights"}`}>€{accommodation}</Row>
            <Row label="Cleaning fee">€{VILLA.cleaningFee}</Row>
            {hkCost > 0 && <Row label={`Housekeeping (${hkVisits} × €${VILLA.housekeepingRate})`}>€{hkCost}</Row>}
            {chefCost > 0 && <Row label={`Private chef (${chefDinners} × €${chefPrice})`}>€{chefCost}</Row>}
            <div className="mt-1 flex justify-between border-t border-ink/10 pt-2 text-sm font-semibold text-aegean-dark">
              <span>Total</span>
              <span>€{b.total}</span>
            </div>
          </section>

          {/* message */}
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-aegean-dark/70">Guest message</h3>
            {b.message ? (
              <p className="rounded-lg bg-whitewash p-3 text-sm italic text-ink/70">“{b.message}”</p>
            ) : (
              <p className="text-sm text-ink/40">No message left.</p>
            )}
          </section>
        </div>

        {/* actions */}
        {onStatus && (
          <div className="sticky bottom-0 flex justify-end gap-2 border-t border-ink/10 bg-white px-5 py-4">
            {b.status !== "confirmed" && (
              <button
                onClick={() => onStatus(b.id, "confirmed")}
                className="rounded-full bg-aegean px-4 py-2 text-sm font-semibold text-white transition hover:bg-aegean-dark"
              >
                Confirm booking
              </button>
            )}
            {b.status !== "cancelled" && (
              <button
                onClick={() => onStatus(b.id, "cancelled")}
                className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/60 transition hover:border-red-400 hover:text-red-600"
              >
                Cancel booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
