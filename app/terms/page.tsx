import type { Metadata } from "next";
import { VILLA } from "@/lib/config";

const TITLE = "Terms of Service";
const DESCRIPTION = "The terms that apply to bookings and stays at Villa Kyma.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { type: "website", url: "/terms", title: TITLE, description: DESCRIPTION },
};

const updated = "12 August 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <a href="/" className="text-sm font-semibold text-aegean hover:underline">
        &larr; Back to Villa Kyma
      </a>

      <h1 className="mt-8 font-display text-4xl text-aegean-dark">Terms of Service</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: {updated}</p>

      <div className="mt-8 space-y-8 text-ink/75">
        <section>
          <h2 className="font-display text-xl text-aegean-dark">1. Booking a stay</h2>
          <p className="mt-2">
            {VILLA.name} in {VILLA.location} can be booked directly through this website, either
            by sending a booking request (confirmed by us via Viber or email) or by paying online
            immediately through Stripe. A booking is confirmed once you receive written or
            in-app confirmation from us, or once online payment succeeds.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">2. Prices and payment</h2>
          <p className="mt-2">
            Prices shown are in EUR and include the nightly rate and cleaning fee; any
            housekeeping or private chef add-ons are shown separately before you confirm. Online
            payments are processed securely by Stripe; we never see or store your full card
            details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">3. Cancellations and changes</h2>
          <p className="mt-2">
            [Cancellation window, refund percentages, and any non-refundable fees to be
            confirmed by the owner and inserted here.] Contact us as soon as possible if your
            plans change and we'll do our best to accommodate you.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">4. Check-in, check-out and house rules</h2>
          <p className="mt-2">
            Check-in and check-out times, self check-in instructions, and house rules (maximum
            occupancy of {VILLA.guestsMax} guests, no unregistered guests or events without prior
            agreement) are sent to guests ahead of their stay.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">5. Guest responsibilities</h2>
          <p className="mt-2">
            Guests are responsible for treating the property with care and are liable for damage
            beyond normal wear and tear caused during their stay.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">6. Optional experiences and add-ons</h2>
          <p className="mt-2">
            Activities listed under "Experiences" (boat trips, chef dinners, ATV rental, etc.) are
            arranged with third-party local providers on request; availability and final pricing
            are confirmed at the time of booking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">7. Liability</h2>
          <p className="mt-2">
            We are not liable for indirect or consequential loss arising from your stay, except
            where liability cannot be excluded under Greek law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">8. Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws of Greece. This property is registered under
            short-term rental registration number (ΑΜΑ) {VILLA.ama}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">9. Contact</h2>
          <p className="mt-2">
            Questions about these terms: <a href={`mailto:${VILLA.email}`} className="text-aegean hover:underline">{VILLA.email}</a> or{" "}
            <a href={`tel:${VILLA.phoneHref}`} className="text-aegean hover:underline">{VILLA.phoneDisplay}</a>.
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm">
        <a href="/privacy" className="text-aegean hover:underline">Privacy Policy</a>
      </p>
    </main>
  );
}
