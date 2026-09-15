import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { isSmsConfigured, isEmailConfigured, isWhatsappConfigured } from "@/lib/luxora/messaging";
import { formatInTimeZone } from "@/lib/luxora/timezone";
import { MessageComposer } from "@/components/message-composer";
import { t, type TranslationKey } from "@/lib/luxora/i18n";

const STATUS_KEYS: Record<string, TranslationKey> = {
  sent: "message_status_sent",
  failed: "message_status_failed",
  skipped_no_consent: "message_status_skipped_no_consent",
  provider_not_configured: "message_status_provider_not_configured",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: selectedClientId } = await searchParams;
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;
  const tz = ctx.business.timezone;
  const supabase = await createClient();

  const { data: allMessages } = await supabase
    .from("message_log")
    .select("id, client_id, channel, direction, body, status, created_at, client:client_id(full_name)")
    .eq("business_id", ctx.business.id)
    .order("created_at", { ascending: false });

  const threadsByClient = new Map<string, { name: string; latest: string; lastBody: string; count: number }>();
  for (const m of allMessages ?? []) {
    if (!m.client_id) continue;
    const existing = threadsByClient.get(m.client_id);
    if (!existing) {
      threadsByClient.set(m.client_id, {
        name: m.client?.full_name ?? "Client",
        latest: m.created_at,
        lastBody: m.body,
        count: 1,
      });
    } else {
      existing.count += 1;
    }
  }
  const threads = [...threadsByClient.entries()]
    .map(([clientId, v]) => ({ clientId, ...v }))
    .sort((a, b) => new Date(b.latest).getTime() - new Date(a.latest).getTime());

  const activeClientId = selectedClientId ?? threads[0]?.clientId ?? null;
  const activeMessages = (allMessages ?? []).filter((m) => m.client_id === activeClientId).reverse();
  const activeThread = threads.find((th) => th.clientId === activeClientId);

  const providerConnected = isSmsConfigured() || isEmailConfigured() || isWhatsappConfigured();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl text-charcoal">{t(lang, "messages_title")}</h1>
      {!providerConnected ? (
        <p className="rounded-sm border border-border bg-cream-deep p-3 text-sm text-charcoal">
          {t(lang, "messages_no_provider_note")}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-sm border border-border bg-white sm:grid-cols-[280px_1fr]">
        <div className="flex flex-col border-border sm:border-r">
          {threads.length === 0 ? (
            <p className="p-4 text-sm text-ink/60">{t(lang, "messages_no_threads")}</p>
          ) : (
            <ul className="flex flex-col overflow-y-auto">
              {threads.map((th) => (
                <li key={th.clientId}>
                  <a
                    href={`/dashboard/messages?client=${th.clientId}`}
                    className={`flex items-start gap-3 border-b border-border px-4 py-3 text-sm transition hover:bg-cream-deep ${
                      th.clientId === activeClientId ? "bg-cream-deep" : ""
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal text-xs font-medium text-white">
                      {initials(th.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate ${th.clientId === activeClientId ? "font-medium text-charcoal" : "text-charcoal"}`}>
                          {th.name}
                        </span>
                        <span className="shrink-0 text-[11px] text-ink/40">
                          {formatInTimeZone(new Date(th.latest), tz, { month: "short", day: "numeric" })}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink/50">{th.lastBody}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex min-h-[420px] flex-col p-4">
          {activeClientId ? (
            <>
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal text-xs font-medium text-white">
                  {initials(activeThread?.name ?? "")}
                </span>
                <h2 className="font-display text-lg text-charcoal">{activeThread?.name}</h2>
              </div>

              <div className="mt-4 flex flex-1 flex-col gap-2.5 overflow-y-auto">
                {activeMessages.map((m) => {
                  const isInbound = m.direction === "inbound";
                  return (
                    <div key={m.id} className={`flex ${isInbound ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                          isInbound
                            ? "rounded-bl-sm border border-border bg-white text-charcoal"
                            : "rounded-br-sm bg-charcoal text-white"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.body}</p>
                        <div
                          className={`mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide ${
                            isInbound ? "text-ink/40" : "text-white/50"
                          }`}
                        >
                          <span>{m.channel}</span>
                          <span aria-hidden>·</span>
                          <span>{formatInTimeZone(new Date(m.created_at), tz, { hour: "numeric", minute: "2-digit" })}</span>
                          {!isInbound ? (
                            <>
                              <span aria-hidden>·</span>
                              <span>{t(lang, STATUS_KEYS[m.status] ?? "message_status_failed")}</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <MessageComposer clientId={activeClientId} locale={lang} enabled={providerConnected} />
            </>
          ) : (
            <p className="text-sm text-ink/60">{t(lang, "messages_select_conversation")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
