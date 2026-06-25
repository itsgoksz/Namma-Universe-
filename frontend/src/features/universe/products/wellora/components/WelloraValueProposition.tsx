import { motion } from 'framer-motion';
import { UserHeart, TrendingUp, ShieldCheck, Database } from 'lucide-react';

const propositions = [
  {
    icon: <UserHeart className="w-8 h-8" />,
    title: "For the Everyday User",
    benefits: [
      "Zero-Effort Habit Building: Interruptible dialogue state tracking remembers preferences like 'my usual coffee' so you never repeat yourself.",
      "Mental Peace: A calm persona ensures engaging with health metrics reduces anxiety rather than creating it.",
      "Immediate Support: Get instant, empathetic, and scientifically accurate responses for late-night cravings or bad moods."
    ]
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Unprecedented Retention",
    benefits: [
      "Combats Churn: By removing friction and adding emotional empathy, Wellora directly targets the massive drop-off rates typical in Diet & Nutrition apps.",
      "Humanized Experience: Users stay because they feel understood and supported, not audited or judged."
    ]
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Rich Data Moat",
    benefits: [
      "Semantic Memory Models: Builds deep semantic and episodic memory models for each individual user.",
      "Competitive Advantage: This proprietary dataset of highly personalized preferences and emotional triggers is something generic LLMs cannot easily replicate."
    ]
  }
];

export default function WelloraValueProposition() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-[150px] opacity-10" style={{ background: '#2DD4FF' }} />
        <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-[150px] opacity-10" style={{ background: 'var(--color-accent)' }} />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            How Wellora Helps <span style={{ color: 'var(--color-accent)' }}>Everyone</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Value propositions for users, investors, and stakeholders.
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
              className="p-8 rounded-3xl glass border border-[var(--color-border)] hover:border-white/20 transition-all duration-300 group"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: index === 0 ? 'var(--color-accent-subtle)' : 'rgba(45, 212, 255, 0.15)', color: index === 0 ? 'var(--color-accent)' : '#2DD4FF' }}
              >
                {prop.icon}
              </div>
              <h3 className="text-2xl font-bold mb-6">{prop.title}</h3>
              <ul className="space-y-4">
                {prop.benefits.map((benefit, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: index === 0 ? 'var(--color-accent)' : '#2DD4FF' }} />
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
