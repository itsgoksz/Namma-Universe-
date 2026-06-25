import { motion } from 'framer-motion';
import { Mic2, HeartHandshake, Layers, Sparkles } from 'lucide-react';

const solutions = [
  {
    icon: <Mic2 className="w-6 h-6" />,
    title: "Frictionless Voice & Text Logging",
    description: "Simply speak naturally: 'I had two dosas and my usual coffee.' Wellora's orchestration pipeline instantly extracts the food, calculates the calories and macros, and logs it effortlessly."
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Empathetic Tone Adaptation",
    description: "Wellora classifies your emotional tone (stressed, sad, tired, motivated) and adjusts its responses. Programmed with a strict 'no shaming' directive, it acts as a supportive friend."
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Unified Wellness Hub",
    description: "Seamlessly processes food, hydration, sleep, and mood logs within the same conversational interface, drawing intelligent connections between your lifestyle choices."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Hyper-Personalized Insights",
    description: "Mention a stomach ache, and Wellora instantly cross-references your short-term episodic memory (what you ate today) to provide contextual, actionable advice."
  }
];

export default function WelloraSolutionSection() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            A Paradigm Shift in <span style={{ color: 'var(--color-accent)' }}>Digital Health</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            By combining advanced natural language processing with deep empathy, Wellora offers highly personalized, non-judgmental support that adapts to your emotional state in real-time.
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent)] via-[#2DD4FF] to-transparent opacity-30" />

          <div className="space-y-12">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col md:flex-row gap-6 md:gap-12 group"
              >
                {/* Timeline node */}
                <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-[var(--color-bg-primary)] z-10 transition-colors duration-300" style={{ backgroundColor: index % 2 === 0 ? 'var(--color-accent)' : '#2DD4FF' }} />

                <div className="md:ml-24 flex-1 glass border border-[var(--color-border)] rounded-3xl p-8 hover:border-[var(--color-accent)] transition-all duration-300 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2ECC71]/0 to-[#2DD4FF]/0 group-hover:from-[#2ECC71]/5 group-hover:to-[#2DD4FF]/5 transition-colors duration-500 pointer-events-none" />

                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: index % 2 === 0 ? 'var(--color-accent-subtle)' : 'rgba(45, 212, 255, 0.15)', color: index % 2 === 0 ? 'var(--color-accent)' : '#2DD4FF' }}>
                      {solution.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{solution.title}</h3>
                  </div>
                  <p className="text-lg leading-relaxed relative z-10" style={{ color: 'var(--color-text-secondary)' }}>
                    {solution.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
