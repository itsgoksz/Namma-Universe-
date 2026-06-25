/**
 * ProductWorlds — Each Product in Its Own Visual Identity
 * 
 * Horizontal-style sections (vertically stacked on scroll) where each
 * product gets a unique visual energy:
 *   Aiva      → Purple energy
 *   Wellora   → Organic green calm
 *   Echo      → Cyan audio resonance
 *   Homie     → Warm amber city intelligence
 *   EV Copilot → Electric blue motion
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ProductWorld {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  route: string;
  available: boolean;
}

const worlds: ProductWorld[] = [
  {
    id: 'aiva',
    name: 'Aiva',
    emoji: '🧠',
    tagline: 'Your adaptive intelligence layer for thinking, building, and deciding faster.',
    description: 'Aiva is an AI receptionist that answers calls, handles WhatsApp enquiries, books appointments, and follows up with customers — automatically, 24/7.',
    color: '#A66B8E',
    gradientFrom: 'rgba(166, 107, 142, 0.15)',
    gradientTo: 'rgba(166, 107, 142, 0.02)',
    route: '/products/aiva',
    available: true,
  },
  {
    id: 'wellora',
    name: 'Wellora',
    emoji: '🌿',
    tagline: 'A quiet system that helps you understand and optimize your physical and mental wellbeing.',
    description: 'Wellora brings calm intelligence to health and wellness — tracking, understanding, and gently guiding you toward better decisions about your body and mind.',
    color: '#2ECC71',
    gradientFrom: 'rgba(46, 204, 113, 0.12)',
    gradientTo: 'rgba(46, 204, 113, 0.02)',
    route: '#',
    available: false,
  },
  {
    id: 'echo',
    name: 'Echo',
    emoji: '🌾',
    tagline: 'The operational brain for your farm, tracking fields and monitoring weather natively on the edge.',
    description: 'Echo is a comprehensive, autonomous AI assistant. It tracks weather, schedules irrigation, manages fertilizer inventory, and synthesizes daily operational reports to help you run your farm on auto-pilot.',
    color: '#2DD4FF',
    gradientFrom: 'rgba(45, 212, 255, 0.12)',
    gradientTo: 'rgba(45, 212, 255, 0.02)',
    route: '/products/echo',
    available: true,
  },
  {
    id: 'homie',
    name: 'Homie',
    emoji: '🏠',
    tagline: 'An intelligent home companion that learns how you live and quietly simplifies it.',
    description: 'Homie observes your patterns, anticipates your needs, and automates the invisible friction of daily life at home — from energy to errands.',
    color: '#F5A623',
    gradientFrom: 'rgba(245, 166, 35, 0.12)',
    gradientTo: 'rgba(245, 166, 35, 0.02)',
    route: '#',
    available: false,
  },
  {
    id: 'ev-copilot',
    name: 'EV Copilot',
    emoji: '⚡',
    tagline: 'A real-time intelligence layer for EV routing, charging, and energy decisions.',
    description: 'EV Copilot eliminates range anxiety with real-time routing, smart charging schedules, and energy-aware trip planning for electric vehicle owners.',
    color: '#6D5EF7',
    gradientFrom: 'rgba(109, 94, 247, 0.12)',
    gradientTo: 'rgba(109, 94, 247, 0.02)',
    route: '#',
    available: false,
  },
];

export default function ProductWorlds({ activeProductIndexRef }: { activeProductIndexRef?: React.MutableRefObject<number | null> }) {
  const navigate = useNavigate();

  return (
    <section
      id="products"
      style={{
        position: 'relative',
        zIndex: 20,
        background: 'transparent', // Let WebGL show through
        padding: '10rem 1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '5rem' }}
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
          Every product is its own world.
        </h2>
      </motion.div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8rem', // Massive spacing between worlds
        }}
      >
        {worlds.map((world, index) => (
          <motion.div
            key={world.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            onViewportEnter={() => {
              if (activeProductIndexRef) activeProductIndexRef.current = index;
            }}
            onViewportLeave={() => {
              if (activeProductIndexRef && activeProductIndexRef.current === index) {
                activeProductIndexRef.current = null;
              }
            }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={world.available ? { scale: 1.01, y: -2 } : {}}
            onClick={() => { if (world.available) navigate(world.route); }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between text-center md:text-left relative overflow-hidden`}
            style={{
              padding: 'clamp(2.5rem, 5vw, 6rem) clamp(1.5rem, 4vw, 4rem)',
              minHeight: '65vh', // Massive panels
              borderRadius: '40px',
              background: 'rgba(5, 6, 10, 0.45)', // Deep glass
              backdropFilter: 'blur(48px)',
              WebkitBackdropFilter: 'blur(48px)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.01), 0 40px 100px rgba(0, 0, 0, 0.5)',
              cursor: world.available ? 'pointer' : 'default',
              gap: 'clamp(3rem, 6vw, 6rem)',
              transition: 'border-color 0.5s',
            }}
            onMouseEnter={(e) => {
              if (world.available) {
                e.currentTarget.style.borderColor = `${world.color}30`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            {/* Massive Aurora Glow */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: index % 2 === 0 ? '70%' : '30%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                borderRadius: '50%',
                background: world.color,
                opacity: 0.12,
                filter: 'blur(160px)',
                pointerEvents: 'none',
              }}
            />

            {/* Visual element — abstract energy representation */}
            <div
              style={{
                flex: '0 0 auto',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                position: 'relative',
              }}
            >
              {/* Orbital ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-8px',
                  borderRadius: '50%',
                  border: `1px solid ${world.color}25`,
                  animation: 'spin 20s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: '-20px',
                  borderRadius: '50%',
                  border: `1px solid ${world.color}10`,
                  animation: 'spin 35s linear infinite reverse',
                }}
              />
              {/* Core */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${world.color}30, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                }}
              >
                {world.emoji}
              </div>
            </div>

            {/* Text */}
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: world.color,
                  }}
                >
                  {world.name}
                </h3>
                {!world.available && (
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.3)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    Coming soon
                  </span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '0.75rem',
                  fontStyle: 'italic',
                }}
              >
                {world.tagline}
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 300,
                  color: 'rgba(255, 255, 255, 0.4)',
                  lineHeight: 1.7,
                  maxWidth: '550px',
                }}
              >
                {world.description}
              </p>
              {world.available && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: world.color,
                  }}
                >
                  Enter world →
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
