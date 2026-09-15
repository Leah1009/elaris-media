import Link from "next/link";
import { t, type Locale } from "@/lib/luxora/i18n";
import { formatCents } from "@/lib/luxora/money";

export function ReferralCard({ locale, rewardAmountCents }: { locale: Locale; rewardAmountCents: number }) {
  return (
    <div className="rounded-sm border border-gold-deep/30 bg-cream-deep p-6">
      <h2 className="font-display text-lg text-charcoal">
        {locale === "es" ? `Refiere y Gana ${formatCents(rewardAmountCents)}` : `Refer & Earn ${formatCents(rewardAmountCents)}`}
      </h2>
      <p className="mt-2 text-sm text-ink/70">{t(locale, "refer_earn_dashboard_body")}</p>
      <Link
        href="/dashboard/settings/subscription#referrals"
        className="mt-4 inline-block rounded-sm border border-gold-deep px-5 py-2 text-sm font-medium text-gold-deep transition hover:bg-gold-deep hover:text-white"
      >
        {t(locale, "invite_a_business")}
      </Link>
    </div>
  );
}
