import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import HomieHeroSection from './homie/components/HomieHeroSection';
import HomieProblemSection from './homie/components/HomieProblemSection';
import HomieSolutionSection from './homie/components/HomieSolutionSection';
import HomieValueProposition from './homie/components/HomieValueProposition';
import HomieFinalCTA from './homie/components/HomieFinalCTA';
import HomieDemoModal from './homie/components/HomieDemoModal';
import Footer from '../../landing/components/Footer';
import ParticleField from '../components/ParticleField';

export default function HomieProductPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const progressRef = useRef(1); // Set to 1 to show the fully formed Constellation/Solar System
  const activeProductIndexRef = useRef<number | null>(4); // Homie is index 4

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Override global colors for Homie (Amber/Orange influences)
    document.documentElement.style.setProperty('--color-accent', '#F5A623');
    document.documentElement.style.setProperty('--color-accent-subtle', 'rgba(245, 166, 35, 0.15)');
    document.documentElement.style.setProperty('--color-bg-primary', 'rgba(15, 12, 10, 0.85)');
    document.documentElement.style.setProperty('--color-bg-secondary', 'rgba(15, 12, 10, 0.85)');
    document.documentElement.style.setProperty('--color-bg-tertiary', 'rgba(18, 14, 12, 0.85)');

    return () => {
      // Revert to default/Aiva on unmount
      document.documentElement.style.setProperty('--color-accent', '#A66B8E');
      document.documentElement.style.setProperty('--color-accent-subtle', 'rgba(166, 107, 142, 0.15)');
      document.documentElement.style.setProperty('--color-bg-primary', '#120B0F');
      document.documentElement.style.setProperty('--color-bg-secondary', '#120B0F');
      document.documentElement.style.setProperty('--color-bg-tertiary', '#140C11');
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="relative min-h-screen selection:bg-[var(--color-accent)] selection:text-white" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* Seamless Transition Overlay */}
      <motion.div
        initial={{ clipPath: 'circle(150% at 50% 50%)' }}
        animate={{ clipPath: 'circle(0% at 50% 50%)' }}
        transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9999,
          backgroundColor: '#F5A623',
          pointerEvents: 'none'
        }}
      />

      {/* Background WebGL / Particle Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <ParticleField progressRef={progressRef} activeProductIndexRef={activeProductIndexRef} />
      </div>

      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--color-bg-secondary)_0%,_transparent_50%)] opacity-40" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-bg-secondary)_0%,_transparent_50%)] opacity-40" />
      </motion.div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Transparent Navbar specific to Universe Products */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] glass" style={{ backgroundColor: 'rgba(15, 12, 10, 0.5)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/#products"
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', letterSpacing: '0.05em' }}
              >
                <span>←</span>
                <span className="hidden sm:inline">PRODUCTS</span>
              </Link>
              <div className="h-4 w-px bg-[var(--color-border)]" />
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-[#120B0F]" style={{ backgroundColor: 'var(--color-accent)' }}>
                  H
                </span>
                <span className="font-semibold text-[var(--color-text-primary)]">Homie</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#120B0F',
                  background: 'var(--color-accent)',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 12px rgba(245, 166, 35, 0.2)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Start Moving
              </button>
            </div>
          </div>
        </nav>

        {/* Homie Product Content */}
        <main>
          <HomieHeroSection onOpenDemo={() => setIsDemoModalOpen(true)} />
          <HomieProblemSection />
          <HomieSolutionSection />
          <HomieValueProposition />
          <HomieFinalCTA onOpenDemo={() => setIsDemoModalOpen(true)} />
        </main>

        <Footer />
        <HomieDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      </div>
    </div>
  );
}
