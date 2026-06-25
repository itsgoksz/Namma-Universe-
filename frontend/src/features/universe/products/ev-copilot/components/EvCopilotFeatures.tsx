import { motion } from 'framer-motion';
import { Sparkles, Battery, UtensilsCrossed, Database } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Proactive Intelligence",
    description: "Car Co-Pilot doesn't just react; it anticipates. If the route includes steep elevations, the Vehicle Dynamics Engine calculates the increased battery consumption and automatically routes you to an earlier charger."
  },
  {
    icon: <Battery className="w-8 h-8" />,
    title: "Dynamic EV Battery Logic",
    description: "Automatically inserts charging stops only when the battery threshold requires it, minimizing unnecessary downtime."
  },
  {
    icon: <UtensilsCrossed className="w-8 h-8" />,
    title: "Context-Aware Amenities",
    description: "Seamlessly pairs necessary charging stops with highly-rated restaurants matching your specific preferences."
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Memory & Telemetry",
    description: "Remembers driver preferences and stores trip history via SQLite databases, paving the way for predictive, highly personalized future trips."
  }
];

export default function EvCopilotFeatures() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-[150px] opacity-10" style={{ background: 'var(--color-accent)' }} />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-3xl mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Key Features & <span style={{ color: 'var(--color-accent)' }}>Capabilities</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl glass border border-[var(--color-border)] hover:bg-white/5 transition-all duration-300 group"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
