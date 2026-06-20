// Edit these before going live.
export const VILLA = {
  name: "Villa Kyma",
  location: "Paros, Cyclades",
  // Greek short-term rental registration number (legally required to display)
  ama: "00001234567",
  guestsMax: 8,
  guestsMin: 4,
  bedrooms: 4,
  baths: 3,
  nightlyRate: 280, // EUR
  cleaningFee: 60, // EUR
  housekeepingRate: 45, // EUR per housekeeping visit
  chefMenuPerGuest: 75, // EUR, private chef dinner — per guest
  chefMinGuests: 5, // chef dinner is billed for at least this many guests
  phoneDisplay: "+30 694 000 0000",
  phoneHref: "+306940000000",
  viberNumber: "306940000000",
  whatsappNumber: "306940000000",
  messenger: "villakyma",
  email: "stay@villakyma.gr",
};

// Dates the owner has manually blocked (in addition to confirmed bookings).
// Format: YYYY-MM-DD inclusive ranges.
export const BLOCKED_RANGES: { from: string; to: string }[] = [
  // example: owner's own stay
  { from: addDays(20), to: addDays(24) },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
