"use client";

import { useActionState } from "react";
import { uploadWebsiteImageSlot, removeWebsiteImageSlot } from "@/lib/luxora/website-image-slots-actions";
import type { ActionState } from "@/lib/luxora/actions";
import type { WebsiteTemplate } from "@/lib/luxora/website-image-slots-actions";

const ASPECT_CLASS: Record<string, string> = {
  "16:9": "aspect-[16/9]",
  "4:5": "aspect-[4/5]",
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
  "9:16": "aspect-[9/16]",
};

const ORIENTATION: Record<string, string> = {
  "16:9": "Horizontal",
  "4:5": "Vertical",
  "1:1": "Square",
  "3:4": "Vertical",
  "9:16": "Vertical",
};

type Theme = "light" | "dark" | "soft";

const THEME_STYLES: Record<Theme, { box: string; border: string; icon: string; text: string; sub: string; overlay: string }> = {
  light: {
    box: "bg-cream-deep",
    border: "border border-gold-deep/40",
    icon: "text-gold-deep",
    text: "text-charcoal",
    sub: "text-ink/50",
    overlay: "bg-charcoal/70",
  },
  dark: {
    box: "bg-[#161311]",
    border: "border border-[#c9a24d]/30",
    icon: "text-[#c9a24d]",
    text: "text-[#f4ede2]",
    sub: "text-[#f4ede2]/50",
    overlay: "bg-black/70",
  },
  soft: {
    box: "bg-[#f7efe6]",
    border: "border border-[#cba876]/40",
    icon: "text-[#b8875a]",
    text: "text-[#4a3b2f]",
    sub: "text-[#4a3b2f]/50",
    overlay: "bg-[#4a3b2f]/70",
  },
};

/**
 * Public, no-image fallback: never shows dev labels to real visitors — a
 * tasteful gradient in the template's own palette instead of an ugly gray
 * box or a leaked "HERO IMAGE 16:9" placeholder.
 */
const PUBLIC_FALLBACK: Record<Theme, string> = {
  light: "bg-gradient-to-br from-cream via-cream-deep to-gold-deep/10",
  dark: "bg-gradient-to-br from-[#0c0a09] via-[#1a1613] to-[#2a2117]",
  soft: "bg-gradient-to-br from-[#faf5ee] via-[#f3e8da] to-[#e8d3b8]",
};

function UploadForm({
  template,
  slotKey,
  theme,
  compact,
}: {
  template: WebsiteTemplate;
  slotKey: string;
  theme: Theme;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(uploadWebsiteImageSlot, null);
  const styles = THEME_STYLES[theme];

  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="template" value={template} />
      <input type="hidden" name="slotKey" value={slotKey} />
      <label
        className={`flex cursor-pointer items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition ${
          compact ? "bg-white/90 text-charcoal hover:bg-white" : `${styles.border} ${styles.text} hover:opacity-80`
        }`}
      >
        <input
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          disabled={pending}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        />
        {pending ? "Uploading…" : compact ? "Change" : "Add Image"}
      </label>
      {state?.error ? <p className="mt-1 text-[11px] text-danger">{state.error}</p> : null}
    </form>
  );
}

export function WebsiteImageSlot({
  template,
  slotKey,
  label,
  subject,
  aspect,
  imageUrl,
  devMode,
  theme = "light",
  className = "",
}: {
  template: WebsiteTemplate;
  slotKey: string;
  label: string;
  subject: string;
  aspect: keyof typeof ASPECT_CLASS;
  imageUrl: string | null;
  devMode: boolean;
  theme?: Theme;
  className?: string;
}) {
  const aspectClass = ASPECT_CLASS[aspect] ?? "aspect-[16/9]";
  const styles = THEME_STYLES[theme];

  if (imageUrl) {
    return (
      <div className={`group relative overflow-hidden ${aspectClass} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        {devMode ? (
          <div
            className={`absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100 ${styles.overlay}`}
          >
            <UploadForm template={template} slotKey={slotKey} theme={theme} compact />
            <form action={removeWebsiteImageSlot}>
              <input type="hidden" name="template" value={template} />
              <input type="hidden" name="slotKey" value={slotKey} />
              <button
                type="submit"
                className="rounded-sm bg-white/90 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-white"
              >
                Remove
              </button>
            </form>
          </div>
        ) : null}
      </div>
    );
  }

  if (!devMode) {
    return <div className={`${aspectClass} ${PUBLIC_FALLBACK[theme]} ${className}`} />;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 px-4 text-center ${aspectClass} ${styles.box} ${styles.border} ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className={`h-6 w-6 ${styles.icon}`}>
        <rect x="3" y="4" width="18" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 16l5-4.5 4 3 3-2.5 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className={`text-[10px] font-medium uppercase tracking-[0.2em] ${styles.icon}`}>{label}</p>
      <p className={`text-xs ${styles.text}`}>{subject}</p>
      <p className={`text-[11px] ${styles.sub}`}>
        {ORIENTATION[aspect] ?? ""} {aspect}
      </p>
      <UploadForm template={template} slotKey={slotKey} theme={theme} />
    </div>
  );
}
