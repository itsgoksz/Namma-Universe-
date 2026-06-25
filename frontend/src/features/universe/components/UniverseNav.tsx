/**
 * UniverseNav — Transparent Navigation Bar
 * 
 * Fades in after the intro sequence.
 * Minimal, floating, premium.
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function UniverseNav() {
  const { scrollYProgress } = useScroll();

  // Navbar fades in after ~30% of total page scroll (past the intro)
  const opacity = useTransform(scrollYProgress, [0.08, 0.12], [0, 1]);

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        opacity,
        pointerEvents: 'auto',
      }}
    >
      {/* Deep space top gradient for a seamless blend instead of a hard blocky navbar */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(5, 6, 10, 0.95) 0%, rgba(5, 6, 10, 0.0) 100%)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.5rem 2rem', // Slightly more padding for a floating airy feel
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(8px)', // Softer, more ethereal blur
          WebkitBackdropFilter: 'blur(8px)',
          background: 'transparent', // Let the gradient handle the shading
          // Removed the rigid bottom border for a seamless fade into space
        }}
      >
        {/* Wordmark */}
        <Link
          to="/"
          onClick={() => {
            // Smoothly scroll back to the cinematic top view
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#FFFFFF',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <img 
            src="/logo.png" 
            alt="Namma Universe" 
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '6px',
              objectFit: 'cover'
            }} 
          />
          Namma Universe
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a
            href="#products"
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
            Products
          </a>
          <a
            href="#philosophy"
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
            Philosophy
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
