import { ArrowRight } from 'lucide-react';

interface EchoFinalCTASectionProps {
  onOpenDemo: () => void;
}

export default function EchoFinalCTASection({ onOpenDemo }: EchoFinalCTASectionProps) {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none opacity-20" style={{ background: 'var(--color-accent)' }}></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-8">
          Ready to run your <br />
          farm on <span style={{ color: 'var(--color-accent)' }}>auto-pilot?</span>
        </h2>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Join the next generation of agriculture. Let Echo monitor your fields, schedule your irrigation, and synthesize your reports.
        </p>
        
        <button
          onClick={onOpenDemo}
          className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-[#120B0F] shadow-2xl"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Book a Demo
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
