"use client";

import { useRouter, usePathname } from "next/navigation";
import { t, type Locale } from "@/lib/luxora/i18n";

export function BackButton({ lang }: { lang: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/dashboard") return null;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-4 flex items-center gap-1.5 text-sm text-ink transition hover:text-gold-deep"
    >
      <span aria-hidden>←</span> {t(lang, "back")}
    </button>
  );
}
