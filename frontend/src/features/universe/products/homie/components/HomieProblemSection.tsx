import { motion } from 'framer-motion';
import { SearchX, Clock, ShieldAlert, WifiOff } from 'lucide-react';

const problems = [
  {
    title: "Endless Searching",
    description: "You're forced to piece together information from NoBroker, WhatsApp groups, Facebook, and scattered PG sites.",
    icon: <SearchX className="w-8 h-8 text-orange-500" />
  },
  {
    title: "Commute Guesswork",
    description: "Is the office actually 10 minutes away, or is that only at 3 AM? The real commute is always a gamble.",
    icon: <Clock className="w-8 h-8 text-amber-500" />
  },
  {
    title: "Fake Photos & Scams",
    description: "You never know if the listing photos are real, or if you're talking to a verified owner vs an unreliable broker.",
    icon: <ShieldAlert className="w-8 h-8 text-red-400" />
  },
  {
    title: "Hidden Surprises",
    description: "Does the PG actually have reliable Wi-Fi? Is the food good? Is the neighborhood safe at night? You answer these blindly.",
    icon: <WifiOff className="w-8 h-8 text-yellow-500" />
  }
];

export default function HomieProblemSection() {
  return (
    <section className="py-32 relative" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Relocation is <span style={{ color: 'var(--color-accent)' }}>Broken.</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Today, moving means dealing with a fragmented ecosystem that is heavily biased toward the landlord. You are forced to answer complex questions blindly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-3xl glass border border-[var(--color-border)] hover:bg-white/5 transition-all duration-300"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
