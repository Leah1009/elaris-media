import Link from "next/link";
import { requirePlatformAdmin } from "@/lib/luxora/platform-admin";
import { logout } from "@/lib/luxora/actions";

const LINKS = [
  { label: "Overview", href: "/admin" },
  { label: "Businesses", href: "/admin/businesses" },
  { label: "Plans", href: "/admin/plans" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-border bg-charcoal px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg text-white">Luxore Admin</span>
          <nav className="flex gap-4">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-white/80 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-white/80 hover:text-white">
            My Dashboard
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-white/80 hover:text-white">
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
