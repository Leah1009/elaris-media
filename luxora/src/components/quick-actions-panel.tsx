"use client";

import { useState } from "react";
import Link from "next/link";
import { t, type Locale } from "@/lib/luxora/i18n";
import { BlockTimeModal } from "@/components/block-time-modal";
import type { CalendarStaffOption, CalendarLocationOption } from "@/components/calendar-create-choice-modal";

export function QuickActionsPanel({
  lang,
  todayDate,
  staff,
  locations,
}: {
  lang: Locale;
  todayDate: string;
  staff: CalendarStaffOption[];
  locations: CalendarLocationOption[];
}) {
  const [blockTimeOpen, setBlockTimeOpen] = useState(false);

  const actions: { key: string; labelKey: Parameters<typeof t>[1]; href?: string; onClick?: () => void }[] = [
    { key: "new-appointment", labelKey: "new_appointment", href: `/dashboard/calendar/new?date=${todayDate}` },
    { key: "new-client", labelKey: "new_client", href: "/dashboard/clients/new" },
    { key: "checkout", labelKey: "quick_action_checkout", href: "/dashboard/calendar" },
    { key: "block-time", labelKey: "quick_action_block_time", onClick: () => setBlockTimeOpen(true) },
  ];

  return (
    <>
      <div className="flex flex-col gap-2">
        {actions.map((action) =>
          action.href ? (
            <Link
              key={action.key}
              href={action.href}
              className="flex items-center justify-between rounded-sm border border-border bg-white px-4 py-3 text-sm font-medium text-charcoal transition hover:border-gold-deep"
            >
              {t(lang, action.labelKey)}
              <span aria-hidden className="text-ink/40">
                →
              </span>
            </Link>
          ) : (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              className="flex items-center justify-between rounded-sm border border-border bg-white px-4 py-3 text-left text-sm font-medium text-charcoal transition hover:border-gold-deep"
            >
              {t(lang, action.labelKey)}
              <span aria-hidden className="text-ink/40">
                →
              </span>
            </button>
          ),
        )}
      </div>

      {blockTimeOpen ? (
        <BlockTimeModal
          selection={{ date: todayDate, time: "09:00" }}
          staff={staff}
          locations={locations}
          onClose={() => setBlockTimeOpen(false)}
          onBack={() => setBlockTimeOpen(false)}
        />
      ) : null}
    </>
  );
}
