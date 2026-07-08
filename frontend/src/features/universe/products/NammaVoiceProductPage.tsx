import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import NammaVoiceHeroSection from './namma-voice/components/NammaVoiceHeroSection';
import NammaVoiceProblemSection from './namma-voice/components/NammaVoiceProblemSection';
import NammaVoiceFeaturesSection from './namma-voice/components/NammaVoiceFeaturesSection';
import NammaVoiceFinalCTA from './namma-voice/components/NammaVoiceFinalCTA';
import NammaVoiceFooter from './namma-voice/components/NammaVoiceFooter';
import ParticleField from '../components/ParticleField';

export default function NammaVoiceProductPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const progressRef = useRef(1); // Set to 1 to show the fully formed Constellation/Solar System
  const activeProductIndexRef = useRef<number | null>(5); // Namma Voice is index 5

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Override global colors for Namma Voice (Teal)
    document.documentElement.style.setProperty('--color-accent', '#00D4B2');
    document.documentElement.style.setProperty('--color-accent-subtle', 'rgba(0, 212, 178, 0.15)');
    document.documentElement.style.setProperty('--color-bg-primary', 'rgba(10, 15, 14, 0.85)');
    document.documentElement.style.setProperty('--color-bg-secondary', 'rgba(10, 15, 14, 0.85)');
    document.documentElement.style.setProperty('--color-bg-tertiary', 'rgba(12, 18, 16, 0.85)');

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
          backgroundColor: '#00D4B2',
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
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] glass" style={{ backgroundColor: 'rgba(10, 15, 14, 0.5)', backdropFilter: 'blur(12px)' }}>
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
                  NV
                </span>
                <span className="font-semibold text-[var(--color-text-primary)]">Namma Voice</span>
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
                  boxShadow: '0 4px 12px rgba(0, 212, 178, 0.2)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Get App
              </button>
            </div>
          </div>
        </nav>

        {/* Namma Voice Product Content */}
        <main>
          <NammaVoiceHeroSection onOpenDemo={() => setIsDemoModalOpen(true)} />
          <NammaVoiceProblemSection />
          <NammaVoiceFeaturesSection />
          <NammaVoiceFinalCTA onOpenDemo={() => setIsDemoModalOpen(true)} />
        </main>

        <NammaVoiceFooter />
        
        {/* Placeholder for Demo Modal if it were implemented */}
        {isDemoModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setIsDemoModalOpen(false)}>
            <div className="p-8 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-2xl max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Coming Soon</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">The Namma Voice mobile app is currently in beta. Sign up to get early access.</p>
              <button onClick={() => setIsDemoModalOpen(false)} className="w-full py-3 rounded-xl font-bold bg-[var(--color-accent)] text-[#120B0F]">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
