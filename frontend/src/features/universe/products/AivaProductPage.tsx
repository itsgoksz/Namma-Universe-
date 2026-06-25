/**
 * AivaProductPage — Enhanced Aiva Product Landing Page
 * 
 * Wraps the existing Aiva landing sections with a Namma Universe
 * back-navigation and Aiva-specific branding header.
 * All original sections are preserved and enhanced.
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HeroSection from '../../landing/components/HeroSection';
import ProblemSection from '../../landing/components/ProblemSection';
import SolutionSection from '../../landing/components/SolutionSection';
import IndustriesSection from '../../landing/components/IndustriesSection';
import DayWithAivaSection from '../../landing/components/DayWithAivaSection';
import FeatureShowcase from '../../landing/components/FeatureShowcase';
import TestimonialsSection from '../../landing/components/TestimonialsSection';
import FinalCTASection from '../../landing/components/FinalCTASection';
import Footer from '../../landing/components/Footer';
import DemoModal from '../../landing/components/DemoModal';
import ParticleField from '../components/ParticleField';

export default function AivaProductPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const progressRef = useRef(1); // Set to 1 to show the fully formed Constellation/Solar System
  const activeProductIndexRef = useRef<number | null>(0); // Aiva is index 0

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    // Check if the URL has #demo hash to auto-open the modal
    if (window.location.hash === '#demo') {
      setIsDemoModalOpen(true);
      // Clean up the hash so it doesn't reopen if they refresh
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
        background: 'transparent',
        // Make Aiva's core background slightly translucent so the Universe shines through,
        // but preserve ALL of Aiva's original solid identity and color palette.
        '--color-bg-primary': 'rgba(18, 11, 15, 0.85)',
      } as React.CSSProperties}
    >
      {/* Cinematic WebGL Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ParticleField progressRef={progressRef} activeProductIndexRef={activeProductIndexRef} />
      </div>

      {/* Foreground Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Product navigation */}
        <nav
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: '1rem max(1rem, 4vw)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(18, 11, 15, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 400,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)')}
          >
            <ArrowLeft size={16} />
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              Namma Universe
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem',
                color: '#fff',
              }}
            >
              A
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                color: '#FFFFFF',
              }}
            >
              Aiva
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/login"
              className="hidden sm:inline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)')}
            >
              Sign in
            </Link>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#fff',
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
        </nav>

        {/* Aiva Product Content — all existing sections */}
        <main>
          <HeroSection onOpenDemo={() => setIsDemoModalOpen(true)} />
          <ProblemSection />
          <SolutionSection />
          <IndustriesSection />
          <DayWithAivaSection />
          <FeatureShowcase />
          <TestimonialsSection />
          <FinalCTASection onOpenDemo={() => setIsDemoModalOpen(true)} />
        </main>

        <Footer />

        <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      </div>
    </div>
  );
}
