import type { Metadata } from "next";
import { contact, site } from "@/content";
import LegalLayout from "../LegalLayout";

export const metadata: Metadata = { title: "Privacy Policy" };

/*
 * ⚠️ TEMPLATE — basic starting text for a static site with no forms,
 * accounts or tracking. Have it reviewed by a licensed attorney before
 * launch, and update it if you add analytics, pixels or booking tools.
 */
export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="[Date]">
      <p>
        This website is operated by {site.name}. We respect your privacy and keep this site simple: it has no
        accounts, no contact forms and does not store personal information.
      </p>
      <h2>Information you share with us</h2>
      <p>
        When you call, email or message us on WhatsApp or social media, we receive the information you choose to
        share (such as your name, phone number and details about your pet). We use it only to respond to you and to
        schedule and provide grooming services.
      </p>
      <h2>Third-party services</h2>
      <p>
        Links to WhatsApp, Instagram, Facebook or booking platforms are operated by those companies and are governed by
        their own privacy policies.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </LegalLayout>
  );
}
