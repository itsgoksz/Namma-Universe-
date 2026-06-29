import { motion } from 'framer-motion';
import { Home, MapPin, Navigation } from 'lucide-react';

interface HomieHeroSectionProps {
  onOpenDemo: () => void;
}

export default function HomieHeroSection({ onOpenDemo }: HomieHeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20" style={{ background: 'var(--color-accent)' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-10" style={{ background: 'var(--color-accent)' }}></div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left text content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] mb-6 glass"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }}></span>
            <span className="text-sm font-medium tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>MEET HOMIE</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            The Ultimate <br />
            <span style={{ color: 'var(--color-accent)' }}>Relocation Copilot</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Moving to a new city is one of the most exciting milestones in life—but the actual process is often chaotic, overwhelming, and exhausting. Homie changes all of that. We are your personal relocation advisor, real estate expert, and city onboarding assistant.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenDemo}
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-[#120B0F] shadow-lg"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Start Your Move
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right UI Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 w-full max-w-lg lg:max-w-none relative"
        >
          {/* Abstract Dashboard Frame */}
          <div className="relative rounded-3xl overflow-hidden glass border border-[var(--color-border)] p-6 sm:p-8 aspect-square lg:aspect-auto lg:h-[600px] flex flex-col justify-center gap-6 shadow-2xl" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
            
            {/* Alert 1 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-black/20"
            >
              <div className="p-3 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <Navigation className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Commute Intelligence</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>You're working at Manyata Tech Park. I found a great flat in HRBR Layout—only 15 mins by bike.</p>
              </div>
            </motion.div>

            {/* Alert 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-black/20"
            >
              <div className="p-3 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <MapPin className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Livability Score: 92/100</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>This neighborhood is highly rated for safety and has excellent local food options nearby.</p>
              </div>
            </motion.div>

            {/* Alert 3 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-black/20"
            >
              <div className="p-3 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <Home className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Property Match Found</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Private room under ₹12,000. Reliable Wi-Fi confirmed by 3 past tenants. Zero brokerage.</p>
              </div>
            </motion.div>

          </div>
          
          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
