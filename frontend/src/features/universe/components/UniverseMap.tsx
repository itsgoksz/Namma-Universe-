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
    route: '/products/echo',
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
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="flex md:flex-wrap md:justify-center overflow-x-auto md:overflow-visible w-full max-w-[1400px] mx-auto gap-4 md:gap-10 px-6 md:px-0 pb-8 md:pb-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
            className={`flex-shrink-0 snap-center w-[160px] md:w-full md:max-w-[340px] min-h-[160px] md:min-h-[260px] flex flex-col justify-center md:justify-between items-center md:items-start ${index % 2 === 1 ? 'md:mt-20' : ''}`}
            style={{
              position: 'relative',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.01)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              cursor: product.route !== '#' ? 'pointer' : 'default',
              overflow: 'hidden',
              transition: 'border-color 0.4s, box-shadow 0.4s, transform 0.4s',
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

            <div className="text-center md:text-left flex flex-col items-center md:items-start relative z-10">
              <span className="text-4xl md:text-5xl block mb-2 md:mb-4">
                {product.emoji}
              </span>
              <h3
                className="text-lg md:text-2xl font-semibold mb-1 md:mb-3"
                style={{
                  fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                  color: product.color,
                }}
              >
                {product.name}
              </h3>
              <p
                className="hidden md:block text-[0.95rem] font-light text-white/55 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {product.tagline}
              </p>
            </div>

            {product.route !== '#' && (
              <div
                className="hidden md:block mt-6 text-sm font-medium tracking-wide relative z-10"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: product.color,
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
