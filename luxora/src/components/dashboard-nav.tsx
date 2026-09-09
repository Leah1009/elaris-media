import Link from "next/link";

type NavLink = { label: string; href?: string };
type NavGroup = { title: string; links: NavLink[] };

const TOP_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Calendar", href: "/dashboard/calendar" },
  { label: "Clients", href: "/dashboard/clients" },
  { label: "Messages" },
];

const GROUPS: NavGroup[] = [
  {
    title: "Business",
    links: [
      { label: "Services", href: "/dashboard/services" },
      { label: "Staff", href: "/dashboard/staff" },
      { label: "Inventory" },
      { label: "Products" },
      { label: "Forms" },
    ],
  },
  {
    title: "Money",
    links: [
      { label: "Checkout / POS" },
      { label: "Payments" },
      { label: "Gift Cards" },
      { label: "Memberships" },
      { label: "Reports" },
    ],
  },
  {
    title: "Growth",
    links: [
      { label: "Marketing" },
      { label: "Promotions" },
      { label: "Automations" },
      { label: "Reviews" },
      { label: "Loyalty" },
    ],
  },
  {
    title: "Online",
    links: [{ label: "Website" }, { label: "Online Booking" }, { label: "Online Store" }],
  },
  {
    title: "Settings",
    links: [
      { label: "Business Profile" },
      { label: "Locations", href: "/dashboard/settings/locations" },
      { label: "Payments" },
      { label: "Hardware" },
      { label: "Subscription", href: "/dashboard/settings/subscription" },
    ],
  },
];

function NavItem({ link }: { link: NavLink }) {
  if (link.href) {
    return (
      <Link
        href={link.href}
        className="block rounded-sm px-3 py-2 text-sm text-charcoal transition hover:bg-cream-deep"
      >
        {link.label}
      </Link>
    );
  }
  return (
    <span className="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-ink/50">
      {link.label}
      <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink/50">
        Soon
      </span>
    </span>
  );
}

export function DashboardNav() {
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 p-4">
      <ul className="flex flex-col gap-0.5">
        {TOP_LINKS.map((link) => (
          <li key={link.label}>
            <NavItem link={link} />
          </li>
        ))}
      </ul>

      {GROUPS.map((group) => (
        <details key={group.title} className="mt-3 group" open>
          <summary className="cursor-pointer select-none rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-deep">
            {group.title}
          </summary>
          <ul className="mt-1 flex flex-col gap-0.5">
            {group.links.map((link) => (
              <li key={link.label}>
                <NavItem link={link} />
              </li>
            ))}
          </ul>
        </details>
      ))}
    </nav>
  );
}
