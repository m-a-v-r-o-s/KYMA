"use client";

import { useEffect, useState } from "react";
import { tr, type Lang } from "@/lib/dict";

const STORAGE_KEY = "kyma-cookie-consent";

// Small on/off switch styled with the site's aegean accent.
function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={[
        "relative h-6 w-11 shrink-0 rounded-full transition",
        checked ? "bg-aegean" : "bg-ink/20",
        disabled ? "cursor-not-allowed opacity-70" : "hover:opacity-90",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
          checked ? "left-[1.375rem]" : "left-0.5",
        ].join(" ")}
      />
    </button>
  );
}

export default function CookieConsent({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(false);
  const [view, setView] = useState<"banner" | "prefs">("banner");
  const [analytics, setAnalytics] = useState(true);

  // Only show the banner if the visitor hasn't chosen yet.
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function persist(analyticsAllowed: boolean) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ necessary: true, analytics: analyticsAllowed, ts: Date.now() })
      );
    } catch {
      /* storage unavailable: just dismiss for this session */
    }
    setShow(false);
  }

  if (!show) return null;

  const btnGhost =
    "rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-ink/5";
  const btnPrimary =
    "rounded-full bg-aegean px-5 py-2 text-sm font-semibold text-white transition hover:bg-aegean-dark";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-container rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-lg shadow-black/10 backdrop-blur sm:p-5">
        {view === "banner" ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-sm text-ink/75">
              {tr("cookie_text", lang)}{" "}
              <a href="/privacy" className="whitespace-nowrap font-semibold text-aegean hover:underline">
                {tr("cookie_privacy_link", lang)}
              </a>
            </p>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <button onClick={() => setView("prefs")} className={btnGhost}>
                {tr("cookie_manage", lang)}
              </button>
              <button onClick={() => persist(false)} className={btnGhost}>
                {tr("cookie_reject", lang)}
              </button>
              <button onClick={() => persist(true)} className={btnPrimary}>
                {tr("cookie_accept_all", lang)}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <p className="font-display text-lg text-aegean-dark">{tr("cookie_prefs_title", lang)}</p>
              <button
                onClick={() => setView("banner")}
                aria-label="Back"
                className="rounded-full p-1 text-ink/40 transition hover:bg-ink/5 hover:text-ink/70"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* strictly necessary — always on */}
              <div className="rounded-xl border border-ink/10 bg-whitewash/60 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink/80">{tr("cookie_necessary_title", lang)}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-aegean">
                      {tr("cookie_necessary_always", lang)}
                    </span>
                    <Toggle checked disabled label={tr("cookie_necessary_title", lang)} />
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-ink/55">{tr("cookie_necessary_desc", lang)}</p>
              </div>

              {/* analytics — optional */}
              <div className="rounded-xl border border-ink/10 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink/80">{tr("cookie_analytics_title", lang)}</p>
                  <Toggle
                    checked={analytics}
                    onChange={setAnalytics}
                    label={tr("cookie_analytics_title", lang)}
                  />
                </div>
                <p className="mt-1.5 text-xs text-ink/55">{tr("cookie_analytics_desc", lang)}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2.5">
              <button onClick={() => persist(analytics)} className={btnGhost}>
                {tr("cookie_save", lang)}
              </button>
              <button onClick={() => persist(true)} className={btnPrimary}>
                {tr("cookie_accept_all", lang)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
