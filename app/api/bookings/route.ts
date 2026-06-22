import { NextResponse } from "next/server";
import { addBooking, listBookings } from "@/lib/store";
import type { NewBooking } from "@/lib/types";
import {
  chefDinnerCount,
  chefDinnerPrice,
  housekeepingCost,
  normalizeFrequency,
  sanitizeChefDates,
} from "@/lib/pricing";
import { VILLA } from "@/lib/config";

export const dynamic = "force-dynamic";

// Inclusive night count between two YYYY-MM-DD dates.
function nightsBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

export async function GET() {
  return NextResponse.json({ bookings: listBookings() });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<NewBooking> & { status?: string };
  // Email is optional so the owner can record phone bookings without one.
  if (!body.checkIn || !body.checkOut || !body.name || !body.phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  // Owner-entered bookings may be created already-confirmed; guest requests stay pending.
  const status = body.status === "confirmed" ? "confirmed" : "pending";

  const guests = Math.max(VILLA.guestsMin, body.guests || VILLA.guestsMin);
  const nights = Math.max(1, nightsBetween(body.checkIn, body.checkOut));
  // Re-validate the add-ons and recompute the price on the server.
  const housekeeping = normalizeFrequency(body.housekeeping, nights);
  const chef = normalizeFrequency(body.chef, nights);
  const chefDates =
    chef === "specific" ? sanitizeChefDates(body.chefDates, body.checkIn, body.checkOut) : [];
  const chefDinners = chefDinnerCount(nights, chef, chefDates);
  const total =
    nights * VILLA.nightlyRate +
    VILLA.cleaningFee +
    housekeepingCost(nights, housekeeping) +
    chefDinners * chefDinnerPrice(guests);

  const bkg = addBooking(
    {
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests,
      nights,
      total,
      name: body.name,
      email: body.email || "",
      phone: body.phone,
      message: body.message || "",
      housekeeping,
      chef,
      chefDates,
    },
    status
  );
  return NextResponse.json({ booking: bkg }, { status: 201 });
}
