import { motion } from 'framer-motion';
import { Route, SearchCode, Smile, Mic } from 'lucide-react';

const techStack = [
  {
    icon: <Route className="w-6 h-6" />,
    title: "Context Confidence Routing",
    description: "Intelligently switches between short-term memory (what you just ate) and long-term semantic memory (your ongoing habits)."
  },
  {
    icon: <SearchCode className="w-6 h-6" />,
    title: "Dynamic Extractor Pipeline",
    description: "Uses robust NLP to parse complex, unstructured human speech into structured database entries (calories, macros, hydration volumes in ml, sleep hours)."
  },
  {
    icon: <Smile className="w-6 h-6" />,
    title: "Emotion & Tone Classification",
    description: "Real-time analysis of the user's sentiment, dynamically directing the companion LLM's instructions to match the user's energy and emotional needs."
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Voicebox Generation",
    description: "High-fidelity, interruptible voice synthesis that adjusts pacing and tone based on emotional context."
  }
];

export default function WelloraArchitecture() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            The Technology <span style={{ color: 'var(--color-accent)' }}>Under the Hood</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Scalable architecture utilizing an advanced orchestrator, dynamic dialogue state tracking, and background event buses.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 p-8 rounded-3xl glass border border-[var(--color-border)] hover:border-[#2DD4FF] transition-all duration-300"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div className="shrink-0 p-4 rounded-2xl h-fit" style={{ backgroundColor: index % 2 === 0 ? 'var(--color-accent-subtle)' : 'rgba(45, 212, 255, 0.15)', color: index % 2 === 0 ? 'var(--color-accent)' : '#2DD4FF' }}>
                {tech.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{tech.title}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {tech.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
