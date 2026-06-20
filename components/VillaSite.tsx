"use client";

import { useEffect, useRef, useState } from "react";
import { AMENITIES, AREA, EXPERIENCES, REVIEWS, noTonos, tr, type Lang } from "@/lib/dict";
import { VILLA } from "@/lib/config";
import BookingWidget from "./BookingWidget";
import FloatingContacts from "./FloatingContacts";
import CookieConsent from "./CookieConsent";

// Curated Greek-island imagery (Cyclades villas, Aegean views, Paros surroundings).
const PHOTOS: Record<string, string> = {
  "kyma-hero": "photo-1597211833712-5e41faa202ea", // aerial/drone view of the seafront villa
  "kyma-1": "photo-1602343168117-bb8ffe3e2e9f", // villa with infinity pool
  "kyma-2": "photo-1600607687939-ce8a6c25118c", // bright contemporary interior
  "kyma-3": "photo-1613490493576-7fde63acd811", // modern villa and pool terrace
  "kyma-area-0": "/images/kolymbithres.jpg", // Kolymbithres — granite rock formations, Paros (local)
  "kyma-area-1": "photo-1753441034372-d5d45d443e3d", // Naoussa fishing harbour, Paros
  "kyma-area-2": "photo-1602008194020-13ac6665ebdb", // Parikia waterfront town, Paros
  "exp-boat": "photo-1605281317010-fe5ffe798166", // motor yacht on turquoise sea
  "exp-sailing": "photo-1500627964684-141351970a7f", // sailboat deck at sea
  "exp-atv": "photo-1586016413664-864c0dd76f53", // off-road 4x4 on a dirt track
  "exp-windsurf": "photo-1502933691298-84fc14542831", // rider on a wave
  "exp-scuba": "photo-1544551763-46a013bb70d5", // scuba diver over a reef
  "exp-wine": "photo-1510812431401-41d2bd2722f3", // friends toasting with wine
};

