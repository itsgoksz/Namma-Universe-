import { motion } from 'framer-motion';
import { Mic, HeartPulse, Activity } from 'lucide-react';

interface WelloraHeroSectionProps {
  onOpenDemo: () => void;
}

export default function WelloraHeroSection({ onOpenDemo }: WelloraHeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Background gradients using Teal & Green */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20" style={{ background: '#2DD4FF' }}></div>
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
            <span className="text-sm font-medium tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>MEET WELLORA</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            Your Personal <br />
            <span style={{ color: 'var(--color-accent)' }}>Wellness Companion</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Wellora transforms the chore of tracking food, hydration, sleep, and mood into a natural, calming conversation without any judgment.
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
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 w-full max-w-lg lg:max-w-none relative"
        >
          {/* Abstract Chat Interface */}
          <div className="relative rounded-3xl overflow-hidden glass border border-[var(--color-border)] p-6 sm:p-8 aspect-square lg:aspect-auto lg:h-[600px] flex flex-col justify-end gap-6 shadow-2xl" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
            
            <div className="flex-1 flex flex-col gap-4 overflow-hidden mb-4">
              {/* User Message */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="self-end max-w-[80%] p-4 rounded-2xl rounded-br-sm border border-[var(--color-border)] bg-white/5"
              >
                <p className="text-sm text-white">"I had a stressful day, so I just grabbed two dosas and my usual coffee for dinner."</p>
              </motion.div>

              {/* Wellora Message */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="self-start max-w-[85%] p-4 rounded-2xl rounded-bl-sm border border-transparent"
                style={{ backgroundColor: 'var(--color-accent-subtle)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <HeartPulse className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>WELLORA</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  I'm sorry it was a stressful day. Two dosas and coffee is perfectly fine! I've logged the meal (approx 350 kcal). Take some time to unwind tonight.
                </p>
              </motion.div>

              {/* User Message 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="self-end max-w-[80%] p-4 rounded-2xl rounded-br-sm border border-[var(--color-border)] bg-white/5"
              >
                <p className="text-sm text-white">"Also, I'm having bad stomach cramps right now."</p>
              </motion.div>

              {/* Wellora Message 2 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="self-start max-w-[85%] p-4 rounded-2xl rounded-bl-sm border border-transparent"
                style={{ backgroundColor: 'rgba(45, 212, 255, 0.15)' }} // Teal subtle background
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4" style={{ color: '#2DD4FF' }} />
                  <span className="text-xs font-semibold" style={{ color: '#2DD4FF' }}>WELLORA</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  I noticed you had some bananas and spinach earlier—that's great for cramps! Maybe pair it with some warm ginger tea now. I'll note your symptoms.
                </p>
              </motion.div>
            </div>

            {/* Input Mockup */}
            <div className="h-14 rounded-full border border-[var(--color-border)] bg-black/40 flex items-center px-4 justify-between">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Hold to speak...</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
                <Mic className="w-4 h-4 text-[#120B0F]" />
              </div>
            </div>

          </div>
          
          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
            style={{ backgroundColor: '#2DD4FF' }} // Teal
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
            style={{ backgroundColor: 'var(--color-accent)' }} // Green
          />
        </motion.div>
      </div>
    </section>
  );
}
