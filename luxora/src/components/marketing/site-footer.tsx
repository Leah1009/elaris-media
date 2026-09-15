import Link from "next/link";
import { t, type Locale } from "@/lib/luxora/i18n";
import { SOCIAL_CONFIG } from "@/lib/luxora/social-config";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { CookiePreferencesLink } from "@/components/cookie-preferences";

type FooterLink = { label: string; href: string };

function footerGroups(locale: Locale): { title: string; links: FooterLink[] }[] {
  return [
    {
      title: t(locale, "footer_product"),
      links: [
        { label: t(locale, "nav_features"), href: "/#features" },
        { label: t(locale, "footer_online_booking"), href: "/#online-booking" },
        { label: t(locale, "nav_clients"), href: "/#clients" },
        { label: t(locale, "nav_payments"), href: "/#payments" },
        { label: t(locale, "nav_marketing"), href: "/#marketing" },
        { label: t(locale, "feature_website_title"), href: "/#website" },
      ],
    },
    {
      title: t(locale, "footer_company"),
      links: [
        { label: t(locale, "nav_about"), href: "/#about" },
        { label: t(locale, "footer_contact"), href: "/contact" },
        { label: t(locale, "footer_support"), href: "/support" },
        { label: t(locale, "footer_help_center"), href: "/help" },
        { label: t(locale, "footer_contact_support"), href: "/support/contact" },
      ],
    },
    {
      title: t(locale, "footer_legal"),
      links: [
        { label: t(locale, "footer_privacy"), href: "/privacy" },
        { label: t(locale, "footer_terms"), href: "/terms" },
      ],
    },
  ];
}

const SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: "Instagram", url: SOCIAL_CONFIG.instagramUrl },
  { label: "Facebook", url: SOCIAL_CONFIG.facebookUrl },
  { label: "TikTok", url: SOCIAL_CONFIG.tiktokUrl },
].filter((s) => s.url);

export function SiteFooter({ locale }: { locale: Locale }) {
  const groups = footerGroups(locale);

  return (
    <footer className="border-t border-border px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4 sm:gap-8">
          <div>
            <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-charcoal">
              Luxore
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-ink/60">{t(locale, "footer_tagline")}</p>
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{group.title}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/70 transition hover:text-gold-deep"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {group.title === t(locale, "footer_legal") ? (
                  <li>
                    <CookiePreferencesLink locale={locale} className="text-sm text-ink/70 transition hover:text-gold-deep" />
                  </li>
                ) : null}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-ink/50">
            © {new Date().getFullYear()} Luxore. {t(locale, "footer_rights")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-ink/40">
            {SOCIAL_LINKS.length > 0 ? (
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition hover:text-gold-deep"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
            <span className="flex items-center gap-2">
              <span>{t(locale, "footer_language_full")}:</span>
              <LocaleSwitcher locale={locale} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
