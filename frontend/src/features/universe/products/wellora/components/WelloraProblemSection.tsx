import { motion } from 'framer-motion';
import { PenTool, HeartOff, LayoutDashboard, SearchX } from 'lucide-react';

const problems = [
  {
    icon: <PenTool className="w-8 h-8" />,
    title: "Friction of Manual Tracking",
    description: "Most apps demand tedious manual input—forcing you to search for specific foods, guess portion sizes, and repeat this exhausting process every single day."
  },
  {
    icon: <HeartOff className="w-8 h-8" />,
    title: "No Empathy or Support",
    description: "Apps don't care how you feel. Logging comfort food after a stressful day triggers red warnings and judgment, making you feel worse."
  },
  {
    icon: <LayoutDashboard className="w-8 h-8" />,
    title: "Scattered Health Data",
    description: "Juggling separate apps to track nutrition, water, sleep, and mood makes it impossible to see the big picture of your health."
  },
  {
    icon: <SearchX className="w-8 h-8" />,
    title: "Generic, Uninformed Advice",
    description: "When seeking help for physical ailments like bloating or cramps, most apps just provide generic web search results instead of personalized insights."
  }
];

export default function WelloraProblemSection() {
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
            Wellness Tracking is <span style={{ color: 'var(--color-accent)' }}>Broken</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Traditional diet and wellness tracking apps feel clinical and tedious. They often induce guilt, which makes you want to stop using them altogether.
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
              className="p-8 rounded-3xl glass border border-[var(--color-border)] hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              {/* Subtle Teal gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4FF]/0 to-[#2DD4FF]/0 group-hover:from-[#2DD4FF]/5 group-hover:to-transparent transition-colors duration-500 pointer-events-none" />
              
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                style={{ backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
              >
                {problem.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">{problem.title}</h3>
              <p className="text-lg leading-relaxed relative z-10" style={{ color: 'var(--color-text-secondary)' }}>
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
