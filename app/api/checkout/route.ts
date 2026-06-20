import { NextResponse } from "next/server";
import Stripe from "stripe";
import { addBooking } from "@/lib/store";
import { VILLA } from "@/lib/config";
import {
  chefDinnerCount,
  chefDinnerPrice,
  housekeepingCost,
  normalizeFrequency,
  sanitizeChefDates,
  serviceDays,
} from "@/lib/pricing";

export const dynamic = "force-dynamic";

// Inclusive night count between two YYYY-MM-DD dates.
function nightsBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const start = Date.UTC(ay, am - 1, ad);
  const end = Date.UTC(by, bm - 1, bd);
  return Math.round((end - start) / 86400000);
}

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Online payment is not configured. Use “Request to book” instead, or contact us directly." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { checkIn, checkOut, guests, name, email, phone, message } = body ?? {};

  if (!checkIn || !checkOut || !name || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  const guestCount = Math.max(VILLA.guestsMin, guests || VILLA.guestsMin);
  // Add-ons and price are validated/computed server-side, never trusted from the client.
  const housekeeping = normalizeFrequency(body.housekeeping, nights);
  const chef = normalizeFrequency(body.chef, nights);
  const chefDates = chef === "specific" ? sanitizeChefDates(body.chefDates, checkIn, checkOut) : [];
  const hkVisits = serviceDays(nights, housekeeping);
  const hkCost = housekeepingCost(nights, housekeeping);
  const chefDinners = chefDinnerCount(nights, chef, chefDates);
  const chefUnit = chefDinnerPrice(guestCount);
  const total = nights * VILLA.nightlyRate + VILLA.cleaningFee + hkCost + chefDinners * chefUnit;

  // Record the request now (pending) so it shows in /admin even before payment.
  const booking = addBooking({
    checkIn,
    checkOut,
    guests: guestCount,
    nights,
    total,
    name,
    email,
    phone,
    message: message || "",
    housekeeping,
    chef,
    chefDates,
  });

  const stripe = new Stripe(key);
  const origin =
    req.headers.get("origin") ?? new URL(req.url).origin;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: nights,
      price_data: {
        currency: "eur",
        unit_amount: VILLA.nightlyRate * 100,
        product_data: {
          name: `${VILLA.name} — nightly rate`,
          description: `${checkIn} to ${checkOut} · ${guestCount} guests`,
        },
      },
    },
    {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: VILLA.cleaningFee * 100,
        product_data: { name: "Cleaning fee" },
      },
    },
  ];

  if (hkVisits > 0) {
    lineItems.push({
      quantity: hkVisits,
      price_data: {
        currency: "eur",
        unit_amount: VILLA.housekeepingRate * 100,
        product_data: {
          name: "Daily housekeeping",
          description: housekeeping === "alt" ? "Every other day" : "Every day",
        },
      },
    });
  }

  if (chefDinners > 0) {
    lineItems.push({
      quantity: chefDinners,
      price_data: {
        currency: "eur",
        unit_amount: chefUnit * 100,
        product_data: {
          name: "Private chef — dinner",
          description: `${
            chef === "specific" ? "Selected days" : chef === "alt" ? "Every other day" : "Every day"
          } · billed for ${Math.max(guestCount, VILLA.chefMinGuests)} guests`,
        },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      metadata: { bookingId: booking.id },
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#book`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
