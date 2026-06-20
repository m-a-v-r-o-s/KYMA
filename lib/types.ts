import type { Frequency } from "./pricing";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  createdAt: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  nights: number;
  total: number; // EUR
  name: string;
  email: string;
  phone: string;
  message?: string;
  housekeeping?: Frequency; // daily housekeeping add-on
  chef?: Frequency; // private chef dinner add-on
  chefDates?: string[]; // selected dinner dates when chef === "specific"
  status: BookingStatus;
}

export type NewBooking = Omit<Booking, "id" | "createdAt" | "status">;
