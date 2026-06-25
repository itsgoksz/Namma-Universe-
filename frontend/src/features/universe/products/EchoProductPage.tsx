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
import Footer from '../../landing/components/Footer';
import ParticleField from '../components/ParticleField';

export default function EchoProductPage() {
  const progressRef = useRef(1); // Set to 1 to show the fully formed Constellation/Solar System

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
        background: 'transparent',
        // Make Echo's core background slightly translucent so the Universe shines through
        '--color-bg-primary': 'rgba(10, 16, 24, 0.85)',
        '--color-bg-secondary': 'rgba(10, 16, 24, 1)',
        '--color-bg-tertiary': 'rgba(15, 22, 32, 1)',
        '--color-accent': '#2DD4FF',
        '--color-accent-light': 'rgba(45, 212, 255, 0.15)',
        '--color-accent-subtle': 'rgba(45, 212, 255, 0.05)',
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
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(10, 16, 24, 0.8)',
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
            <Link
              to="/login"
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
          </div>
        </nav>

        {/* Echo Product Content */}
        <main>
          <EchoHeroSection />
          <EchoProblemSection />
          <EchoCapabilities />
          <EchoInterfaces />
          <EchoArchitecture />
          <EchoSecuritySection />
          <EchoFinalCTASection />
        </main>

        <Footer />
      </div>
    </div>
  );
}
