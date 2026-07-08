import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

interface NammaVoiceFinalCTAProps {
  onOpenDemo?: () => void;
}

export default function NammaVoiceFinalCTA({ onOpenDemo }: NammaVoiceFinalCTAProps) {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square rounded-full blur-[160px] opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--color-accent)' }}></div>
      
      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 rounded-[3rem] glass border border-[var(--color-border)] relative overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
        >
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
            <Megaphone className="w-10 h-10" style={{ color: 'var(--color-accent)' }} />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Make Your <br />
            <span style={{ color: 'var(--color-accent)' }}>Voice Heard.</span>
          </h2>
          
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Join your neighbors in reporting issues, building community awareness, and holding local authorities accountable.
          </p>
          
          <button
            onClick={onOpenDemo}
            className="px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-[#120B0F] shadow-[0_0_40px_rgba(0,212,178,0.3)]"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Join Namma Voice
          </button>
        </motion.div>
      </div>
    </section>
  );
}
