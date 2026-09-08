"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Lang } from "@/lib/i18n/dictionary";

export default function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-ink/15 bg-cream-soft/80 p-1 text-[11px] uppercase tracking-[0.14em] backdrop-blur ${className}`}
      role="group"
      aria-label="Language"
    >
      {(["en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1 transition ${
            lang === l ? "bg-ink text-cream-soft" : "text-ink/60 hover:text-ink"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
