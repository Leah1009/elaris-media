"use client";

import { useRouter } from "next/navigation";
import { t, type Locale } from "@/lib/luxora/i18n";

export type LocationOption = { id: string; name: string; city: string | null; state: string | null };

/**
 * Multi-location businesses only: jumps into the Calendar's existing
 * location filter (?locationId=) rather than introducing a second,
 * parallel "selected location" concept across the dashboard's own queries.
 */
export function LocationQuickSwitch({
  locations,
  defaultLocationId,
  lang,
}: {
  locations: LocationOption[];
  defaultLocationId?: string;
  lang: Locale;
}) {
  const router = useRouter();

  return (
    <select
      aria-label={t(lang, "switch_location")}
      defaultValue={defaultLocationId ?? locations[0]?.id}
      onChange={(e) => {
        if (e.target.value) router.push(`/dashboard/calendar?locationId=${e.target.value}`);
      }}
      className="-ml-1 cursor-pointer appearance-none rounded-sm border-none bg-transparent py-0.5 pl-1 pr-4 text-xs text-ink/60 outline-none hover:text-charcoal"
    >
      {locations.map((l) => (
        <option key={l.id} value={l.id}>
          {l.city ? `${l.city}${l.state ? `, ${l.state}` : ""}` : l.name}
        </option>
      ))}
    </select>
  );
}
