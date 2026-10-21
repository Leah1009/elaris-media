import { contact } from "@/content";

export const telHref = `tel:+${contact.phoneDigits}`;
export const whatsappHref = `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(contact.whatsappMessage)}`;
export const emailHref = `mailto:${contact.email}`;
export const bookingHref = contact.bookingUrl || whatsappHref;
