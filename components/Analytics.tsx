"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const STORAGE_KEY = "kyma-cookie-consent"; // must match components/CookieConsent.tsx

// Loads Google Analytics only if a Measurement ID is configured AND the
// visitor has accepted analytics cookies in the consent banner. No tracking
// script ever loads for visitors who haven't opted in, or when GA_ID is unset.
export default function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setAllowed(!!raw && JSON.parse(raw).analytics === true);
    } catch {
      /* no consent recorded yet: stay opted out */
    }
  }, []);

  if (!GA_ID || !allowed) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
