import { motion } from 'framer-motion';
import { ShieldCheck, Crosshair, HeartHandshake } from 'lucide-react';

const propositions = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Zero Brokers, Zero Spam",
    benefits: [
      "No Middlemen: We aggregate and verify listings directly so you never have to deal with brokers.",
      "Verified Accuracy: Stop worrying about fake photos and inaccurate pricing.",
      "Complete Privacy: We protect your phone number from spam callers and endless WhatsApp groups."
    ]
  },
  {
    icon: <Crosshair className="w-8 h-8" />,
    title: "Hyper-Personalized",
    benefits: [
      "Custom Commutes: See exactly how long it takes to reach YOUR specific office desk.",
      "Budget Precision: Detailed breakdowns of rent, deposits, and maintenance.",
      "Lifestyle Matches: From vegan food options to gym proximity, we filter by what you care about."
    ]
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: "Human-First Design",
    benefits: [
      "Conversational Interface: Ask natural questions instead of toggling 50 confusing filters.",
      "Premium Experience: A beautifully designed platform that feels calm and reassuring.",
      "Unbiased Advice: We work for YOU, not the landlord or the property manager."
    ]
  }
];

export default function HomieValueProposition() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Why <span style={{ color: 'var(--color-accent)' }}>Homie?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            We don't just show you homes; we show you homes that fit your exact commute, budget, and lifestyle.
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
