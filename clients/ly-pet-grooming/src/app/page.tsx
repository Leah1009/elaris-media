import About from "@/components/About";
import Contact from "@/components/Contact";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RevealObserver from "@/components/RevealObserver";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import Why from "@/components/Why";
import Work from "@/components/Work";
import Experience from "@/components/three/Experience";
import { contact, services, site } from "@/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}${site.logo}`,
  telephone: `+${contact.phoneDigits}`,
  email: contact.email,
  areaServed: contact.serviceArea,
  sameAs: [contact.instagram, contact.facebook],
  makesOffer: services.items.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, description: s.text },
  })),
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <About />
        <Why />
        <Work />
        <Reviews />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <Experience />
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
