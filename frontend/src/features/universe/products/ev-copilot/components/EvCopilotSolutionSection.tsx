import { motion } from 'framer-motion';
import { Route, Zap, Coffee, CloudRain, MessageSquareText } from 'lucide-react';

const agents = [
  {
    icon: <Route className="w-6 h-6" />,
    title: "Optimization & Route Agents",
    description: "Maps the fastest route while managing complex EV battery logic, mathematically ensuring the vehicle never runs out of charge."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Charging Agent",
    description: "Scans the exact route for optimal charging stations, dynamically filtering by distance, speed, and network compatibility."
  },
  {
    icon: <Coffee className="w-6 h-6" />,
    title: "Food & Amenity Agent",
    description: "Aligns meal stops with charging sessions, explicitly filtering for the driver's dietary preferences (e.g., finding top-rated vegetarian food precisely where the car needs to charge)."
  },
  {
    icon: <CloudRain className="w-6 h-6" />,
    title: "Traffic & Weather Agents",
    description: "Analyzes conditions ahead. If the route goes through mountainous terrain or heavy rain, the system anticipates higher battery consumption and preemptively adjusts charging stops."
  },
  {
    icon: <MessageSquareText className="w-6 h-6" />,
    title: "Curation Agent (Jarvis)",
    description: "Synthesizes all this complex data into a concise, human-readable intelligence briefing, explaining the 'why' behind the plan in a natural, conversational tone."
  }
];

export default function EvCopilotSolutionSection() {
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
            The Multi-Agent <span style={{ color: 'var(--color-accent)' }}>Ecosystem</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Car Co-Pilot replaces manual planning with a suite of highly specialized AI agents connected via an asynchronous Agent Bus. Together, they negotiate and curate the perfect trip in seconds.
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)] to-transparent opacity-30" />

          <div className="space-y-12">
            {agents.map((agent, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col md:flex-row gap-6 md:gap-12 group"
              >
                {/* Timeline node */}
                <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-[var(--color-bg-primary)] z-10 transition-colors duration-300" style={{ backgroundColor: 'var(--color-accent)' }} />

                <div className="md:ml-24 flex-1 glass border border-[var(--color-border)] rounded-3xl p-8 hover:border-[var(--color-accent)] transition-all duration-300" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
                      {agent.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{agent.title}</h3>
                  </div>
                  <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {agent.description}
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
