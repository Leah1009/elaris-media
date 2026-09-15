"use client";

import { useActionState, useState } from "react";
import { createHardwareOrder } from "@/lib/luxora/hardware-actions";
import { formatCents } from "@/lib/luxora/money";
import { t, type Locale } from "@/lib/luxora/i18n";
import type { ActionState } from "@/lib/luxora/actions";

type Product = { id: string; name: string; sellingPriceCents: number };
type Location = { id: string; name: string };

export function HardwareOrderModal({
  product,
  locations,
  locale,
  onClose,
}: {
  product: Product;
  locations: Location[];
  locale: Locale;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createHardwareOrder, null);
  const [quantity, setQuantity] = useState(1);
  const subtotalCents = product.sellingPriceCents * quantity;

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
        <h2 className="font-display text-xl text-charcoal">
          {t(locale, "hardware_order_title")} — {product.name}
        </h2>
        <input type="hidden" name="hardwareProductId" value={product.id} />

        <div className="mt-4 flex flex-col gap-1.5">
          <label htmlFor="quantity" className="text-sm font-medium text-charcoal">
            {t(locale, "hardware_quantity")}
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            max={20}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>

        {locations.length > 1 ? (
          <div className="mt-4 flex flex-col gap-1.5">
            <label htmlFor="locationId" className="text-sm font-medium text-charcoal">
              {t(locale, "hardware_location")}
            </label>
            <select id="locationId" name="locationId" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        ) : locations[0] ? (
          <input type="hidden" name="locationId" value={locations[0].id} />
        ) : null}

        <h3 className="mt-5 text-sm font-medium text-charcoal">{t(locale, "hardware_shipping_info")}</h3>
        <div className="mt-2 flex flex-col gap-2.5">
          <input name="shippingName" placeholder={t(locale, "hardware_shipping_name")} required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
          <input name="shippingAddressLine1" placeholder={t(locale, "hardware_shipping_address1")} required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
          <input name="shippingAddressLine2" placeholder={t(locale, "hardware_shipping_address2")} className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
          <div className="grid grid-cols-3 gap-2">
            <input name="shippingCity" placeholder={t(locale, "hardware_shipping_city")} required className="col-span-1 rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
            <input name="shippingState" placeholder={t(locale, "hardware_shipping_state")} required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
            <input name="shippingZip" placeholder={t(locale, "hardware_shipping_zip")} required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
          </div>
          <input name="shippingPhone" placeholder={t(locale, "hardware_shipping_phone")} className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>

        <div className="mt-5 rounded-sm bg-cream-deep p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/70">{t(locale, "hardware_subtotal")}</span>
            <span className="font-medium text-charcoal">{formatCents(subtotalCents)}</span>
          </div>
          <p className="mt-2 text-xs text-ink/60">
            Shipping and tax will be confirmed separately. {t(locale, "hardware_one_time_purchase")}
          </p>
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
            {pending ? "…" : t(locale, "hardware_submit_order")}
          </button>
        </div>
      </form>
    </div>
  );
}
