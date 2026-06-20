import type { Booking, BookingStatus, NewBooking } from "./types";

/**
 * In-memory mock store: bookings live in the running dev-server process and
 * reset on restart. Confirmed bookings block their dates on the public calendar.
 * Replace with a real database before going live.
 */

const g = globalThis as unknown as { __kymaStore?: Booking[] };

function d(offset: number) {
  const x = new Date();
  x.setDate(x.getDate() + offset);
  return x.toISOString().slice(0, 10);
}

function seed(): Booking[] {
  return [
    {
      id: "bkg_2001",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      checkIn: d(8),
      checkOut: d(13),
      guests: 4,
      nights: 5,
      total: 5 * 280 + 60,
      name: "Sophie Laurent",
      email: "sophie@example.com",
      phone: "+33 6 12 34 56 78",
      message: "Honeymoon, possible early check-in?",
      status: "confirmed",
    },
    {
      id: "bkg_2002",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      checkIn: d(30),
      checkOut: d(37),
      guests: 6,
      nights: 7,
      total: 7 * 280 + 60,
      name: "Mark Bennett",
      email: "mark@example.com",
      phone: "+44 7700 900123",
      message: "",
      status: "pending",
    },
  ];
}

function store(): Booking[] {
  if (!g.__kymaStore) g.__kymaStore = seed();
  return g.__kymaStore;
}

export function listBookings(): Booking[] {
  return [...store()].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
}

export function addBooking(input: NewBooking): Booking {
  const bkg: Booking = {
    ...input,
    id: "bkg_" + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  store().push(bkg);
  return bkg;
}

export function getBooking(id: string): Booking | null {
  return store().find((b) => b.id === id) ?? null;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus
): Booking | null {
  const bkg = store().find((b) => b.id === id);
  if (!bkg) return null;
  bkg.status = status;
  return bkg;
}
