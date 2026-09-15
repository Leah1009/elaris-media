"use client";

import { useState, type ReactNode } from "react";
import { setWebsiteTemplate } from "@/lib/luxora/website-image-slots-actions";
import { WEBSITE_TEMPLATES } from "@/components/website-templates/registry";
import { WebsiteImageSlot } from "@/components/website-image-slot";
import type { WebsiteTemplate } from "@/lib/luxora/website-image-slots-actions";

const DEVICES = {
  desktop: { width: 1280, height: 800, label: "Desktop" },
  tablet: { width: 768, height: 1024, label: "Tablet" },
  mobile: { width: 390, height: 844, label: "Mobile" },
} as const;

const THUMBNAIL: Record<WebsiteTemplate, ReactNode> = {
  minimal_luxury: (
    <div className="flex h-full w-full flex-col gap-1.5 bg-[#faf6ee] p-2.5">
      <div className="h-1.5 w-8 rounded-full bg-[#c9a24d]/50" />
      <div className="mt-1 h-10 w-full rounded-sm bg-[#e9dfc8]" />
      <div className="mt-1 flex gap-1">
        <div className="h-6 w-6 rounded-full border border-[#c9a24d]/50" />
        <div className="h-6 w-6 rounded-full border border-[#c9a24d]/50" />
        <div className="h-6 w-6 rounded-full border border-[#c9a24d]/50" />
      </div>
    </div>
  ),
  modern_dark: (
    <div className="flex h-full w-full gap-1.5 bg-[#0c0a09] p-2.5">
      <div className="flex flex-1 flex-col justify-center gap-1">
        <div className="h-1.5 w-6 rounded-full bg-[#c9a24d]/60" />
        <div className="h-2 w-full rounded-sm bg-[#f4ede2]/30" />
        <div className="h-2 w-3/4 rounded-sm bg-[#f4ede2]/20" />
      </div>
      <div className="h-full w-1/2 rounded-sm bg-[#2a2117]" />
    </div>
  ),
  soft_beauty: (
    <div className="flex h-full w-full items-center gap-1 bg-[#faf6f0] p-2.5">
      <div className="h-full w-1/3 rounded-lg bg-[#e8d3b8]" />
      <div className="flex h-full w-1/3 flex-col gap-1">
        <div className="h-1/2 rounded-lg bg-[#f3e6d6]" />
        <div className="h-1/2 rounded-lg bg-[#e8d3b8]" />
      </div>
      <div className="h-full w-1/3 rounded-lg bg-[#f3e6d6]" />
    </div>
  ),
};

export function WebsiteBuilder({
  slug,
  currentTemplate,
  imagesByTemplate,
}: {
  slug: string;
  currentTemplate: WebsiteTemplate;
  imagesByTemplate: Record<WebsiteTemplate, Record<string, string>>;
}) {
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate>(currentTemplate);
  const [device, setDevice] = useState<keyof typeof DEVICES>("desktop");

  const templateTheme: Record<WebsiteTemplate, "light" | "dark" | "soft"> = {
    minimal_luxury: "light",
    modern_dark: "dark",
    soft_beauty: "soft",
  };

  const dims = DEVICES[device];
  const scale = device === "desktop" ? 0.62 : device === "tablet" ? 0.62 : 0.9;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-display text-lg text-charcoal">Choose a Template</h2>
        <p className="mt-1 text-sm text-ink/60">
          All three render your real business data — only the structure and layout differ.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {WEBSITE_TEMPLATES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setPreviewTemplate(t.key)}
              className={`flex flex-col overflow-hidden rounded-sm border-2 text-left transition ${
                previewTemplate === t.key ? "border-gold-deep" : "border-border hover:border-gold-deep/50"
              }`}
            >
              <div className="h-24 w-full">{THUMBNAIL[t.key]}</div>
              <div className="flex flex-col gap-1 bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">{t.name}</span>
                  {currentTemplate === t.key ? (
                    <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gold-deep">
                      Live
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-ink/60">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
        {previewTemplate !== currentTemplate ? (
          <form action={setWebsiteTemplate} className="mt-4">
            <input type="hidden" name="template" value={previewTemplate} />
            <button
              type="submit"
              className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
            >
              Use {WEBSITE_TEMPLATES.find((t) => t.key === previewTemplate)?.name}
            </button>
          </form>
        ) : null}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-charcoal">Preview — {WEBSITE_TEMPLATES.find((t) => t.key === previewTemplate)?.name}</h2>
          <div className="flex overflow-hidden rounded-sm border border-border">
            {(Object.keys(DEVICES) as (keyof typeof DEVICES)[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  device === d ? "bg-charcoal text-white" : "bg-white text-charcoal hover:bg-cream-deep"
                }`}
              >
                {DEVICES[d].label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center overflow-hidden rounded-sm border border-border bg-cream-deep p-4">
          <div style={{ width: dims.width * scale, height: dims.height * scale, overflow: "hidden" }} className="rounded-sm border border-border bg-white shadow-sm">
            <iframe
              src={`/dashboard/settings/website/preview?template=${previewTemplate}`}
              style={{
                width: dims.width,
                height: dims.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                border: "none",
              }}
              title="Website preview"
            />
          </div>
        </div>
        <a href={`/b/${slug}`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-ink/60 underline underline-offset-2">
          View your live public page →
        </a>
      </section>

      <section>
        <h2 className="font-display text-lg text-charcoal">Images — {WEBSITE_TEMPLATES.find((t) => t.key === previewTemplate)?.name}</h2>
        <p className="mt-1 text-sm text-ink/60">
          Upload real photography here whenever you&apos;re ready. Until then, the preview shows a labeled placeholder
          so you know exactly what belongs in each spot — visitors never see these labels.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {WEBSITE_TEMPLATES.find((t) => t.key === previewTemplate)?.slots.map((slot) => (
            <div key={slot.key} className="flex flex-col gap-1.5">
              <WebsiteImageSlot
                template={previewTemplate}
                slotKey={slot.key}
                label={slot.label}
                subject={slot.subject}
                aspect={slot.aspect}
                imageUrl={imagesByTemplate[previewTemplate]?.[slot.key] ?? null}
                devMode
                theme={templateTheme[previewTemplate]}
                className="rounded-sm"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
