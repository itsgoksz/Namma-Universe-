import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import IndustriesSection from './components/IndustriesSection';
import DayWithAivaSection from './components/DayWithAivaSection';
import FeatureShowcase from './components/FeatureShowcase';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import FinalCTASection from './components/FinalCTASection';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';

export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const openDemoModal = () => setIsDemoModalOpen(true);
  const closeDemoModal = () => setIsDemoModalOpen(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Navbar onOpenDemo={openDemoModal} />
      
      <main>
        <HeroSection onOpenDemo={openDemoModal} />
        <ProblemSection />
        <SolutionSection />
        <IndustriesSection />
        <DayWithAivaSection />
        <FeatureShowcase />
        <PricingSection />
        <TestimonialsSection />
        <FinalCTASection onOpenDemo={openDemoModal} />
      </main>

      <Footer />
      
      <DemoModal isOpen={isDemoModalOpen} onClose={closeDemoModal} />
    </div>
  );
}
