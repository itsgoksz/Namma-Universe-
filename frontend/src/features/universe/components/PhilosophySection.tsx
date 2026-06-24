/**
 * PhilosophySection — Cinematic Scroll Storytelling
 * 
 * Large typography that fades in/out as the user scrolls.
 * Uses GSAP ScrollTrigger for pinning and scrubbed animations.
 * 
 * Flow: Problem → People → Technology → Impact
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    text: 'Most companies build AI.',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  {
    text: 'We build solutions.',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  {
    text: 'We start with the problem.',
    sub: 'Not the technology.',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  {
    text: 'We obsess over people.',
    sub: 'Their time. Their friction. Their unspoken needs.',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  {
    text: 'Then we apply intelligence.',
    sub: 'AI is one tool. Not the whole answer.',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  {
    text: 'The result?',
    color: 'rgba(255, 255, 255, 0.35)',
  },
  {
    text: 'Technology that acts\nin the real world.',
    color: '#6D5EF7',
  },
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Pin the section while scrolling through all slides
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${slides.length * 150}%`, // Give it more scroll time for the cinematic scale
          scrub: 1.5, // Smoother, heavier scrub
          pin: true,
          anticipatePin: 1,
        },
      });

      slidesRef.current.forEach((slide, i) => {
        if (!slide) return;
        const isFirst = i === 0;
        const isLast = i === slides.length - 1;

        // Give each slide a dedicated "time window" in the scrub timeline
        const startTime = i * 3;
        
        if (isFirst) {
          // First slide: already visible. Stays for a bit, then gets sucked forward
          tl.to(slide, { 
            opacity: 0, 
            scale: 4.0, 
            duration: 1.5,
            ease: 'power2.in'
          }, startTime + 1.0);
        } else {
          // Deep focus pull: emerges from the abyss
          tl.fromTo(
            slide,
            { 
              opacity: 0, 
              scale: 0.2, 
              filter: 'blur(20px)',
              y: 20 
            },
            { 
              opacity: 1, 
              scale: 1.0, 
              filter: 'blur(0px)',
              y: 0, 
              duration: 1.5,
              ease: 'power2.out'
            },
            startTime
          );
          
          if (!isLast) {
            // Flies past the camera into the void
            tl.to(slide, { 
              opacity: 0, 
              scale: 4.0, 
              duration: 1.5,
              ease: 'power2.in'
            }, startTime + 2.0); // Start fading out only after it has been fully visible
          } else {
            // The final statement lands and slowly breathes
            tl.to(slide, { 
              scale: 1.05, 
              duration: 2.0, 
              ease: 'none' 
            }, startTime + 1.5);
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 10,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        overflow: 'hidden',
        perspective: '1000px', // Adds depth for the scaling
      }}
    >
      {/* Subtle background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(109, 94, 247, 0.04), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          ref={(el) => { slidesRef.current[i] = el; }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            opacity: i === 0 ? 1 : 0,
            transformOrigin: 'center center',
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontSize: 'clamp(3rem, 8vw, 7rem)', // Massive typography
              fontWeight: 600,
              color: slide.color,
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              whiteSpace: 'pre-line',
              maxWidth: '1200px',
              textShadow: '0 0 80px rgba(255, 255, 255, 0.1)', // Subtle glow
            }}
          >
            {slide.text}
          </h2>
          {slide.sub && (
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.45)',
                textAlign: 'center',
                marginTop: '2rem',
                maxWidth: '800px',
                letterSpacing: '0.02em',
              }}
            >
              {slide.sub}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
