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

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { sharedState } from './ParticleField';

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
    description: 'Wellora is a voice-enabled, emotionally intelligent AI wellness companion that makes tracking frictionless and supportive. It transforms the chore of logging food, hydration, sleep, and mood into a natural, calming conversation.',
    color: '#2ECC71',
    gradientFrom: 'rgba(46, 204, 113, 0.12)',
    gradientTo: 'rgba(46, 204, 113, 0.02)',
    route: '/products/wellora',
    available: true,
  },
  {
    id: 'echo',
    name: 'Echo',
    emoji: '🌾',
    tagline: 'The operational brain for your farm, tracking fields and monitoring weather natively on the edge.',
    description: 'Meet your farm\'s new best friend. Echo keeps a watchful eye on the weather, automatically manages your irrigation, and takes care of your daily reports—so you can spend less time managing data and more time growing your business.',
    color: '#2DD4FF',
    gradientFrom: 'rgba(45, 212, 255, 0.12)',
    gradientTo: 'rgba(45, 212, 255, 0.02)',
    route: '/products/echo',
    available: true,
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
    route: '/products/ev-copilot',
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
];

export default function ProductWorlds({ activeProductIndexRef }: { activeProductIndexRef?: React.MutableRefObject<number | null> }) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mathematically perfect tracker that calculates exact float index based on card centers
  useEffect(() => {
    let animationFrameId: number;
    
    const updateIndex = () => {
      if (!containerRef.current || !activeProductIndexRef) return;
      
      const cards = containerRef.current.children;
      if (cards.length < worlds.length) {
        animationFrameId = requestAnimationFrame(updateIndex);
        return;
      }

      const centerY = window.innerHeight / 2;
      const centers: number[] = [];
      
      // Get the absolute center of each card
      for (let i = 0; i < worlds.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        centers.push(rect.top + rect.height / 2);
      }
      
      // Check if we are totally above or below the container
      const firstCardTop = cards[0].getBoundingClientRect().top;
      const lastCardBottom = cards[worlds.length - 1].getBoundingClientRect().bottom;
      
      const vh = window.innerHeight;
      
      if (firstCardTop > vh * 0.5) {
        // Entering from the top
        // Start transitioning when the card is at 80% vh, finish transitioning to 0 when it hits 50% vh
        let t = 1 - ((firstCardTop - vh * 0.5) / (vh * 0.3));
        t = Math.max(0, Math.min(1, t));
        
        // Aggressive snap: if the card is mostly in view, lock to it instantly
        if (t > 0.4) t = 1;
        else t = t / 0.4;
        
        // Easing
        t = t * t * (3 - 2 * t);
        
        if (t === 0) {
          activeProductIndexRef.current = null;
        } else {
          activeProductIndexRef.current = t - 1; // -1 to 0
        }
      } else if (lastCardBottom < vh * 0.2) {
        // Leaving from the bottom
        let t = (vh * 0.5 - lastCardBottom) / (vh * 0.3);
        t = Math.max(0, Math.min(1, t));
        
        if (t > 0.4) t = 1;
        else t = t / 0.4;
        
        t = t * t * (3 - 2 * t);
        
        if (t === 1) {
          activeProductIndexRef.current = null;
        } else {
          activeProductIndexRef.current = (worlds.length - 1) + t;
        }
      } else {
        // Calculate the exact float index
        if (centerY <= centers[0]) {
          activeProductIndexRef.current = 0;
        } else if (centerY >= centers[worlds.length - 1]) {
          activeProductIndexRef.current = worlds.length - 1;
        } else {
          // Find which two cards the center is between
          for (let i = 0; i < worlds.length - 1; i++) {
            if (centerY >= centers[i] && centerY <= centers[i + 1]) {
              const distance = centers[i + 1] - centers[i];
              let progress = (centerY - centers[i]) / distance;
              
              // Strong snapping to integers:
              // For the first 30% of the scroll distance, stay locked on card i
              // For the last 30% of the scroll distance, stay locked on card i+1
              if (progress < 0.3) progress = 0;
              else if (progress > 0.7) progress = 1;
              else progress = (progress - 0.3) / 0.4;
              
              progress = progress * progress * (3 - 2 * progress);
              
              activeProductIndexRef.current = i + progress;
              break;
            }
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(updateIndex);
    };
    
    updateIndex();
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeProductIndexRef]);

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
        ref={containerRef}
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
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={world.available ? { scale: 1.01, y: -2 } : {}}
            onClick={() => { 
              if (world.available) {
                sharedState.isZoomingInto = world.id;
                sharedState.spawnZoomedIn = true; // Tell the next page to spawn zoomed in!
                setTimeout(() => {
                  sharedState.isZoomingInto = null; // Reset for the new page!
                  navigate(world.route);
                }, 800);
              } 
            }}
            className={`flex flex-col md:flex-row items-center justify-between text-center md:text-left relative overflow-hidden md:w-[45%] ml-auto`}
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
