import type { Metadata } from "next";
import { Literata, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Villa Kyma | Luxury seafront villa in Paros, Greece",
  description:
    "Villa Kyma is a private seafront villa on Paros with infinity pool and Aegean views. Book direct and save on platform fees.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
