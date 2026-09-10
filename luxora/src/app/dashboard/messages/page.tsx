import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { isSmsConfigured, isEmailConfigured } from "@/lib/luxora/messaging";
import { t } from "@/lib/luxora/i18n";

const STATUS_LABELS: Record<string, string> = {
  sent: "Sent",
  failed: "Failed",
  skipped_no_consent: "Skipped — no consent",
  provider_not_configured: "Not sent — no provider connected",
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: selectedClientId } = await searchParams;
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;
  const supabase = await createClient();

  const { data: allMessages } = await supabase
    .from("message_log")
    .select("id, client_id, channel, body, status, created_at, client:client_id(full_name)")
    .eq("business_id", ctx.business.id)
    .order("created_at", { ascending: false });

  const threadsByClient = new Map<string, { name: string; latest: string; count: number }>();
  for (const m of allMessages ?? []) {
    if (!m.client_id) continue;
    const existing = threadsByClient.get(m.client_id);
    if (!existing) {
      threadsByClient.set(m.client_id, { name: m.client?.full_name ?? "Client", latest: m.created_at, count: 1 });
    } else {
      existing.count += 1;
    }
  }
  const threads = [...threadsByClient.entries()].map(([clientId, t]) => ({ clientId, ...t }));

  const activeClientId = selectedClientId ?? threads[0]?.clientId ?? null;
  const activeMessages = (allMessages ?? []).filter((m) => m.client_id === activeClientId).reverse();
  const activeName = threads.find((t) => t.clientId === activeClientId)?.name;

  const configured = isSmsConfigured() || isEmailConfigured();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-charcoal">{t(lang, "messages_title")}</h1>
      {!configured ? (
        <p className="rounded-sm border border-border bg-cream-deep p-3 text-sm text-charcoal">
          No SMS or email provider is connected — these are the messages the system has attempted to send
          (deposit reminders, review requests, automations). Client replies will appear here once a real
          provider is connected.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-sm border border-border bg-white">
          {threads.length === 0 ? (
            <p className="p-4 text-sm text-ink/60">No messages yet.</p>
          ) : (
            <ul className="flex flex-col">
              {threads.map((t) => (
                <li key={t.clientId}>
                  <Link
                    href={`/dashboard/messages?client=${t.clientId}`}
                    className={`block border-b border-border px-4 py-3 text-sm transition hover:bg-cream-deep ${
                      t.clientId === activeClientId ? "bg-cream-deep font-medium text-charcoal" : "text-ink"
                    }`}
                  >
                    <p>{t.name}</p>
                    <p className="text-xs text-ink/50">{t.count} message{t.count === 1 ? "" : "s"}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-sm border border-border bg-white p-4">
          {activeClientId ? (
            <>
              <h2 className="font-display text-lg text-charcoal">{activeName}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {activeMessages.map((m) => (
                  <div key={m.id} className="rounded-sm bg-cream-deep p-3">
                    <div className="flex items-center justify-between text-xs text-ink/60">
                      <span className="uppercase">{m.channel}</span>
                      <span>{new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-sm text-charcoal">{m.body}</p>
                    <p className="mt-1 text-xs text-ink/50">{STATUS_LABELS[m.status] ?? m.status}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-ink/60">Select a conversation.</p>
          )}
        </div>
      </div>
    </div>
  );
}
