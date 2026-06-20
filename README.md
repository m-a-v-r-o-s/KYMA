# Villa Kyma — sample website

A single-property luxury rental site (English-first, EL toggle) with a date-range
availability calendar, direct-booking flow, and a lightweight owner dashboard. Built
with Next.js (App Router), TypeScript and Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Then open:

- Public site: http://localhost:3000
- Owner dashboard: http://localhost:3000/admin  (demo password: `kyma2025`)

## How the booking demo works

Guests pick check-in / check-out on the calendar, see a live price (nightly rate +
cleaning fee), and submit a request. Requests are stored **in memory on the dev server**
and show up in `/admin`. When the owner marks a request **Confirmed**, those nights are
blocked on the public calendar. Everything **resets when you restart the server**.

To go live, replace `lib/store.ts` with a real database and add proper admin auth.

## Where to edit things

- `lib/config.ts` — villa facts, nightly rate, cleaning fee, ΑΜΑ number, contact details,
  and `BLOCKED_RANGES` for dates you want to block manually (e.g. owner's own stays)
- `lib/dict.ts` — all English/Greek copy, amenities, and the area guide
- `tailwind.config.ts` — brand colors
- `components/VillaSite.tsx` — the public page sections
- `components/BookingWidget.tsx` — the calendar + price + request form (the signature piece)
- `app/admin/page.tsx` — the owner dashboard
- Images use `picsum.photos` placeholders — search for `img(` and swap in the villa's real
  photography (the hero especially benefits from a real sea-view shot).

## Greek-market specifics already wired in

- The ΑΜΑ short-term-rental registration number is displayed in the booking card and the
  footer (legally required in Greece) — set the real number in `lib/config.ts`.
- "Book direct, skip the fees" messaging to pull guests off Airbnb/Booking.com.
- Floating Viber + Messenger + Call buttons (`components/FloatingContacts.tsx`).
- English-first content with an EL toggle.

## Change the admin password

Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_ADMIN_PASSWORD`.
(For a real deployment use server-side auth instead of a public env password.)
