"use client";

import { useEffect, useState } from "react";
import { tr, type Lang } from "@/lib/dict";

const STORAGE_KEY = "kyma-cookie-consent";

export default function CookieConsent({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);

  // Only show the banner if the visitor hasn't chosen yet.
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function decide(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* storage unavailable: just dismiss for this session */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto flex max-w-container flex-col gap-3 rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-lg shadow-black/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <p className="text-sm text-ink/75">{tr("cookie_text", lang)}</p>
        <div className="flex shrink-0 gap-2.5">
          <button
            onClick={() => decide("declined")}
            className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-ink/5"
          >
            {tr("cookie_deny", lang)}
          </button>
          <button
            onClick={() => decide("accepted")}
            className="rounded-full bg-aegean px-5 py-2 text-sm font-semibold text-white transition hover:bg-aegean-dark"
          >
            {tr("cookie_accept", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
