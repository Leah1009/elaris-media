"use client";

import { useActionState } from "react";
import { updateWebsiteSettings } from "@/lib/luxora/website-settings-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function WebsiteSettingsForm({
  settings,
  slug,
}: {
  settings: {
    logo_url: string | null;
    cover_image_url: string | null;
    brand_color: string | null;
    website_tagline: string | null;
  };
  slug: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateWebsiteSettings, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-sm border border-border bg-white p-6">
      <p className="text-xs text-ink/60">
        No file upload yet — paste the URL of an image you&apos;ve already hosted elsewhere.
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="logoUrl" className="text-sm font-medium text-charcoal">
          Logo Image URL
        </label>
        <input
          id="logoUrl"
          name="logoUrl"
          defaultValue={settings.logo_url ?? ""}
          placeholder="https://…"
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
        {state?.fieldErrors?.logoUrl ? <p className="text-sm text-danger">{state.fieldErrors.logoUrl[0]}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="coverImageUrl" className="text-sm font-medium text-charcoal">
          Cover Image URL
        </label>
        <input
          id="coverImageUrl"
          name="coverImageUrl"
          defaultValue={settings.cover_image_url ?? ""}
          placeholder="https://…"
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
        {state?.fieldErrors?.coverImageUrl ? (
          <p className="text-sm text-danger">{state.fieldErrors.coverImageUrl[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="brandColor" className="text-sm font-medium text-charcoal">
          Brand Color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="brandColor"
            name="brandColor"
            defaultValue={settings.brand_color ?? "#3a2f28"}
            placeholder="#3a2f28"
            className="w-32 rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          <input
            type="color"
            defaultValue={settings.brand_color ?? "#3a2f28"}
            onChange={(e) => {
              const input = document.getElementById("brandColor") as HTMLInputElement | null;
              if (input) input.value = e.target.value;
            }}
            className="h-9 w-9 rounded-sm border border-border"
            aria-label="Pick brand color"
          />
        </div>
        {state?.fieldErrors?.brandColor ? (
          <p className="text-sm text-danger">{state.fieldErrors.brandColor[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="websiteTagline" className="text-sm font-medium text-charcoal">
          Tagline
        </label>
        <input
          id="websiteTagline"
          name="websiteTagline"
          defaultValue={settings.website_tagline ?? ""}
          placeholder="Where Miami comes to glow"
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
        {state?.fieldErrors?.websiteTagline ? (
          <p className="text-sm text-danger">{state.fieldErrors.websiteTagline[0]}</p>
        ) : null}
      </div>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>

      <a href={`/b/${slug}`} target="_blank" rel="noreferrer" className="text-xs text-ink/60 underline underline-offset-2">
        View your public page →
      </a>
    </form>
  );
}
