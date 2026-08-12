import type { Metadata } from "next";
import { Literata, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/config";
import Analytics from "@/components/Analytics";
import "./globals.css";

const display = Literata({
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-sans",
  display: "swap",
});

const TITLE = "Villa Kyma | Luxury seafront villa in Paros, Greece";
const DESCRIPTION =
  "Villa Kyma is a private seafront villa on Paros with infinity pool and Aegean views. Book direct and save on platform fees.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Villa Kyma" },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Villa Kyma",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/videos/hero-poster.jpg",
        width: 1280,
        height: 720,
        alt: "Aerial view of Villa Kyma's seafront infinity pool on Paros, Greece",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
