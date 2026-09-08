import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MorphStage from "@/components/chapters/MorphStage";
import { CAMERA_TO_PHONE } from "@/lib/chapters/cameraToPhone";
import { PHONE_TO_LAPTOP } from "@/lib/chapters/phoneToLaptop";
import AdsAnalyticsSection from "@/components/sections/AdsAnalyticsSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import DentalBillingSection from "@/components/sections/DentalBillingSection";
import AdminServicesSection from "@/components/sections/AdminServicesSection";
import PortfolioReviewsSection from "@/components/sections/PortfolioReviewsSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        <div id="home">
          <MorphStage
            parts={CAMERA_TO_PHONE}
            reducedProgress={0.5}
            copy={{
              fromEyebrow: "chapter1.from.eyebrow",
              fromHeadline: "chapter1.from.headline",
              fromBody: "chapter1.from.body",
              toEyebrow: "chapter1.to.eyebrow",
              toHeadline: "chapter1.to.headline",
              toBody: "chapter1.to.body",
              scrollHint: "chapter1.scrollHint",
            }}
          />
        </div>

        <MorphStage
          parts={PHONE_TO_LAPTOP}
          reducedProgress={1}
          copy={{
            fromEyebrow: "chapter2.from.eyebrow",
            fromHeadline: "chapter2.from.headline",
            fromBody: "chapter2.from.body",
            toEyebrow: "chapter2.to.eyebrow",
            toHeadline: "chapter2.to.headline",
            toBody: "chapter2.to.body",
            scrollHint: "chapter2.scrollHint",
          }}
        />

        <AdsAnalyticsSection />
        <AboutSection />
        <ServicesSection />
        <HowItWorksSection />
        <DentalBillingSection />
        <AdminServicesSection />
        <PortfolioReviewsSection />
        <FaqSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
