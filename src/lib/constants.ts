// Existing, already-published contact channels — ported from the legacy site.
export const WHATSAPP_NUMBER = "17867659267";
export const CONTACT_EMAIL = "elarismediaservices@gmail.com";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
