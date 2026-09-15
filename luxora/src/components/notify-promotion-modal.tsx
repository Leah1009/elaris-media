"use client";

import { useActionState, useMemo, useState } from "react";
import { notifyClientsOfPromotion } from "@/lib/luxora/promotion-notify-actions";
import { suggestPromotionMessage } from "@/lib/luxora/promotion-message";
import type { ActionState } from "@/lib/luxora/actions";

type Client = { id: string; full_name: string };
type Promotion = { id: string; code: string; discount_type: string; discount_value: number };

const CHANNELS: { key: "email" | "sms" | "whatsapp"; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "whatsapp", label: "WhatsApp" },
];

export function NotifyPromotionModal({
  promotion,
  businessName,
  clients,
  onClose,
}: {
  promotion: Promotion;
  businessName: string;
  clients: Client[];
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(notifyClientsOfPromotion, null);
  const [audience, setAudience] = useState<"all" | "selected">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [channels, setChannels] = useState<Set<string>>(new Set(["email"]));
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(() =>
    suggestPromotionMessage(promotion.code, promotion.discount_type, promotion.discount_value, businessName),
  );

  const filteredClients = useMemo(
    () => clients.filter((c) => c.full_name.toLowerCase().includes(search.toLowerCase())),
    [clients, search],
  );

  function toggleChannel(key: string) {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleClient(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (state?.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4" onClick={onClose}>
        <div className="w-full max-w-sm rounded-sm bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm text-charcoal">{state.message}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded-sm bg-charcoal px-4 py-2 text-sm font-medium text-white hover:bg-charcoal-soft"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4" onClick={onClose}>
      <form
        action={formAction}
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-y-auto rounded-sm bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-charcoal">Notify Clients</h2>
        <p className="mt-1 text-xs text-ink/50">Promo code {promotion.code}</p>
        <input type="hidden" name="promotionId" value={promotion.id} />

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm font-medium text-charcoal">Send to</p>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input
              type="radio"
              name="audience"
              value="all"
              checked={audience === "all"}
              onChange={() => setAudience("all")}
            />
            All clients ({clients.length})
          </label>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input
              type="radio"
              name="audience"
              value="selected"
              checked={audience === "selected"}
              onChange={() => setAudience("selected")}
            />
            Select clients {selected.size > 0 ? `(${selected.size} selected)` : ""}
          </label>
        </div>

        {audience === "selected" ? (
          <div className="mt-2 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Search clients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
            />
            <div className="max-h-40 overflow-y-auto rounded-sm border border-border">
              {filteredClients.map((c) => (
                <label key={c.id} className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-sm text-charcoal last:border-0">
                  <input
                    type="checkbox"
                    name="clientIds"
                    value={c.id}
                    checked={selected.has(c.id)}
                    onChange={() => toggleClient(c.id)}
                  />
                  {c.full_name}
                </label>
              ))}
              {filteredClients.length === 0 ? <p className="px-3 py-2 text-xs text-ink/50">No clients match.</p> : null}
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm font-medium text-charcoal">Channels</p>
          <div className="flex flex-wrap gap-3">
            {CHANNELS.map((c) => (
              <label key={c.key} className="flex items-center gap-1.5 text-sm text-charcoal">
                <input
                  type="checkbox"
                  name="channels"
                  value={c.key}
                  checked={channels.has(c.key)}
                  onChange={() => toggleChannel(c.key)}
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <label htmlFor="promo-message" className="text-sm font-medium text-charcoal">
            Message
          </label>
          <textarea
            id="promo-message"
            name="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>

        {state?.error ? <p className="mt-3 text-sm text-danger">{state.error}</p> : null}

        <div className="mt-5 flex items-center justify-between">
          <button type="button" onClick={onClose} className="text-xs font-medium text-ink/50 underline underline-offset-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
