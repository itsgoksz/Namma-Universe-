/**
 * EchoProductPage — Echo (Farm AI Agent) Product Landing Page
 * 
 * Implements the Namma Universe back-navigation and Echo-specific branding header.
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EchoHeroSection from './echo/components/EchoHeroSection';
import EchoProblemSection from './echo/components/EchoProblemSection';
import EchoCapabilities from './echo/components/EchoCapabilities';
import EchoInterfaces from './echo/components/EchoInterfaces';
import EchoArchitecture from './echo/components/EchoArchitecture';
import EchoSecuritySection from './echo/components/EchoSecuritySection';
import EchoFinalCTASection from './echo/components/EchoFinalCTASection';
import EchoDemoModal from './echo/components/EchoDemoModal';
import Footer from '../../landing/components/Footer';
import ParticleField from '../components/ParticleField';

export default function EchoProductPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const progressRef = useRef(1); // Set to 1 to show the fully formed Constellation/Solar System

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Override global colors for Echo (Cyan)
    document.documentElement.style.setProperty('--color-accent', '#2DD4FF');
    document.documentElement.style.setProperty('--color-accent-subtle', 'rgba(45, 212, 255, 0.15)');
    document.documentElement.style.setProperty('--color-bg-primary', 'rgba(5, 10, 14, 0.85)');
    document.documentElement.style.setProperty('--color-bg-secondary', 'rgba(6, 11, 16, 0.85)');
    document.documentElement.style.setProperty('--color-bg-tertiary', 'rgba(10, 17, 24, 0.85)');

    return () => {
      // Revert to default/Aiva on unmount
      document.documentElement.style.setProperty('--color-accent', '#A66B8E');
      document.documentElement.style.setProperty('--color-accent-subtle', 'rgba(166, 107, 142, 0.15)');
      document.documentElement.style.setProperty('--color-bg-primary', '#120B0F');
      document.documentElement.style.setProperty('--color-bg-secondary', '#120B0F');
      document.documentElement.style.setProperty('--color-bg-tertiary', '#140C11');
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
        background: 'transparent',
      } as React.CSSProperties}
    >
      {/* Cinematic WebGL Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ParticleField progressRef={progressRef} />
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
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(5, 10, 14, 0.5)',
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
                color: '#120B0F',
              }}
            >
              E
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                color: '#FFFFFF',
              }}
            >
              Echo
            </span>
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
        </nav>

        {/* Echo Product Content */}
        <main>
          <EchoHeroSection onOpenDemo={() => setIsDemoModalOpen(true)} />
          <EchoProblemSection />
          <EchoCapabilities />
          <EchoInterfaces />
          <EchoArchitecture />
          <EchoSecuritySection />
          <EchoFinalCTASection onOpenDemo={() => setIsDemoModalOpen(true)} />
        </main>

        <Footer />
        <EchoDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      </div>
    </div>
  );
}
