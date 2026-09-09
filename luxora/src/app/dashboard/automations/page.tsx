import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { isSmsConfigured, isEmailConfigured } from "@/lib/luxora/messaging";
import { setTemplateActive } from "@/lib/luxora/message-templates-actions";
import { setAutomationRuleActive, runAutomationsNow } from "@/lib/luxora/automation-rules-actions";
import { CreateMessageTemplateForm } from "@/components/create-message-template-form";
import { CreateAutomationRuleForm } from "@/components/create-automation-rule-form";

const STATUS_LABELS: Record<string, string> = {
  sent: "Sent",
  failed: "Failed",
  skipped_no_consent: "Skipped — no consent",
  provider_not_configured: "Not sent — no provider connected",
};

export default async function AutomationsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: templates }, { data: rules }, { data: log }] = await Promise.all([
    supabase
      .from("message_templates")
      .select("id, name, type, channel, active")
      .eq("business_id", ctx.business.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("automation_rules")
      .select(
        "id, name, trigger_type, delay_hours, active, template:automation_rules_template_business_fkey(name, channel)",
      )
      .eq("business_id", ctx.business.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("message_log")
      .select("id, channel, status, created_at, client:client_id(full_name)")
      .eq("business_id", ctx.business.id)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Automations & Messaging</h1>
        <p className="mt-1 text-sm text-ink/70">
          {isSmsConfigured() || isEmailConfigured()
            ? "A provider is connected — sends will go out for real."
            : "No SMS or email provider is connected yet (SMS needs a Twilio account with A2P 10DLC registration; email needs a transactional email provider). Everything below works end-to-end, but sends are logged as \"not sent — no provider connected\" until that's set up."}
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg text-charcoal">Message Templates</h2>
        <CreateMessageTemplateForm />
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(templates ?? []).map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">{t.name}</td>
                  <td className="px-4 py-3 text-ink capitalize">{t.type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 uppercase text-ink">{t.channel}</td>
                  <td className="px-4 py-3 text-ink">{t.active ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <form action={setTemplateActive}>
                      <input type="hidden" name="templateId" value={t.id} />
                      <input type="hidden" name="active" value={(!t.active).toString()} />
                      <button type="submit" className="text-xs text-ink/60 underline underline-offset-2">
                        {t.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!templates || templates.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-ink/60">
                    No templates yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-charcoal">Automation Rules</h2>
          <form action={runAutomationsNow}>
            <button
              type="submit"
              className="rounded-sm border border-border px-3 py-1.5 text-xs text-charcoal transition hover:bg-cream-deep"
            >
              Run due automations now
            </button>
          </form>
        </div>
        <CreateAutomationRuleForm templates={(templates ?? []).filter((t) => t.active)} />
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Trigger</th>
                <th className="px-4 py-3">Delay</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(rules ?? []).map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">{r.name}</td>
                  <td className="px-4 py-3 text-ink capitalize">{r.trigger_type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-ink">{r.delay_hours}h</td>
                  <td className="px-4 py-3 text-ink">{r.template?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink">{r.active ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <form action={setAutomationRuleActive}>
                      <input type="hidden" name="ruleId" value={r.id} />
                      <input type="hidden" name="active" value={(!r.active).toString()} />
                      <button type="submit" className="text-xs text-ink/60 underline underline-offset-2">
                        {r.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!rules || rules.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-ink/60">
                    No automation rules yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink/60">
          Real unattended scheduling (running this automatically every hour, say) needs a scheduler wired
          to this business — for example enabling Postgres&apos;s pg_cron extension — which hasn&apos;t
          been turned on. Use &quot;Run due automations now&quot; in the meantime.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg text-charcoal">Recent Send Log</h2>
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {(log ?? []).map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ink">{entry.client?.full_name ?? "—"}</td>
                  <td className="px-4 py-3 uppercase text-ink">{entry.channel}</td>
                  <td className="px-4 py-3 text-ink">{STATUS_LABELS[entry.status] ?? entry.status}</td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {(!log || log.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-ink/60">
                    No messages logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
