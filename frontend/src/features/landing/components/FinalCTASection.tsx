import { motion } from 'framer-motion';

interface FinalCTASectionProps {
  onOpenDemo: () => void;
}

export default function FinalCTASection({ onOpenDemo }: FinalCTASectionProps) {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background with abstract gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square rounded-full blur-[100px] opacity-30" style={{ background: 'var(--color-accent)' }}></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-4xl relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Your next customer <br />
            is calling right now.
          </h2>
          <p className="text-2xl mb-12 font-light" style={{ color: 'var(--color-text-secondary)' }}>
            Will someone answer?
          </p>
          
          <button
            onClick={onOpenDemo}
            className="px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-white shadow-2xl"
            style={{ backgroundColor: 'var(--color-accent)', boxShadow: '0 10px 40px -10px var(--color-accent)' }}
          >
            Hire Aiva Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}
