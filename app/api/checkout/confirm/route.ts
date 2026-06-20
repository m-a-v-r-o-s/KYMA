import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getBooking, updateBookingStatus } from "@/lib/store";

export const dynamic = "force-dynamic";

// Called by the success page to verify payment and confirm the booking.
export async function GET(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const sessionId = new URL(req.url).searchParams.get("session_id");

  if (!key || !sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  const stripe = new Stripe(key);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const bookingId = session.metadata?.bookingId;
    const paid = session.payment_status === "paid";

    if (paid && bookingId) {
      const booking = updateBookingStatus(bookingId, "confirmed") ?? getBooking(bookingId);
      return NextResponse.json({ paid: true, booking });
    }

    return NextResponse.json({ paid, booking: bookingId ? getBooking(bookingId) : null });
  } catch (err) {
    console.error("Stripe confirm error:", err);
    return NextResponse.json({ error: "Could not verify payment" }, { status: 502 });
  }
}
