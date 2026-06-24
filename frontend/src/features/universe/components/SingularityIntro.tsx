/**
 * SingularityIntro — The Opening Sequence
 * 
 * HTML overlay that sits on top of the Three.js canvas.
 * Text materializes as the singularity expands.
 * Uses position:sticky to stay in view while the parent scrolls.
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function SingularityIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Map scroll progress to animation values
  // Logo appears: 55–75% of the intro scroll
  const logoOpacity = useTransform(scrollYProgress, [0.50, 0.65], [0, 1]);
  const logoY = useTransform(scrollYProgress, [0.50, 0.65], [40, 0]);
  const logoScale = useTransform(scrollYProgress, [0.50, 0.65], [0.9, 1]);

  // Tagline appears: 65–80%
  const taglineOpacity = useTransform(scrollYProgress, [0.62, 0.75], [0, 1]);
  const taglineY = useTransform(scrollYProgress, [0.62, 0.75], [30, 0]);

  // Scroll indicator: visible immediately, fades out instantly as they start scrolling (within 50px)
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  // Entire intro fades out as user scrolls past
  const introOpacity = useTransform(scrollYProgress, [0.85, 1.0], [1, 0]);

  return (
    <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>
      <motion.div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: introOpacity,
        }}
      >
        {/* Logo / Brand Name */}
        <motion.h1
          style={{
            opacity: logoOpacity,
            y: logoY,
            scale: logoScale,
            fontFamily: "'Clash Display', 'Inter', sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.1,
            margin: 0,
            padding: '0 1rem',
          }}
        >
          Namma Universe
        </motion.h1>

        {/* Tagline */}
        <motion.p
          style={{
            opacity: taglineOpacity,
            y: taglineY,
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.55)',
            textAlign: 'center',
            marginTop: '1.5rem',
            letterSpacing: '0.02em',
            padding: '0 1rem',
          }}
        >
          A universe of products solving real-world problems.
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '3rem',
            opacity: scrollIndicatorOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Scroll to start the Big Bang
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, rgba(109, 94, 247, 0.6), transparent)',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
