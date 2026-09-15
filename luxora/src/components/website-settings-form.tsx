"use client";

import { useActionState, useState } from "react";
import { updateWebsiteSettings } from "@/lib/luxora/website-settings-actions";
import type { ActionState } from "@/lib/luxora/actions";

type Settings = {
  logo_url: string | null;
  cover_image_url: string | null;
  brand_color: string | null;
  website_tagline: string | null;
  instagram_url: string | null;
  show_team: boolean;
  show_reviews: boolean;
  public_language_mode: string;
};

export function WebsiteSettingsForm({
  settings,
  slug,
}: {
  settings: Settings;
  slug: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateWebsiteSettings, null);

  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(settings.cover_image_url ?? "");
  const [brandColor, setBrandColor] = useState(settings.brand_color ?? "#3a2f28");
  const [tagline, setTagline] = useState(settings.website_tagline ?? "");
  const [showTeam, setShowTeam] = useState(settings.show_team);
  const [showReviews, setShowReviews] = useState(settings.show_reviews);
  const [languageMode, setLanguageMode] = useState<"en" | "es" | "both">(
    settings.public_language_mode === "es" || settings.public_language_mode === "both"
      ? (settings.public_language_mode as "es" | "both")
      : "en",
  );

  return (
    <div className="max-w-xl">
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
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
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
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
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
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              placeholder="#3a2f28"
              className="w-32 rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
            />
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(brandColor) ? brandColor : "#3a2f28"}
              onChange={(e) => setBrandColor(e.target.value)}
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
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Where Miami comes to glow"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.websiteTagline ? (
            <p className="text-sm text-danger">{state.fieldErrors.websiteTagline[0]}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="instagramUrl" className="text-sm font-medium text-charcoal">
            Instagram URL
          </label>
          <input
            id="instagramUrl"
            name="instagramUrl"
            defaultValue={settings.instagram_url ?? ""}
            placeholder="https://instagram.com/yourbusiness"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.instagramUrl ? (
            <p className="text-sm text-danger">{state.fieldErrors.instagramUrl[0]}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-charcoal">Public Site & Booking Language</label>
          <input type="hidden" name="publicLanguageMode" value={languageMode} />
          <div className="flex w-fit overflow-hidden rounded-sm border border-border">
            {(["en", "es", "both"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setLanguageMode(mode)}
                className={`px-4 py-2 text-sm font-medium transition ${
                  languageMode === mode ? "bg-charcoal text-white" : "bg-white text-charcoal hover:bg-cream-deep"
                }`}
              >
                {mode === "en" ? "English" : mode === "es" ? "Español" : "English + Español"}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink/60">
            The language your public booking page uses. Choose both to let clients switch between English and
            Spanish.
          </p>
        </div>

        <fieldset className="flex flex-col gap-2 rounded-sm border border-border p-3.5">
          <legend className="px-1 text-sm font-medium text-charcoal">Page Sections</legend>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="showTeam"
              checked={showTeam}
              onChange={(e) => setShowTeam(e.target.checked)}
              className="h-4 w-4 accent-gold-deep"
            />
            Show &ldquo;Our Team&rdquo; section
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="showReviews"
              checked={showReviews}
              onChange={(e) => setShowReviews(e.target.checked)}
              className="h-4 w-4 accent-gold-deep"
            />
            Show reviews section
          </label>
        </fieldset>

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
    </div>
  );
}
