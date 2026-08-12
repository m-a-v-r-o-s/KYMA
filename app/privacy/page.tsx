import type { Metadata } from "next";
import { VILLA } from "@/lib/config";

const TITLE = "Privacy Policy";
const DESCRIPTION = "How Villa Kyma collects, uses and protects your personal data.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { type: "website", url: "/privacy", title: TITLE, description: DESCRIPTION },
};

const updated = "12 August 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <a href="/" className="text-sm font-semibold text-aegean hover:underline">
        &larr; Back to Villa Kyma
      </a>

      <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Template notice:</strong> this is a reasonable starting draft, not legal advice.
        Have a qualified lawyer review it against Greek and EU law (including the GDPR) before
        relying on it in production.
      </div>

      <h1 className="mt-8 font-display text-4xl text-aegean-dark">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: {updated}</p>

      <div className="mt-8 space-y-8 text-ink/75">
        <section>
          <h2 className="font-display text-xl text-aegean-dark">1. Who we are</h2>
          <p className="mt-2">
            This Privacy Policy explains how {VILLA.name}, a private short-term villa rental in{" "}
            {VILLA.location}, collects and uses personal data from visitors to this website and
            guests who make a booking enquiry or reservation. [Registered business name and
            address to be added once available.] For any privacy question, contact us at{" "}
            <a href={`mailto:${VILLA.email}`} className="text-aegean hover:underline">{VILLA.email}</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">2. What we collect</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Booking details you submit: name, email, phone number, requested dates, guest count, and any message you add.</li>
            <li>Payment information, when you pay online: card and billing details are collected and processed directly by our payment provider, Stripe. We do not store your card details ourselves.</li>
            <li>Basic technical data (such as browser type and pages visited), only if you accept analytics cookies in the cookie banner.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">3. Why we use it</h2>
          <p className="mt-2">
            To respond to booking requests, confirm and manage reservations, process payments,
            answer questions, and, where you've consented, to understand how the website is used
            so we can improve it. We do not sell personal data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">4. Who we share it with</h2>
          <p className="mt-2">
            Stripe, Inc. (payment processing) and, if enabled, a privacy-respecting analytics
            provider. We may also disclose data where required by Greek tax or short-term rental
            law (our ΑΜΑ registration number, {VILLA.ama}, is displayed on this site as required).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">5. Cookies</h2>
          <p className="mt-2">
            We use strictly necessary cookies to run the site, and optional analytics cookies only
            with your consent, set through the cookie banner on your first visit. You can change
            your choice at any time by clearing your browser's site data for this domain.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">6. How long we keep it</h2>
          <p className="mt-2">
            Booking records are kept for as long as reasonably needed for accounting, legal and
            tax obligations, then deleted. You can ask us to delete data that isn't subject to a
            legal retention requirement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">7. Your rights</h2>
          <p className="mt-2">
            Under the GDPR, EU residents can request access to, correction of, or deletion of
            their personal data, and can object to or restrict certain processing. To exercise
            any of these rights, email{" "}
            <a href={`mailto:${VILLA.email}`} className="text-aegean hover:underline">{VILLA.email}</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-aegean-dark">8. Contact</h2>
          <p className="mt-2">
            Questions about this policy: <a href={`mailto:${VILLA.email}`} className="text-aegean hover:underline">{VILLA.email}</a> or{" "}
            <a href={`tel:${VILLA.phoneHref}`} className="text-aegean hover:underline">{VILLA.phoneDisplay}</a>.
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm">
        <a href="/terms" className="text-aegean hover:underline">Terms of Service</a>
      </p>
    </main>
  );
}
