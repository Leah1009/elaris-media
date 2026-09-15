"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale } from "@/lib/luxora/i18n";

export function TrialBanner({ lang, remaining, trialUrgent }: { lang: Locale; remaining: number; trialUrgent: boolean }) {
  const pathname = usePathname();
  const onSubscriptionPage = pathname === "/dashboard/settings/subscription";

  return (
    <div
      className={`border-b px-4 py-2 text-center text-sm sm:px-6 ${
        trialUrgent ? "border-danger/30 bg-danger/5 text-danger" : "border-border bg-cream-deep text-charcoal"
      }`}
    >
      {remaining} {t(lang, remaining === 1 ? "day_remaining" : "days_remaining")}
      {onSubscriptionPage ? null : (
        <>
          {" "}
          <Link href="/dashboard/settings/subscription" className="font-medium underline underline-offset-2">
            {t(lang, "view_plans")}
          </Link>
        </>
      )}
    </div>
  );
}
