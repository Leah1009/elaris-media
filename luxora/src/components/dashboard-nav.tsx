"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale, type TranslationKey } from "@/lib/luxora/i18n";

type NavLink = { key: TranslationKey; href?: string };
type NavGroup = { id: string; titleKey: TranslationKey; links: NavLink[] };

const TOP_LINKS: NavLink[] = [
  { key: "nav_dashboard", href: "/dashboard" },
  { key: "nav_calendar", href: "/dashboard/calendar" },
  { key: "nav_clients", href: "/dashboard/clients" },
  { key: "nav_messages", href: "/dashboard/messages" },
];

const GROUPS: NavGroup[] = [
  {
    id: "business",
    titleKey: "nav_business",
    links: [
      { key: "nav_services", href: "/dashboard/services" },
      { key: "nav_staff", href: "/dashboard/staff" },
      { key: "nav_inventory", href: "/dashboard/products" },
      { key: "nav_forms", href: "/dashboard/forms" },
      { key: "nav_waitlist", href: "/dashboard/waitlist" },
    ],
  },
  {
    id: "money",
    titleKey: "nav_money",
    links: [
      { key: "nav_checkout", href: "/dashboard/calendar" },
      { key: "nav_payments", href: "/dashboard/payments" },
      { key: "nav_gift_cards", href: "/dashboard/gift-cards" },
      { key: "nav_memberships", href: "/dashboard/memberships" },
      { key: "nav_packages", href: "/dashboard/packages" },
    ],
  },
  {
    id: "growth",
    titleKey: "nav_growth",
    links: [
      { key: "nav_marketing" },
      { key: "nav_promotions", href: "/dashboard/promotions" },
      { key: "nav_automations", href: "/dashboard/automations" },
      { key: "nav_reviews", href: "/dashboard/reviews" },
      { key: "nav_loyalty", href: "/dashboard/loyalty" },
      { key: "nav_message_templates", href: "/dashboard/automations" },
    ],
  },
  {
    id: "online",
    titleKey: "nav_online",
    links: [
      { key: "nav_website", href: "/dashboard/settings/website" },
      { key: "nav_online_booking", href: "/dashboard/settings/online-booking" },
    ],
  },
  {
    id: "insights",
    titleKey: "nav_insights",
    links: [{ key: "nav_reports", href: "/dashboard/reports" }],
  },
  {
    id: "settings",
    titleKey: "settings",
    links: [
      { key: "nav_business_profile", href: "/dashboard/settings/business-profile" },
      { key: "nav_locations", href: "/dashboard/settings/locations" },
      { key: "nav_payment_settings", href: "/dashboard/settings/payments" },
      { key: "nav_subscription", href: "/dashboard/settings/subscription" },
    ],
  },
];

function isActiveHref(pathname: string | null, href?: string) {
  return Boolean(href) && (pathname === href || pathname?.startsWith(`${href}/`));
}

function NavItem({ link, lang, onNavigate }: { link: NavLink; lang: Locale; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = isActiveHref(pathname, link.href);
  const label = t(lang, link.key);

  if (link.href) {
    return (
      <Link
        href={link.href}
        onClick={onNavigate}
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

function NavGroupSection({ group, lang, onNavigate }: { group: NavGroup; lang: Locale; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isGroupActive = group.links.some((l) => isActiveHref(pathname, l.href));

  // Derived, not effect-driven: defaults to open whenever the active route
  // is inside this group, and a manual toggle overrides that for the rest
  // of the session (the sidebar itself persists across client navigations
  // within the dashboard layout, so this "remembers" without localStorage).
  const [override, setOverride] = useState<boolean | null>(null);
  const open = override ?? isGroupActive;

  function toggle() {
    setOverride(!open);
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition ${
          isGroupActive ? "text-gold-deep" : "text-ink/50 hover:text-gold-deep"
        }`}
      >
        {t(lang, group.titleKey)}
        <span aria-hidden className={`text-[10px] transition-transform ${open ? "rotate-90" : ""}`}>
          ▸
        </span>
      </button>
      {open ? (
        <ul className="mt-1 flex flex-col gap-0.5 border-l border-border pl-2">
          {group.links.map((link) => (
            <li key={link.key}>
              <NavItem link={link} lang={lang} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function DashboardNav({ lang, onNavigate }: { lang: Locale; onNavigate?: () => void }) {
  const groups = useMemo(() => GROUPS, []);

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 p-4">
      <ul className="flex flex-col gap-0.5">
        {TOP_LINKS.map((link) => (
          <li key={link.key}>
            <NavItem link={link} lang={lang} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>

      {groups.map((group) => (
        <NavGroupSection key={group.id} group={group} lang={lang} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}
