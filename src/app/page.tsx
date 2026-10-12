import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import HeroSection from "@/components/sections/HeroSection";
import AdsAnalyticsSection from "@/components/sections/AdsAnalyticsSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import SpecializedSection from "@/components/sections/SpecializedSection";
import PortfolioReviewsSection from "@/components/sections/PortfolioReviewsSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        <HeroSection />

        <AboutSection />
        <ServicesSection />
        <HowItWorksSection />
        <SpecializedSection />
        <AdsAnalyticsSection />
        <PortfolioReviewsSection />
        <FaqSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
