import { motion } from 'framer-motion';
import { Network, Server, Code2, Layers } from 'lucide-react';

const techStack = [
  {
    icon: <Server className="w-6 h-6" />,
    title: "FastAPI Backend",
    description: "High-performance, asynchronous Python backend handling complex routing logic and external API integrations."
  },
  {
    icon: <Network className="w-6 h-6" />,
    title: "LangGraph Agent Bus",
    description: "An asynchronous event-driven architecture enabling multiple AI agents to communicate and negotiate in parallel."
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "LLM Integration",
    description: "Utilizes powerful models like Gemma, Llama, or Google AI for natural language reasoning and curation."
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "React Frontend",
    description: "A highly responsive, aesthetically premium Vite/React dashboard with real-time streaming updates."
  }
];

export default function EvCopilotArchitecture() {
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
            Technical <span style={{ color: 'var(--color-accent)' }}>Edge</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Car Co-Pilot is built on a scalable, modern technology stack designed for the future of autonomous and electric mobility.
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
              className="flex gap-6 p-8 rounded-3xl glass border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all duration-300"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div className="shrink-0 p-4 rounded-2xl h-fit" style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
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
