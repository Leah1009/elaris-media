import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { toggleFormActive, createNewClientTemplateForm } from "@/lib/luxora/forms-actions";
import { t } from "@/lib/luxora/i18n";

const TRIGGER_LABELS: Record<string, string> = {
  manual: "Manual",
  first_visit_only: "First visit only",
  every_appointment: "Every appointment",
};

export default async function FormsPage() {
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;
  const supabase = await createClient();

  const { data: forms } = await supabase
    .from("client_forms")
    .select("id, name, trigger, is_active")
    .eq("business_id", ctx.business.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-charcoal">{t(lang, "forms_title")}</h1>
        <Link
          href="/dashboard/forms/new"
          className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
        >
          {t(lang, "new_form")}
        </Link>
      </div>

      <div className="rounded-sm border border-dashed border-gold-deep/50 bg-gold/5 p-4">
        <p className="text-sm font-medium text-charcoal">Start from a template</p>
        <p className="mt-1 text-sm text-ink">
          &ldquo;New Client&rdquo; collects name, phone, email, date of birth, and allergies — and keeps the
          client&apos;s profile in sync automatically. Fully editable afterward.
        </p>
        <form action={createNewClientTemplateForm} className="mt-3">
          <button
            type="submit"
            className="rounded-sm border border-gold-deep px-4 py-2 text-sm font-medium text-gold-deep transition hover:bg-gold-deep hover:text-white"
          >
            Use &ldquo;New Client&rdquo; Template
          </button>
        </form>
      </div>

      {forms && forms.length > 0 ? (
        <div className="flex flex-col gap-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="flex items-center justify-between rounded-sm border border-border bg-white p-4"
            >
              <div>
                <Link
                  href={`/dashboard/forms/${form.id}/edit`}
                  className="font-medium text-charcoal underline-offset-2 hover:underline"
                >
                  {form.name}
                </Link>
                <p className="text-xs text-ink/60">{TRIGGER_LABELS[form.trigger] ?? form.trigger}</p>
              </div>
              <form action={toggleFormActive}>
                <input type="hidden" name="formId" value={form.id} />
                <input type="hidden" name="isActive" value={String(form.is_active)} />
                <button
                  type="submit"
                  className={
                    form.is_active
                      ? "rounded-full bg-cream-deep px-3 py-1 text-xs text-charcoal"
                      : "rounded-full border border-border px-3 py-1 text-xs text-ink/50"
                  }
                >
                  {form.is_active ? "Active" : "Inactive"}
                </button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          No forms yet. Create a consent, intake or allergy form to request from clients.
        </p>
      )}
    </div>
  );
}
