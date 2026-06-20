"use client";

import { VILLA } from "@/lib/config";
import { tr, type Lang } from "@/lib/dict";

export default function FloatingContacts({ lang }: { lang: Lang }) {
  // Small satellite circle; grows to the main button's size on hover (scale
  // from 32px -> 56px = 1.75), scaling around its own centre.
  const sat =
    "absolute flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-[1.75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aegean";

  return (
    <div className="fixed bottom-6 right-6 z-50 h-14 w-14">
      {/* satellites, arranged in a quarter-arc up and to the left of the phone */}
      <a
        href={`viber://chat?number=%2B${VILLA.viberNumber}`}
        className={`${sat} bg-[#7360F2]`}
        style={{ right: 12, bottom: 72 }}
        aria-label="Viber"
      >
        <IconViber />
      </a>
      <a
        href={`https://wa.me/${VILLA.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sat} bg-[#25D366]`}
        style={{ right: 54, bottom: 54 }}
        aria-label="WhatsApp"
      >
        <IconWhatsApp />
      </a>
      <a
        href={`https://m.me/${VILLA.messenger}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sat} bg-[#0A7CFF]`}
        style={{ right: 72, bottom: 12 }}
        aria-label="Messenger"
      >
        <IconMessenger />
      </a>

      {/* main phone button — icon only */}
      <a
        href={`tel:${VILLA.phoneHref}`}
        className="absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center rounded-full bg-aegean text-white shadow-xl shadow-black/25 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aegean"
        aria-label={tr("contact_call", lang)}
      >
        <IconPhone />
      </a>
    </div>
  );
}

function IconViber() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1C6.5 1 2 4.9 2 9.7c0 2.6 1.3 4.9 3.4 6.4v3.7l3.3-1.9c1 .2 2.1.4 3.3.4 5.5 0 10-3.9 10-8.6S17.5 1 12 1Zm0 2c4.4 0 8 3 8 6.7s-3.6 6.6-8 6.6c-1.1 0-2.1-.1-3-.4l-.5-.2-1.6.9v-1.8l-.5-.3C4.3 13.9 3.3 12 3.3 9.7 3.3 6 6.9 3 12 3Z" />
    </svg>
  );
}
function IconMessenger() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.4 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.6 7.2V22l3.3-1.8c.9.2 1.9.4 3.1.4 5.6 0 10-4.1 10-9.3S17.6 2 12 2Zm.9 11.7-2.4-2.6-4.7 2.6 5.2-5.5 2.5 2.6 4.6-2.6-5.2 5.5Z" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.2.3.8 2.9-3-.8-.3.2A8.2 8.2 0 1 1 12 3.8Zm-3.1 4c-.2 0-.5 0-.7.4-.2.4-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.6.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.5.1-.7-.3-1.4-.6-2.1-1.4-.5-.6-.9-1.3-1-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.5h-.3Z" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1.1l-2.1 2.1Z" />
    </svg>
  );
}
