"use client";

import { useState } from "react";
import { formatCents } from "@/lib/luxora/money";
import { t, type Locale } from "@/lib/luxora/i18n";
import { HardwareOrderModal } from "@/components/payments/hardware-order-modal";

type Product = { id: string; name: string; description: string | null; imageUrl: string | null; sellingPriceCents: number | null };
type Location = { id: string; name: string };
type Device = { id: string; label: string; deviceType: string; locationName: string | null; status: string };

export function HardwareTab({
  locale,
  cardReaders,
  smartTerminals,
  locations,
  devices,
}: {
  locale: Locale;
  cardReaders: Product[];
  smartTerminals: Product[];
  locations: Location[];
  devices: Device[];
}) {
  const [orderingProduct, setOrderingProduct] = useState<Product | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">{t(locale, "hardware_title")}</h1>
        <p className="mt-1 text-sm text-ink/70">{t(locale, "hardware_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col rounded-sm border border-border bg-white p-6">
          <h2 className="font-display text-lg text-charcoal">{t(locale, "hardware_tap_dash_headline")}</h2>
          <p className="mt-2 flex-1 text-sm text-ink/70">{t(locale, "hardware_tap_dash_body")}</p>
          <button
            type="button"
            disabled
            title="Requires the Luxore mobile app, which doesn't exist yet."
            className="mt-4 self-start rounded-sm border border-border px-4 py-2 text-xs font-medium text-ink/40"
          >
            {t(locale, "hardware_tap_setup_cta")}
          </button>
        </div>

        <ProductCard product={cardReaders[0] ?? null} locale={locale} onOrder={setOrderingProduct} ctaKey="hardware_order_reader" />
        <ProductCard product={smartTerminals[0] ?? null} locale={locale} onOrder={setOrderingProduct} ctaKey="hardware_order_terminal" />
      </div>

      {devices.length > 0 ? (
        <section>
          <h2 className="font-display text-lg text-charcoal">{t(locale, "hardware_your_devices")}</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {devices.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-sm border border-border bg-white p-4">
                <div>
                  <p className="text-sm font-medium text-charcoal">{d.label}</p>
                  <p className="text-xs text-ink/60">{d.locationName ?? "—"}</p>
                </div>
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium ${
                    d.status === "connected" ? "text-emerald-600" : "text-ink/50"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${d.status === "connected" ? "bg-emerald-500" : "bg-ink/30"}`} />
                  {d.status === "connected" ? t(locale, "hardware_connected") : t(locale, "hardware_offline")}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {orderingProduct ? (
        <HardwareOrderModal
          product={{ id: orderingProduct.id, name: orderingProduct.name, sellingPriceCents: orderingProduct.sellingPriceCents! }}
          locations={locations}
          locale={locale}
          onClose={() => setOrderingProduct(null)}
        />
      ) : null}
    </div>
  );
}

function ProductCard({
  product,
  locale,
  onOrder,
  ctaKey,
}: {
  product: Product | null;
  locale: Locale;
  onOrder: (p: Product) => void;
  ctaKey: "hardware_order_reader" | "hardware_order_terminal";
}) {
  if (!product) {
    return (
      <div className="flex flex-col rounded-sm border border-dashed border-border bg-cream-deep p-6">
        <p className="text-sm text-ink/60">{t(locale, "hardware_not_available_yet")}</p>
      </div>
    );
  }

  const orderable = product.sellingPriceCents !== null;

  return (
    <div className="flex flex-col rounded-sm border border-border bg-white p-6">
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.imageUrl} alt={product.name} className="h-32 w-full rounded-sm object-contain" />
      ) : null}
      <h2 className="mt-3 font-display text-lg text-charcoal">{product.name}</h2>
      {product.description ? <p className="mt-1 flex-1 text-sm text-ink/70">{product.description}</p> : null}
      {orderable ? (
        <>
          <p className="mt-3 font-display text-xl text-charcoal">{formatCents(product.sellingPriceCents!)}</p>
          <p className="text-xs text-ink/60">{t(locale, "hardware_one_time_purchase")}</p>
          <p className="text-xs text-ink/50">{t(locale, "hardware_subscription_separate")}</p>
          <button
            type="button"
            onClick={() => onOrder(product)}
            className="mt-4 self-start rounded-sm bg-charcoal px-5 py-2 text-xs font-medium text-white transition hover:bg-charcoal-soft"
          >
            {t(locale, ctaKey)}
          </button>
        </>
      ) : (
        <p className="mt-3 text-xs text-ink/50">{t(locale, "hardware_not_available_yet")}</p>
      )}
    </div>
  );
}
