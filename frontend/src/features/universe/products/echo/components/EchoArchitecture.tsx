import { motion } from 'framer-motion';
import { Database, Server, Cpu, BrainCircuit } from 'lucide-react';

const stack = [
  {
    title: "Intelligence Layer",
    description: "Powered by Llama 3.3-70b via Groq, orchestrated by LangGraph for stateful, multi-step reasoning.",
    icon: <BrainCircuit className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
  },
  {
    title: "Backend Service",
    description: "High-performance, asynchronous FastAPI bridge managing transactions and the APScheduler automation engine.",
    icon: <Server className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
  },
  {
    title: "Enterprise Database",
    description: "SQL Server ensures enterprise-grade data persistence, integrity, and scalability for all farm records.",
    icon: <Database className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
  },
  {
    title: "Proactive Automation",
    description: "APScheduler drives the proactive Farm Scheduler that runs 24/7, tracking weather and irrigation.",
    icon: <Cpu className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
  }
];

export default function EchoArchitecture() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            A decoupled, modular <br />
            <span style={{ color: 'var(--color-text-tertiary)' }}>System Architecture.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="p-8 rounded-3xl border border-[var(--color-border)] glass flex flex-col items-center text-center hover:border-[var(--color-accent)] transition-colors duration-300"
              style={{ background: 'var(--color-bg-tertiary)' }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-[var(--color-border)] shadow-inner" style={{ background: 'var(--color-bg-secondary)' }}>
                {tech.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{tech.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
