"use client";

import { formatCents } from "@/lib/luxora/money";
import { t, type Locale } from "@/lib/luxora/i18n";
import { CopyLinkButton } from "@/components/copy-link-button";
import type { ReferralSummary } from "@/lib/luxora/referrals-data";

const STATUS_KEY: Record<string, string> = {
  signed_up: "referral_status_signed_up",
  trialing: "referral_status_trialing",
  qualified: "referral_status_qualified",
  rejected: "referral_status_rejected",
};

const REWARD_KEY: Record<string, string> = {
  pending: "reward_status_pending",
  qualified: "reward_status_qualified",
  issued: "reward_status_issued",
};

export function ReferralSection({ locale, summary }: { locale: Locale; summary: ReferralSummary }) {
  async function handleShare() {
    const shareText =
      locale === "es"
        ? `¡Únete a Luxore! Usa mi enlace: ${summary.referralLink}`
        : `Join Luxore! Use my link: ${summary.referralLink}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, url: summary.referralLink });
      } catch {
        // User cancelled the native share sheet — nothing to do.
      }
    }
  }

  return (
    <section id="referrals" className="rounded-sm border border-gold-deep/30 bg-white p-6">
      <h2 className="font-display text-xl text-charcoal">
        {locale === "es" ? `Refiere y Gana ${formatCents(summary.rewardAmountCents)}` : `Refer & Earn ${formatCents(summary.rewardAmountCents)}`}
      </h2>
      <p className="mt-2 text-sm text-ink/70">{t(locale, "refer_earn_subscription_body")}</p>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/60">{t(locale, "your_referral_link")}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="rounded-sm bg-cream-deep px-3 py-2 font-mono text-xs text-charcoal">{summary.referralLink}</span>
          <CopyLinkButton url={summary.referralLink} label={t(locale, "copy_link")} copiedLabel={t(locale, "link_copied")} />
          {typeof navigator !== "undefined" && "share" in navigator ? (
            <button
              type="button"
              onClick={handleShare}
              className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-charcoal transition hover:border-gold-deep"
            >
              {t(locale, "share_button")}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-sm bg-cream-deep p-3 text-center">
          <p className="font-display text-xl text-charcoal">{summary.totalReferrals}</p>
          <p className="text-xs text-ink/60">{t(locale, "referral_total_referrals")}</p>
        </div>
        <div className="rounded-sm bg-cream-deep p-3 text-center">
          <p className="font-display text-xl text-charcoal">{summary.qualifiedCount}</p>
          <p className="text-xs text-ink/60">{t(locale, "referral_successful")}</p>
        </div>
        <div className="rounded-sm bg-cream-deep p-3 text-center">
          <p className="font-display text-xl text-charcoal">{formatCents(summary.totalEarnedCents)}</p>
          <p className="text-xs text-ink/60">{t(locale, "referral_rewards_earned")}</p>
        </div>
      </div>

      {summary.activity.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-charcoal">{t(locale, "referral_activity_title")}</h3>
          <div className="mt-2 overflow-x-auto rounded-sm border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                  <th className="px-4 py-2.5">{t(locale, "pay_col_date")}</th>
                  <th className="px-4 py-2.5">{t(locale, "referral_col_status")}</th>
                  <th className="px-4 py-2.5">{t(locale, "referral_col_reward")}</th>
                </tr>
              </thead>
              <tbody>
                {summary.activity.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-ink">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5 text-charcoal">{t(locale, STATUS_KEY[a.status] as never)}</td>
                    <td className="px-4 py-2.5 text-ink">{a.rewardStatus ? t(locale, REWARD_KEY[a.rewardStatus] as never) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">{t(locale, "referral_no_activity")}</p>
      )}

      <p className="mt-5 text-xs text-ink/50">
        <a href="/terms" className="underline underline-offset-2">
          {t(locale, "referral_terms_apply")}
        </a>
      </p>
    </section>
  );
}
