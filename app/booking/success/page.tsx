"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  name: string;
};

export default function BookingSuccessPage() {
  const [state, setState] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setState("error");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/checkout/confirm?session_id=${sessionId}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setBooking(data.booking ?? null);
        setState(data.paid ? "paid" : "pending");
      } catch {
        setState("error");
      }
    })();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-aegean-wash/40 px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-sm">
        {state === "loading" && <p className="text-ink/60">Confirming your payment…</p>}

        {state === "paid" && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-aegean text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-display text-3xl text-aegean-dark">Booking confirmed</h1>
            <p className="mt-2 text-ink/70">
              Thank you{booking ? `, ${booking.name.split(" ")[0]}` : ""}. Your stay at Villa Kyma is reserved.
            </p>
            {booking && (
              <div className="mt-5 space-y-1.5 rounded-xl border border-ink/10 bg-aegean-wash/40 p-4 text-left text-sm text-ink/75">
                <div className="flex justify-between"><span>Check-in</span><span className="font-semibold text-aegean-dark">{booking.checkIn}</span></div>
                <div className="flex justify-between"><span>Check-out</span><span className="font-semibold text-aegean-dark">{booking.checkOut}</span></div>
                <div className="flex justify-between"><span>Guests</span><span className="font-semibold text-aegean-dark">{booking.guests}</span></div>
                <div className="flex justify-between border-t border-ink/10 pt-1.5"><span>Paid</span><span className="font-semibold text-aegean-dark">€{booking.total}</span></div>
              </div>
            )}
          </>
        )}

        {state === "pending" && (
          <>
            <h1 className="font-display text-3xl text-aegean-dark">Payment pending</h1>
            <p className="mt-2 text-ink/70">We haven't received confirmation of your payment yet. If you were charged, please contact us and we'll sort it out right away.</p>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="font-display text-3xl text-aegean-dark">Something went wrong</h1>
            <p className="mt-2 text-ink/70">We couldn't verify your booking. Please contact us and we'll help.</p>
          </>
        )}

        <a href="/" className="mt-6 inline-block rounded-full border border-aegean px-5 py-2 text-sm font-semibold text-aegean transition hover:bg-aegean hover:text-white">
          Back to Villa Kyma
        </a>
      </div>
    </main>
  );
}
