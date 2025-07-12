// File: src/pages/Home/index.jsx
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import Navbar from "./Navbar";
import HowItWorks from "./Howitworks";
import FAQ from './FAQ'
import PricingSection from "./Pricing";
import Contact from "./Contact";
import Policies from "./Policies";

export default function Home() {

  return (
    <div className="bg-neutral-100 overflow-hidden dark:bg-slate-950 text-slate-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <Policies />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}