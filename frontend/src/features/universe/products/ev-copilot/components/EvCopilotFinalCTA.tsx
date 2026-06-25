import { ArrowRight } from 'lucide-react';

interface EvCopilotFinalCTAProps {
  onOpenDemo: () => void;
}

export default function EvCopilotFinalCTA({ onOpenDemo }: EvCopilotFinalCTAProps) {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none opacity-20" style={{ background: 'var(--color-accent)' }}></div>
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-8">
          Ready to transform your road trips?
        </h2>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Experience the ultimate intelligence layer for EV routing, charging, and energy decisions.
        </p>
        
        <button
          onClick={onOpenDemo}
          className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-white shadow-2xl"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Book a Demo
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
