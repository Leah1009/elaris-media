"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { waLink } from "@/lib/constants";

export default function FloatingWhatsApp() {
  const { t, lang } = useLanguage();
  const message =
    lang === "es"
      ? "Hola Elaris Media! Me gustaría agendar una llamada de estrategia gratis."
      : "Hi Elaris Media! I'd like to book a free strategy call.";

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener"
      aria-label={t("whatsapp.chat")}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-cream-soft shadow-lg shadow-ink/20 transition hover:bg-gold-deep"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.4-1.36a9.9 9.9 0 0 0 4.64 1.16h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.05h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.78.83-3.02-.2-.31a8.14 8.14 0 0 1-1.26-4.36c0-4.53 3.7-8.22 8.25-8.22 2.2 0 4.27.86 5.83 2.42a8.16 8.16 0 0 1 2.42 5.82c0 4.53-3.7 8.22-8.26 8.22Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.21-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42-.14 0-.31-.01-.47-.01a.9.9 0 0 0-.65.31c-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
      </svg>
      <span className="hidden text-[12px] uppercase tracking-[0.1em] sm:inline">{t("whatsapp.chat")}</span>
    </a>
  );
}
