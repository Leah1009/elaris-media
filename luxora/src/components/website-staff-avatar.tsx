const THEME_CLASSES: Record<"light" | "dark" | "soft", string> = {
  light: "bg-cream-deep text-gold-deep border border-gold-deep/30",
  dark: "bg-[#1f1a16] text-[#c9a24d] border border-[#c9a24d]/30",
  soft: "bg-[#f3e6d6] text-[#b8875a] border border-[#cba876]/40",
};

function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function WebsiteStaffAvatar({
  fullName,
  photoUrl,
  theme = "light",
  className = "",
}: {
  fullName: string;
  photoUrl: string | null;
  theme?: "light" | "dark" | "soft";
  className?: string;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoUrl} alt={fullName} className={`object-cover ${className}`} />
    );
  }
  return (
    <div className={`flex items-center justify-center font-display text-lg ${THEME_CLASSES[theme]} ${className}`}>
      {initials(fullName) || "•"}
    </div>
  );
}
