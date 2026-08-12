import type { Metadata } from "next";

// booking/success/page.tsx is a client component, so metadata lives here.
export const metadata: Metadata = {
  title: "Booking confirmed",
  description: "Your Villa Kyma booking confirmation.",
  robots: { index: false, follow: false }, // private, per-visitor page: nothing to index
};

export default function BookingSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
