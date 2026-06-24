/**
 * UniverseMap — Interactive Product Constellation
 * 
 * Displays five product nodes as interactive glassmorphic cards,
 * positioned to match the Three.js constellation behind them.
 * Each node has its own color identity and click navigates to
 * its product page.
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  color: string;
  glowColor: string;
  route: string;
}

const products: Product[] = [
  {
    id: 'aiva',
    name: 'Aiva',
    emoji: '🧠',
    tagline: 'Your adaptive intelligence layer for thinking, building, and deciding faster.',
    color: '#A66B8E',
    glowColor: 'rgba(166, 107, 142, 0.3)',
    route: '/products/aiva',
  },
  {
    id: 'wellora',
    name: 'Wellora',
    emoji: '🌿',
    tagline: 'A quiet system that helps you understand and optimize your physical and mental wellbeing.',
    color: '#2ECC71',
    glowColor: 'rgba(46, 204, 113, 0.25)',
    route: '#',
  },
  {
    id: 'echo',
    name: 'Echo',
    emoji: '🎙',
    tagline: 'A voice-first memory layer that captures, understands, and responds to your world.',
    color: '#2DD4FF',
    glowColor: 'rgba(45, 212, 255, 0.25)',
    route: '#',
  },
  {
    id: 'homie',
    name: 'Homie',
    emoji: '🏠',
    tagline: 'An intelligent home companion that learns how you live and quietly simplifies it.',
    color: '#F5A623',
    glowColor: 'rgba(245, 166, 35, 0.25)',
    route: '#',
  },
  {
    id: 'ev-copilot',
    name: 'EV Copilot',
    emoji: '⚡',
    tagline: 'A real-time intelligence layer for EV routing, charging, and energy decisions.',
    color: '#6D5EF7',
    glowColor: 'rgba(109, 94, 247, 0.3)',
    route: '#',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function UniverseMap() {
  const navigate = useNavigate();

  return (
    <section
      id="products"
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '130vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10rem 1.5rem',
      }}
    >
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <h2
          style={{
            fontFamily: "'Clash Display', 'Inter', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: '#FFFFFF',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}
        >
          The Universe
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.125rem',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.45)',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          Five products. Five worlds. One mission.
        </p>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2.5rem',
          maxWidth: '1400px',
          width: '100%',
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.03,
              y: -4,
              transition: { duration: 0.3 },
            }}
            onClick={() => {
              if (product.route !== '#') navigate(product.route);
            }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '340px',
              padding: '2.5rem',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.01)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              cursor: product.route !== '#' ? 'pointer' : 'default',
              overflow: 'hidden',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.4s, box-shadow 0.4s, transform 0.4s',
              marginTop: index % 2 === 1 ? '5rem' : '0', // Creates the staggered floating look
              boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.02)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${product.color}40`;
              e.currentTarget.style.boxShadow = `0 0 40px ${product.glowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Glow orb */}
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: product.color,
                opacity: 0.15,
                filter: 'blur(80px)',
                pointerEvents: 'none',
              }}
            />

            <div>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>
                {product.emoji}
              </span>
              <h3
                style={{
                  fontFamily: "'Clash Display', 'Inter', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: product.color,
                  marginBottom: '0.75rem',
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 300,
                  color: 'rgba(255, 255, 255, 0.55)',
                  lineHeight: 1.6,
                }}
              >
                {product.tagline}
              </p>
            </div>

            {product.route !== '#' && (
              <div
                style={{
                  marginTop: '1.5rem',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: product.color,
                  letterSpacing: '0.05em',
                }}
              >
                Explore →
              </div>
            )}

            {product.route === '#' && (
              <div
                style={{
                  marginTop: '1.5rem',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.25)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Coming soon
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
