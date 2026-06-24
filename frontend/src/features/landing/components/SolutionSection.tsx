import { motion } from 'framer-motion';
import { Bot, MessageSquare, Calendar, Users, Phone, Zap } from 'lucide-react';

const features = [
  {
    icon: <Phone className="w-6 h-6 text-blue-400" />,
    title: "AI Voice Answering",
    description: "Aiva answers calls immediately, sounding natural and professional, 24/7."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-green-400" />,
    title: "WhatsApp Assistant",
    description: "Handle text enquiries, send pricing, and answer FAQs automatically."
  },
  {
    icon: <Calendar className="w-6 h-6 text-purple-400" />,
    title: "Smart Booking",
    description: "Aiva checks your live calendar and books appointments without double-booking."
  },
  {
    icon: <Bot className="w-6 h-6 text-red-400" />,
    title: "FAQ Handling",
    description: "Train Aiva on your specific business rules, services, and policies."
  },
  {
    icon: <Users className="w-6 h-6 text-orange-400" />,
    title: "Lead Capture",
    description: "Collects names, numbers, and intent from every interaction."
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Instant Follow-ups",
    description: "Sends confirmation texts and reminders to reduce no-shows."
  }
];

export default function SolutionSection() {
  return (
    <section id="features" className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet your new <br />
            <span className="text-gradient">star employee.</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Aiva is a comprehensive AI receptionist that handles the busywork so you can focus on the actual work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl glass border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors group"
              style={{ background: 'var(--color-bg-tertiary)' }}
            >
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" style={{ background: 'var(--color-bg-secondary)' }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">{feature.title}</h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
