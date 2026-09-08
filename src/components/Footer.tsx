"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-ink px-6 py-16 text-cream-soft">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
        <div>
          <div className="font-display text-lg">
            Elaris <span className="text-gold-light">Media</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream-soft/60">{t("footer.about")}</p>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-gold-light">{t("footer.quickLinks")}</div>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-cream-soft/70">
            <li><a href="#services" className="hover:text-cream-soft">{t("nav.services")}</a></li>
            <li><a href="#dental-billing" className="hover:text-cream-soft">{t("nav.dental")}</a></li>
            <li><a href="#admin-services" className="hover:text-cream-soft">{t("nav.admin")}</a></li>
            <li><a href="#about" className="hover:text-cream-soft">{t("nav.about")}</a></li>
            <li><a href="#faq" className="hover:text-cream-soft">{t("nav.faq")}</a></li>
          </ul>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-gold-light">{t("footer.contact")}</div>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-cream-soft/70">
            <li><a href="#contact" className="hover:text-cream-soft">{t("nav.bookCall")}</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-cream-soft/10 pt-6 text-[12px] text-cream-soft/40 sm:flex-row sm:items-center sm:justify-between">
        <span>© {year} Elaris Media. {t("footer.rights")}</span>
        <div className="flex gap-5">
          <a href="#" className="hover:text-cream-soft/70">{t("footer.privacy")}</a>
          <a href="#" className="hover:text-cream-soft/70">{t("footer.terms")}</a>
        </div>
      </div>
    </footer>
  );
}
