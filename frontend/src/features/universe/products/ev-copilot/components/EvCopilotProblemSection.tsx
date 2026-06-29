import { motion } from 'framer-motion';
import { BatteryWarning, Layers, Brain, UserX } from 'lucide-react';

const problems = [
  {
    icon: <BatteryWarning className="w-8 h-8" />,
    title: "Range Anxiety & Logistics",
    description: "Planning long trips means constantly stressing about battery levels, desperately searching for chargers, and hoping they actually work when you get there."
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: "Fragmented Planning",
    description: "Drivers are forced to juggle Google Maps for directions, PlugShare for chargers, and Yelp for food, making the drive feel like a stressful chore."
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Too Much to Think About",
    description: "Unexpected traffic or mountain roads drain the battery faster than expected, forcing you to nervously recalculate everything on the fly."
  },
  {
    icon: <UserX className="w-8 h-8" />,
    title: "Lack of Personalization",
    description: "Standard navigation apps treat all drivers exactly the same, ignoring what you actually like to eat or how you prefer to travel."
  }
];

export default function EvCopilotProblemSection() {
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
            The EV Road Trip <span style={{ color: 'var(--color-accent)' }}>Dilemma</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            As more people switch to electric vehicles, drivers are facing a unique set of challenges that traditional navigation apps just aren't built to handle.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl glass border border-[var(--color-border)] hover:border-white/20 transition-all duration-300"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
              >
                {problem.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{problem.title}</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
