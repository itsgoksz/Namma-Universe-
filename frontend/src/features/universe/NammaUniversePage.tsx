/**
 * NammaUniversePage — The Main Orchestrator
 * 
 * Manages the fixed Three.js canvas, scroll tracking,
 * and assembles all sections into the cinematic experience.
 * 
 * Architecture:
 *   - Fixed canvas layer (z-index 0) renders the particle field
 *   - HTML content scrolls on top (z-index 10+)
 *   - Scroll position drives the particle animation via a ref
 *   - Canvas fades to black after the intro/map sections
 */

import { useEffect, useRef, useState } from 'react';
import ParticleField from './components/ParticleField';
import SingularityIntro from './components/SingularityIntro';
import UniverseNav from './components/UniverseNav';
import UniverseMap from './components/UniverseMap';
import PhilosophySection from './components/PhilosophySection';
import ProductWorlds from './components/ProductWorlds';
import UniverseFooter from './components/UniverseFooter';

export default function NammaUniversePage() {
  const progressRef = useRef(0);
  const activeProductIndexRef = useRef<number | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        canvas.getContext('webgl') || canvas.getContext('webgl2')
      );
      setWebglSupported(supported);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Track scroll position for the particle canvas
  // We map scroll to the intro section's range (first ~400vh)
  useEffect(() => {
    const handleScroll = () => {
      // The intro section is 400vh tall. Map scroll within that to 0→1.
      const introHeight = window.innerHeight * 4;
      const raw = window.scrollY / introHeight;
      progressRef.current = Math.min(raw, 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#05060A', minHeight: '100dvh', overflowX: 'hidden', width: '100%' }}>
      {/* Fixed Three.js Canvas */}
      {webglSupported ? (
        <ParticleField progressRef={progressRef} activeProductIndexRef={activeProductIndexRef} />
      ) : (
        /* CSS fallback for non-WebGL devices */
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            background: 'radial-gradient(ellipse at center, rgba(109, 94, 247, 0.08) 0%, #05060A 70%)',
          }}
        />
      )}

      {/* Navigation */}
      <UniverseNav />

      {/* Scrollable HTML Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Section 1: The Birth — Singularity Intro (400vh scroll space) */}
        <SingularityIntro />

        {/* Section 2: Philosophy — Cinematic Storytelling (pinned by GSAP) */}
        <PhilosophySection />

        {/* Section 3: Product Worlds */}
        <ProductWorlds activeProductIndexRef={activeProductIndexRef} />

        {/* Section 4: The Universe Map — Interactive Constellation */}
        <UniverseMap />

        {/* Footer */}
        <UniverseFooter />
      </div>
    </div>
  );
}
