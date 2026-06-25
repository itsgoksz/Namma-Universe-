import { motion } from 'framer-motion';
import { User, Car, Globe } from 'lucide-react';

const propositions = [
  {
    icon: <User className="w-8 h-8" />,
    title: "For the EV Driver",
    benefits: [
      "Zero Range Anxiety: Trust that the AI has mathematically guaranteed your arrival.",
      "Time Savings: Eliminates the 30+ minutes usually spent cross-referencing maps, weather, and charging apps.",
      "A VIP Experience: Enjoy a personalized 'Jarvis-like' briefing that caters to your exact needs."
    ]
  },
  {
    icon: <Car className="w-8 h-8" />,
    title: "For Automakers (OEMs)",
    benefits: [
      "Next-Gen Infotainment: Modular FastAPI and LangGraph backend embedded directly into a vehicle's native OS.",
      "Brand Differentiation: Offering a proactive, AI-driven co-pilot transforms the vehicle into a smart, evolving ecosystem."
    ]
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "For the EV Ecosystem",
    benefits: [
      "Accelerates EV Adoption: Removes the friction and anxiety associated with long-distance EV travel.",
      "Data-Driven Insights: Helps optimize charging station placements and infrastructure planning."
    ]
  }
];

export default function EvCopilotValueProposition() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Value <span style={{ color: 'var(--color-accent)' }}>Proposition</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            How Car Co-Pilot helps everyone in the EV ecosystem.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {propositions.map((prop, index) => (
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
                {prop.icon}
              </div>
              <h3 className="text-2xl font-bold mb-6">{prop.title}</h3>
              <ul className="space-y-4">
                {prop.benefits.map((benefit, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: 'var(--color-accent)' }} />
                    <span className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
