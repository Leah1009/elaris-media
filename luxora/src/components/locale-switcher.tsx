"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPublicLocale } from "@/lib/luxora/locale-actions";
import type { Locale } from "@/lib/luxora/i18n";

export function LocaleSwitcher({ locale, dark = false }: { locale: Locale; dark?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || pending) return;
    startTransition(async () => {
      await setPublicLocale(next);
      router.refresh();
    });
  }

  const base = dark ? "text-white/70 hover:text-white" : "text-ink/60 hover:text-charcoal";
  const activeCls = dark ? "text-white" : "text-charcoal";

  return (
    <div className="flex items-center gap-1 text-xs font-medium tracking-wide">
      <button type="button" onClick={() => switchTo("en")} aria-pressed={locale === "en"} className={locale === "en" ? activeCls : base}>
        EN
      </button>
      <span className={dark ? "text-white/40" : "text-ink/30"}>/</span>
      <button type="button" onClick={() => switchTo("es")} aria-pressed={locale === "es"} className={locale === "es" ? activeCls : base}>
        ES
      </button>
    </div>
  );
}
