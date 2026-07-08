import { motion } from 'framer-motion';
import { AlertTriangle, EyeOff, Users, MapPinOff } from 'lucide-react';

const problems = [
  {
    title: "No Central Platform",
    description: "Citizens lack a unified, accessible place to report neighborhood problems to the relevant authorities.",
    icon: <MapPinOff className="w-8 h-8 text-teal-400" />
  },
  {
    title: "Lack of Transparency",
    description: "Reports often go into a black box. There is no public way to track if a problem is being addressed.",
    icon: <EyeOff className="w-8 h-8 text-cyan-400" />
  },
  {
    title: "Scattered Voices",
    description: "Individual complaints lack impact. Without community support, local issues easily get deprioritized.",
    icon: <Users className="w-8 h-8 text-blue-400" />
  },
  {
    title: "Unresolved Hazards",
    description: "Critical infrastructure failures like broken streetlights, potholes, or illegal dumping remain unresolved and dangerous.",
    icon: <AlertTriangle className="w-8 h-8 text-emerald-400" />
  }
];

export default function NammaVoiceProblemSection() {
  return (
    <section className="py-32 relative" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Local Issues Go <span style={{ color: 'var(--color-accent)' }}>Unnoticed.</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Often, community issues go unresolved simply because there isn't an accessible, transparent, and centralized way for citizens to report them.
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
