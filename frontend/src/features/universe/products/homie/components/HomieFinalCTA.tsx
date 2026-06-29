import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HomieFinalCTAProps {
  onOpenDemo: () => void;
}

export default function HomieFinalCTA({ onOpenDemo }: HomieFinalCTAProps) {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square rounded-full blur-[160px] opacity-20" style={{ backgroundColor: 'var(--color-accent)' }}></div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass border border-[var(--color-border)] rounded-3xl p-12 md:p-20 relative overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
        >
          {/* Subtle animated border top */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}></div>

          <div className="inline-flex items-center justify-center p-4 rounded-2xl mb-8" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
            <Sparkles className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            The Future of <br />
            <span style={{ color: 'var(--color-accent)' }}>Moving</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-12" style={{ color: 'var(--color-text-secondary)' }}>
            Our vision goes beyond just finding a place to sleep. Homie is evolving into a full Relocation Concierge. Soon, a single click will help you book movers, set up your internet connection, arrange your local SIM card, and open your new bank account.
            <br /><br />
            <span className="font-semibold text-white">With Homie, you don't need a broker, a dozen tabs, or endless phone calls. You just need to pack your bags. We'll handle the rest.</span>
          </p>

          <button
            onClick={onOpenDemo}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 text-[#120B0F] overflow-hidden w-full sm:w-auto"
            style={{ backgroundColor: 'var(--color-accent)', boxShadow: 'var(--shadow-premium)' }}
          >
            <span className="relative z-10">Start Your Move Today</span>
            <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
