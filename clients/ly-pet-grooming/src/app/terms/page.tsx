import type { Metadata } from "next";
import { contact, site } from "@/content";
import LegalLayout from "../LegalLayout";

export const metadata: Metadata = { title: "Terms" };

/*
 * ⚠️ TEMPLATE — placeholder terms. Add your real policies (cancellations,
 * late arrivals, matted coats, aggressive behavior, vaccinations, liability)
 * and have them reviewed by a licensed attorney before launch.
 */
export default function Terms() {
  return (
    <LegalLayout title="Terms" updated="[Date]">
      <p>
        By using this website or booking a service with {site.name}, you agree to the following terms.
      </p>
      <h2>Appointments</h2>
      <p>[Your booking, cancellation and late-arrival policy.]</p>
      <h2>Pet health & safety</h2>
      <p>[Your policy on vaccinations, health conditions, matted coats and pet behavior.]</p>
      <h2>Pricing</h2>
      <p>[How pricing is determined — size, coat condition, services selected.]</p>
      <h2>Website content</h2>
      <p>
        Content on this site is for general information. Photos show real results but each pet’s outcome may vary.
      </p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </p>
    </LegalLayout>
  );
}
