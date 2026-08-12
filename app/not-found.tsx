import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-aegean-dark px-5 py-16 text-center text-white">
      <span className="eyebrow !text-[#cdbf9a]">404</span>
      <h1 className="mt-4 font-display text-5xl sm:text-6xl">Lost at sea</h1>
      <p className="mx-auto mt-4 max-w-md text-white/75">
        We couldn't find that page. It may have been moved, or the link may be out of date.
      </p>
      <a
        href="/"
        className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-aegean-dark transition hover:bg-white/90"
      >
        Back to Villa Kyma
      </a>
    </main>
  );
}
