"use client";

import { useState } from "react";
import { NotifyPromotionModal } from "@/components/notify-promotion-modal";

type Client = { id: string; full_name: string };
type Promotion = { id: string; code: string; discount_type: string; discount_value: number };

export function PromotionNotifyButton({
  promotion,
  businessName,
  clients,
}: {
  promotion: Promotion;
  businessName: string;
  clients: Client[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-gold-deep underline underline-offset-2">
        Notify Clients
      </button>
      {open ? (
        <NotifyPromotionModal promotion={promotion} businessName={businessName} clients={clients} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
