"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale, type TranslationKey } from "@/lib/luxora/i18n";

type NavLink = { key: TranslationKey; href?: string };
type NavGroup = { titleKey: TranslationKey; links: NavLink[] };

const TOP_LINKS: NavLink[] = [
  { key: "nav_dashboard", href: "/dashboard" },
  { key: "nav_calendar", href: "/dashboard/calendar" },
  { key: "nav_clients", href: "/dashboard/clients" },
  { key: "nav_messages", href: "/dashboard/messages" },
];

const GROUPS: NavGroup[] = [
  {
    titleKey: "nav_business",
    links: [
      { key: "nav_services", href: "/dashboard/services" },
      { key: "nav_staff", href: "/dashboard/staff" },
      { key: "nav_inventory", href: "/dashboard/products" },
      { key: "nav_forms", href: "/dashboard/forms" },
      { key: "nav_waitlist", href: "/dashboard/waitlist" },
      { key: "nav_message_templates", href: "/dashboard/automations" },
    ],
  },
  {
    titleKey: "nav_money",
    links: [
      { key: "nav_checkout", href: "/dashboard/calendar" },
      { key: "nav_payments", href: "/dashboard/payments" },
      { key: "nav_gift_cards", href: "/dashboard/gift-cards" },
      { key: "nav_memberships", href: "/dashboard/memberships" },
      { key: "nav_packages", href: "/dashboard/packages" },
      { key: "nav_reports", href: "/dashboard/reports" },
    ],
  },
  {
    titleKey: "nav_growth",
    links: [
      { key: "nav_marketing" },
      { key: "nav_promotions", href: "/dashboard/promotions" },
      { key: "nav_automations", href: "/dashboard/automations" },
      { key: "nav_reviews", href: "/dashboard/reviews" },
      { key: "nav_loyalty", href: "/dashboard/loyalty" },
    ],
  },
  {
    titleKey: "nav_online",
    links: [
      { key: "nav_website", href: "/dashboard/settings/website" },
      { key: "nav_online_booking", href: "/dashboard/settings/online-booking" },
      { key: "nav_online_store" },
    ],
  },
];

function NavItem({ link, lang }: { link: NavLink; lang: Locale }) {
  const pathname = usePathname();
  const isActive = link.href && (pathname === link.href || pathname?.startsWith(`${link.href}/`));
  const label = t(lang, link.key);

  if (link.href) {
    return (
      <Link
        href={link.href}
        className={`block rounded-sm px-3 py-2 text-sm transition ${
          isActive ? "bg-cream-deep font-medium text-charcoal" : "text-ink hover:bg-cream-deep hover:text-charcoal"
        }`}
      >
        {label}
      </Link>
    );
  }
  return (
    <span className="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-ink/50">
      {label}
      <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink/50">
        {t(lang, "nav_soon")}
      </span>
    </span>
  );
}

export function DashboardNav({ lang }: { lang: Locale }) {
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 p-4">
      <ul className="flex flex-col gap-0.5">
        {TOP_LINKS.map((link) => (
          <li key={link.key}>
            <NavItem link={link} lang={lang} />
          </li>
        ))}
      </ul>

      {GROUPS.map((group) => (
        <details key={group.titleKey} className="mt-4 group" open>
          <summary className="cursor-pointer select-none rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-deep">
            {t(lang, group.titleKey)}
          </summary>
          <ul className="mt-1 flex flex-col gap-0.5 border-l border-border pl-2">
            {group.links.map((link) => (
              <li key={link.key}>
                <NavItem link={link} lang={lang} />
              </li>
            ))}
          </ul>
        </details>
      ))}
    </nav>
  );
}
