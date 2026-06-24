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
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(5, 6, 10, 0.6)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        {/* Wordmark */}
        <Link
          to="/"
          style={{
            fontFamily: "'Clash Display', 'Inter', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#FFFFFF',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
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
          <Link
            to="/login"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#FFFFFF',
              textDecoration: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid rgba(109, 94, 247, 0.4)',
              background: 'rgba(109, 94, 247, 0.1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(109, 94, 247, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(109, 94, 247, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(109, 94, 247, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(109, 94, 247, 0.4)';
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