const img = (seed: string, w = 900, h = 700) => {
  const ref = PHOTOS[seed] ?? PHOTOS["kyma-hero"];
  // Local files (served from /public) are used as-is; Unsplash ids get sized.
  return ref.startsWith("/")
    ? ref
    : `https://images.unsplash.com/${ref}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
};

export default function VillaSite() {
  const [lang, setLang] = useState<Lang>("en");

  // Drone hero: pan the photo (sea → villa → garden) as the user scrolls.
  // Desktop only — on mobile the hero is a normal static image (no pan).
  const heroRef = useRef<HTMLElement>(null);
  const [pan, setPan] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      if (!window.matchMedia("(min-width: 768px)").matches) {
        setPan(0); // mobile: static framing, no scroll effect
        return;
      }
      const distance = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), distance);
      setPan(distance > 0 ? scrolled / distance : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Villa gallery: three real photos + empty placeholders revealed by "view more".
  const gallery: { src?: string; empty?: boolean }[] = [
    { src: img("kyma-1", 1100, 1400) },
    { src: img("kyma-2", 1100, 760) },
    { src: img("kyma-3", 1100, 760) },
    { empty: true },
    { empty: true },
    { empty: true },
  ];
  const [showMore, setShowMore] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const visibleCount = showMore ? gallery.length : 3;

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((v) => (v === null ? v : (v + 1) % visibleCount));
      if (e.key === "ArrowLeft") setLightbox((v) => (v === null ? v : (v - 1 + visibleCount) % visibleCount));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, visibleCount]);

  return (
    <div>
      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-40">
        <nav className="mx-auto flex max-w-container items-center justify-between px-5 py-5 text-white">
          <a href="#top" className="font-display text-2xl font-semibold tracking-wide">
            Villa Kyma
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium text-white/85 md:flex">
            <a href="#villa" className="hover:text-white">{tr("nav_villa", lang)}</a>
            <a href="#amenities" className="hover:text-white">{tr("nav_amenities", lang)}</a>
            <a href="#area" className="hover:text-white">{tr("nav_area", lang)}</a>
            <a href="#experiences" className="hover:text-white">{tr("nav_experiences", lang)}</a>
            <a href="#reviews" className="hover:text-white">{tr("nav_reviews", lang)}</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "el" : "en")}
              className="rounded-full border border-white/40 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10"
            >
              {lang === "en" ? "ΕΛ" : "EN"}
            </button>
            <a href="#book" className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-aegean-dark transition hover:bg-white/90 sm:inline-block">
              {tr("nav_book", lang)}
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* HERO — video background (landscape on desktop, rotated vertical on mobile) */}
        <section ref={heroRef} className="relative h-[86vh] overflow-hidden bg-aegean md:h-screen">
          <div className="relative flex h-full items-start overflow-hidden">
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/videos/hero-poster.jpg"
              aria-hidden
            >
              <source src="/videos/hero.webm" type="video/webm" />
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-aegean-dark/75 via-aegean-dark/20 to-aegean-dark/55" />
            <div
              style={{
                // Keep the text within the sky: hold it steady, then fade/drift it
                // up as the photo pans down so it never sits over the house.
                opacity: pan <= 0.3 ? 1 : Math.max(0, 1 - (pan - 0.3) / 0.2),
                transform: `translateY(${-pan * 18}vh)`,
              }}
              className="relative mx-auto w-full max-w-container px-5 pt-40 pb-12 text-center text-white md:pt-48"
            >
              <span className="eyebrow !text-[#cdbf9a] !text-base sm:!text-xl">{noTonos(tr("hero_eyebrow", lang))}</span>
              <h1 className="mt-4 font-display text-6xl leading-none sm:text-8xl">{tr("hero_title", lang)}</h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">{tr("hero_sub", lang)}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
                <a href="#book" className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-aegean-dark transition hover:bg-white/90">
                  {tr("hero_cta", lang)}
                </a>
                <p className="text-sm text-white/80">
                  <span className="text-white/60">{tr("hero_from", lang)} </span>
                  <span className="font-display text-2xl text-white">€{VILLA.nightlyRate}</span> {tr("hero_night", lang)}
                </p>
              </div>
            </div>

            {/* scroll-to-villa hint at the bottom of the hero */}
            <a
              href="#villa"
              style={{ opacity: Math.max(0, 1 - pan / 0.12) }}
              className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:text-white"
            >
              {noTonos(tr("hero_view", lang))}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce [animation-duration:2.2s]">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </section>

        {/* DIRECT BOOKING STRIP */}
        <section className="-mt-px bg-aegean text-white">
          <div className="mx-auto flex max-w-container flex-col items-start gap-2 px-5 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl">{tr("direct_title", lang)}</p>
              <p className="mt-1 max-w-2xl text-sm text-white/75">{tr("direct_body", lang)}</p>
            </div>
            <a href="#book" className="shrink-0 rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-aegean-dark">
              {tr("nav_book", lang)}
            </a>
          </div>
        </section>

        {/* VILLA INTRO */}
        <section id="villa" className="mx-auto max-w-container px-5 py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="eyebrow">{noTonos(tr("villa_eyebrow", lang))}</span>
              <span className="tessera tessera-villa mt-3" />
              <h2 className="mt-3 font-display text-4xl leading-tight text-aegean-dark sm:text-5xl">{tr("villa_title", lang)}</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink/70">{tr("villa_body", lang)}</p>
              <div className="mt-7 flex gap-8 text-sm">
                <div><p className="font-display text-3xl text-aegean">{VILLA.bedrooms}</p><p className="text-ink/55">{lang === "en" ? "bedrooms" : "δωμάτια"}</p></div>
                <div><p className="font-display text-3xl text-aegean">{VILLA.baths}</p><p className="text-ink/55">{lang === "en" ? "bathrooms" : "μπάνια"}</p></div>
                <div><p className="font-display text-3xl text-aegean">{VILLA.guestsMax}</p><p className="text-ink/55">{lang === "en" ? "guests" : "άτομα"}</p></div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setLightbox(0)} className="row-span-2 overflow-hidden rounded-2xl">
                  <img src={gallery[0].src} alt="" className="h-full w-full cursor-pointer object-cover transition hover:opacity-90" />
                </button>
                <button onClick={() => setLightbox(1)} className="overflow-hidden rounded-2xl">
                  <img src={gallery[1].src} alt="" className="w-full cursor-pointer object-cover transition hover:opacity-90" />
                </button>
                <button onClick={() => setLightbox(2)} className="overflow-hidden rounded-2xl">
                  <img src={gallery[2].src} alt="" className="w-full cursor-pointer object-cover transition hover:opacity-90" />
                </button>
              </div>

              {showMore && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {gallery.slice(3).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(3 + i)}
                      className="flex aspect-[4/3] items-center justify-center rounded-xl bg-ink/8 text-ink/30 transition hover:bg-ink/12"
                      aria-label={tr("gallery_soon", lang)}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="M21 16l-5-5L5 19" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowMore((s) => !s)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-aegean px-5 py-2 text-sm font-semibold text-aegean transition hover:bg-aegean hover:text-white"
              >
                {showMore ? tr("gallery_less", lang) : tr("gallery_more", lang)}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={showMore ? "rotate-180" : ""}>
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* AMENITIES */}
        <section id="amenities" className="bg-aegean-dark py-20 text-white">
          <div className="mx-auto max-w-container px-5">
            <span className="eyebrow !text-[#cdbf9a]">{noTonos(tr("amenities_eyebrow", lang))}</span>
            <h2 className="mt-2 font-display text-4xl text-white">{tr("amenities_title", lang)}</h2>
            <div className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              {AMENITIES.map((a) => (
                <div key={a.icon} className="flex items-center gap-3 border-b border-white/15 py-3 text-white/85">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[#cdbf9a]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="text-sm font-medium">{a[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AREA GUIDE */}
        <section id="area" className="mx-auto max-w-container px-5 py-20">
          <span className="eyebrow">{noTonos(tr("area_eyebrow", lang))}</span>
          <span className="tessera tessera-area mt-3" />
          <h2 className="mt-3 font-display text-4xl text-aegean-dark">{tr("area_title", lang)}</h2>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {AREA.map((p, i) => (
              <article key={i} className="overflow-hidden rounded-2xl border border-ink/8 bg-white">
                <img src={img(`kyma-area-${i}`, 700, 480)} alt="" className="aspect-[3/2] w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-2xl text-aegean-dark">{p[lang]}</h3>
                  <p className="mt-1.5 text-sm text-ink/65">{lang === "en" ? p.descEn : p.descEl}</p>
                </div>
              </article>
            ))}
          </div>

          {/* EXPERIENCES */}
          <div id="experiences" className="mt-16 scroll-mt-24">
            <span className="eyebrow">{noTonos(tr("exp_eyebrow", lang))}</span>
            <span className="tessera tessera-exp mt-3" />
            <h2 className="mt-3 font-display text-4xl text-aegean-dark">{tr("exp_title", lang)}</h2>
            <p className="mt-3 max-w-2xl text-ink/65">{tr("exp_sub", lang)}</p>
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {EXPERIENCES.map((e) => (
                <article key={e.key} className="group flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={img(`exp-${e.key}`, 700, 480)}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-2xl text-aegean-dark">{e[lang]}</h3>
                    <p className="mt-1.5 flex-1 text-sm text-ink/65">{lang === "en" ? e.descEn : e.descEl}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-ink/70">
                        <span className="text-ink/50">{tr("hero_from", lang)} </span>
                        <span className="font-display text-xl text-aegean-dark">€{e.price}</span>
                        <span className="text-ink/50"> / {lang === "en" ? e.unitEn : e.unitEl}</span>
                      </p>
                      <a
                        href="#book"
                        className="rounded-full border border-aegean px-4 py-1.5 text-sm font-semibold text-aegean transition hover:bg-aegean hover:text-white"
                      >
                        {tr("exp_book", lang)}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="scroll-mt-24 bg-aegean-dark py-20 text-white">
          <div className="mx-auto max-w-container px-5">
            <span className="eyebrow !text-[#cdbf9a]">{noTonos(tr("reviews_eyebrow", lang))}</span>
            <h2 className="mt-2 font-display text-4xl text-white">{tr("reviews_title", lang)}</h2>
            <p className="mt-3 text-white/70">{tr("reviews_sub", lang)}</p>
            <div className="mt-9 grid gap-6 md:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <figure key={i} className="flex flex-col rounded-2xl border border-white/15 bg-white/5 p-6">
                  <div className="flex gap-1 text-[#c9a24b]" aria-label={`${r.stars} out of 5 stars`}>
                    {Array.from({ length: r.stars }).map((_, s) => (
                      <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 grow text-white/85">“{r[lang]}”</blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold text-white">{r.name}</span>
                    <span className="block text-white/55">{r.from}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING */}
        <section id="book" className="border-t border-ink/8 bg-aegean-wash/40 py-20">
          <div className="mx-auto grid max-w-container gap-10 px-5 md:grid-cols-2">
            <div>
              <span className="eyebrow">{noTonos(tr("book_eyebrow", lang))}</span>
              <span className="tessera tessera-book mt-3" />
              <h2 className="mt-3 font-display text-4xl text-aegean-dark">{tr("book_title", lang)}</h2>
              <p className="mt-3 max-w-md text-ink/65">{tr("book_sub", lang)}</p>
              <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6">
                <p className="text-sm text-ink/55">{VILLA.location}</p>
                <p className="mt-1 font-display text-3xl text-aegean-dark">€{VILLA.nightlyRate}<span className="text-base font-sans font-normal text-ink/50"> {tr("hero_night", lang)}</span></p>
                <p className="mt-4 text-xs uppercase tracking-wide text-ink/45">{noTonos(tr("footer_ama", lang))}</p>
                <p className="font-mono text-sm text-aegean-dark">{VILLA.ama}</p>
              </div>
            </div>
            <BookingWidget lang={lang} />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-aegean-dark py-12 text-white/80">
        <div className="mx-auto flex max-w-container flex-col items-start justify-between gap-6 px-5 sm:flex-row">
          <div>
            <p className="font-display text-2xl text-white">Villa Kyma</p>
            <p className="mt-1 text-sm">{VILLA.location}</p>
            <p className="mt-3 text-sm">
              <a href={`tel:${VILLA.phoneHref}`} className="hover:text-white">{VILLA.phoneDisplay}</a> ·{" "}
              <a href={`mailto:${VILLA.email}`} className="hover:text-white">{VILLA.email}</a>
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <p>{tr("footer_ama", lang)}: <span className="font-mono">{VILLA.ama}</span></p>
            <p className="mt-2 text-white/55">© {new Date().getFullYear()} Villa Kyma. {tr("footer_rights", lang)}</p>
            <p className="mt-1 text-xs text-white/40">{tr("footer_demo", lang)}</p>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((v) => (v === null ? v : (v - 1 + visibleCount) % visibleCount)); }}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Previous"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[88vh] max-w-[92vw]">
            {gallery[lightbox].empty ? (
              <div className="flex aspect-[4/3] w-[70vw] max-w-2xl flex-col items-center justify-center gap-3 rounded-xl bg-white/5 text-white/45">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="M21 16l-5-5L5 19" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p className="text-sm">{tr("gallery_soon", lang)}</p>
              </div>
            ) : (
              <img src={gallery[lightbox].src} alt="" className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain" />
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((v) => (v === null ? v : (v + 1) % visibleCount)); }}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Next"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      )}

      <FloatingContacts lang={lang} />
      <CookieConsent lang={lang} />
    </div>
  );
}
