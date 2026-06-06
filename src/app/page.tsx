import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import LandingNavbar from "@/components/landing/LandingNavbar";
import PricingSection from "@/components/landing/PricingSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-sky-50 via-white to-white">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </main>
  )
}