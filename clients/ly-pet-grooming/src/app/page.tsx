import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileBar from "@/components/MobileBar";
import { About, BookingCta, Contact, Gallery, Hero, Results, Reviews, Services, Why } from "@/components/Sections";
import { contact, services, site } from "@/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/images/hero.jpg`,
  telephone: `+${contact.phoneDigits}`,
  email: contact.email,
  areaServed: contact.serviceArea,
  sameAs: [contact.instagram, contact.facebook],
  makesOffer: services.items.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.name, description: s.text },
  })),
};

// Order follows the booking journey: see → results → services → trust → reviews → book.
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Results />
        <Services />
        <Why />
        <About />
        <Gallery />
        <Reviews />
        <BookingCta />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
