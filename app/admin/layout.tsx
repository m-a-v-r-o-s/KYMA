import type { Metadata } from "next";

// admin/page.tsx is a client component, so metadata lives here.
export const metadata: Metadata = {
  title: "Owner dashboard",
  description: "Villa Kyma booking management.",
  robots: { index: false, follow: false }, // private dashboard: never index
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
