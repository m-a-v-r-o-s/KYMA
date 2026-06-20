import { VILLA } from "./config";

// Add-on service frequency. "specific" (chef only) means hand-picked dates.
export type Frequency = "none" | "daily" | "alt" | "specific";

// "Every other day" is only offered for stays of more than 5 nights.
export const altAllowed = (nights: number) => nights > 5;

const addDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
};

// Dates the chef can cook on: every day of the stay except the checkout day.
export function eligibleChefDates(checkIn: string, checkOut: string): string[] {
  const out: string[] = [];
  if (!checkIn || !checkOut || checkIn >= checkOut) return out;
  let cur = checkIn;
  while (cur < checkOut) {
    out.push(cur);
    cur = addDay(cur);
  }
  return out;
}

// Keep only valid, unique chef dates that fall within the eligible range.
export function sanitizeChefDates(dates: unknown, checkIn: string, checkOut: string): string[] {
  if (!Array.isArray(dates)) return [];
  const eligible = new Set(eligibleChefDates(checkIn, checkOut));
  return [...new Set(dates.filter((d): d is string => typeof d === "string" && eligible.has(d)))];
}

// Number of chef dinners for a given selection.
export function chefDinnerCount(nights: number, freq: Frequency, dates: string[] = []): number {
  return freq === "specific" ? dates.length : serviceDays(nights, freq);
}

/**
 * Number of service days for an add-on. Both housekeeping and the chef serve
 * each day of the stay except the checkout day (= one per night), or every
 * other such day when the guest picks "every other day".
 */
export function serviceDays(nights: number, freq: Frequency): number {
  if (freq === "none" || freq === "specific" || nights < 1) return 0;
  if (freq === "alt") return Math.ceil(nights / 2);
  return nights; // daily
}

export function housekeepingCost(nights: number, freq: Frequency): number {
  return serviceDays(nights, freq) * VILLA.housekeepingRate;
}

// The chef charges per guest per dinner, with a minimum billed guest count.
export const chefBilledGuests = (guests: number) => Math.max(guests, VILLA.chefMinGuests);
export const chefDinnerPrice = (guests: number) => chefBilledGuests(guests) * VILLA.chefMenuPerGuest;

export function chefCost(nights: number, guests: number, freq: Frequency): number {
  return serviceDays(nights, freq) * chefDinnerPrice(guests);
}

export function extrasCost(
  nights: number,
  guests: number,
  housekeeping: Frequency,
  chef: Frequency
): number {
  return housekeepingCost(nights, housekeeping) + chefCost(nights, guests, chef);
}

export function bookingTotal(
  nights: number,
  guests: number,
  housekeeping: Frequency,
  chef: Frequency
): number {
  if (nights < 1) return 0;
  return nights * VILLA.nightlyRate + VILLA.cleaningFee + extrasCost(nights, guests, housekeeping, chef);
}

// Sanitise a frequency value arriving from the client against the nights rule.
export function normalizeFrequency(freq: unknown, nights: number): Frequency {
  if (freq === "daily") return "daily";
  if (freq === "specific") return "specific";
  if (freq === "alt") return altAllowed(nights) ? "alt" : "daily";
  return "none";
}
