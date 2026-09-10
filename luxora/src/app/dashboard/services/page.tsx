import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { t } from "@/lib/luxora/i18n";

export default async function ServicesPage() {
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id, name, category, duration_minutes, price_cents, active, color")
    .eq("business_id", ctx.business.id)
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">{t(lang, "services_title")}</h1>
        <Link
          href="/dashboard/services/new"
          className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
        >
          {t(lang, "add_service")}
        </Link>
      </div>

      {services && services.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">{t(lang, "col_name")}</th>
                <th className="px-4 py-3">{t(lang, "col_category")}</th>
                <th className="px-4 py-3">{t(lang, "col_duration")}</th>
                <th className="px-4 py-3">{t(lang, "col_price")}</th>
                <th className="px-4 py-3">{t(lang, "col_status")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: s.color ?? "#a97142" }}
                      />
                      {s.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{s.category ?? "—"}</td>
                  <td className="px-4 py-3 text-ink">{s.duration_minutes} min</td>
                  <td className="px-4 py-3 text-ink">{formatCents(s.price_cents)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        s.active
                          ? "rounded-full bg-cream-deep px-2 py-0.5 text-xs text-charcoal"
                          : "rounded-full border border-border px-2 py-0.5 text-xs text-ink/50"
                      }
                    >
                      {s.active ? t(lang, "active") : t(lang, "inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/services/${s.id}/edit`}
                      className="text-sm font-medium text-gold-deep underline underline-offset-2"
                    >
                      {t(lang, "edit")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          {t(lang, "no_services_yet")}
        </p>
      )}
    </div>
  );
}
