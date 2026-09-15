"use client";

import { useMemo, useState } from "react";
import { HELP_CATEGORIES } from "@/lib/luxora/help-center-data";
import { t, type Locale } from "@/lib/luxora/i18n";

export function HelpCenter({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HELP_CATEGORIES;
    return HELP_CATEGORIES.map((cat) => ({
      ...cat,
      articles: cat.articles.filter(
        (a) => a.title[locale].toLowerCase().includes(q) || a.body[locale].toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.articles.length > 0);
  }, [query, locale]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(locale, "help_search_placeholder")}
        className="w-full rounded-sm border border-border bg-white px-4 py-3 text-base text-charcoal outline-none focus:border-gold-deep"
      />

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/60">{t(locale, "help_no_results")}</p>
      ) : (
        <div className="mt-10 flex flex-col gap-12">
          {filtered.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-20">
              <h2 className="font-display text-xl text-charcoal">{cat.title[locale]}</h2>
              <div className="mt-4 divide-y divide-border">
                {cat.articles.map((article) => (
                  <details key={article.id} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-charcoal">
                      {article.title[locale]}
                      <span className="shrink-0 text-lg text-gold-deep transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{article.body[locale]}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
