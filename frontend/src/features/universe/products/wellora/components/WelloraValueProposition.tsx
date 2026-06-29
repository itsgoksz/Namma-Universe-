import { motion } from 'framer-motion';
import { Heart, TrendingUp, ShieldCheck, Database } from 'lucide-react';

const propositions = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "For the Everyday User",
    benefits: [
      "Effortless Habit Building: Wellora remembers your preferences, like 'my usual coffee', so you never have to repeat yourself.",
      "Mental Peace: A calm persona ensures engaging with health metrics reduces anxiety rather than creating it.",
      "Immediate Support: Get instant, empathetic, and helpful responses for late-night cravings or bad moods."
    ]
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Unprecedented Retention",
    benefits: [
      "A Joy to Use: By removing friction and adding real empathy, Wellora turns health tracking from a chore into a daily moment of peace.",
      "Humanized Experience: Users stay because they feel understood and supported, not audited or judged."
    ]
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Rich Data Moat",
    benefits: [
      "Deep Personalization: Wellora truly gets to know you over time, remembering your unique habits and routines.",
      "A Genuine Connection: This deep understanding of your personal preferences makes Wellora feel less like software and more like a real companion."
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
            Why people love using Wellora every day.
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
