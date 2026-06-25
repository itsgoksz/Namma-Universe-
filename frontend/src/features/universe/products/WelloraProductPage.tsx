import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import WelloraHeroSection from './wellora/components/WelloraHeroSection';
import WelloraProblemSection from './wellora/components/WelloraProblemSection';
import WelloraSolutionSection from './wellora/components/WelloraSolutionSection';
import WelloraValueProposition from './wellora/components/WelloraValueProposition';
import WelloraArchitecture from './wellora/components/WelloraArchitecture';
import WelloraFinalCTA from './wellora/components/WelloraFinalCTA';
import WelloraDemoModal from './wellora/components/WelloraDemoModal';
import Footer from '../../landing/components/Footer';
import ParticleField from '../components/ParticleField';

export default function WelloraProductPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const progressRef = useRef(1); // Set to 1 to show the fully formed Constellation/Solar System
  const activeProductIndexRef = useRef<number | null>(1); // Wellora is index 1

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Override global colors for Wellora (Green & Teal influences)
    document.documentElement.style.setProperty('--color-accent', '#2ECC71');
    document.documentElement.style.setProperty('--color-accent-subtle', 'rgba(46, 204, 113, 0.15)');
    document.documentElement.style.setProperty('--color-bg-primary', 'rgba(10, 13, 11, 0.85)');
    document.documentElement.style.setProperty('--color-bg-secondary', 'rgba(10, 13, 11, 0.85)');
    document.documentElement.style.setProperty('--color-bg-tertiary', 'rgba(12, 17, 14, 0.85)');

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
    <div className="relative min-h-screen selection:bg-[var(--color-accent)] selection:text-[#120B0F]" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
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
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] glass" style={{ backgroundColor: 'rgba(10, 13, 11, 0.5)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', letterSpacing: '0.05em' }}
              >
                <span>←</span>
                <span>NAMMA UNIVERSE</span>
              </Link>
              <div className="h-4 w-px bg-[var(--color-border)]" />
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-[#120B0F]" style={{ backgroundColor: 'var(--color-accent)' }}>
                  WE
                </span>
                <span className="font-semibold text-[var(--color-text-primary)]">Wellora</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: '#120B0F',
                  background: 'var(--color-accent)',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Book a Demo
              </button>
            </div>
          </div>
        </nav>

        {/* Wellora Product Content */}
        <main>
          <WelloraHeroSection onOpenDemo={() => setIsDemoModalOpen(true)} />
          <WelloraProblemSection />
          <WelloraSolutionSection />
          <WelloraValueProposition />
          <WelloraArchitecture />
          <WelloraFinalCTA onOpenDemo={() => setIsDemoModalOpen(true)} />
        </main>

        <Footer />
        <WelloraDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      </div>
    </div>
  );
}
