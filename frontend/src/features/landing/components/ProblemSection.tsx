import { motion } from 'framer-motion';
import { XCircle, ArrowDown, TrendingDown } from 'lucide-react';

const problems = [
  {
    title: "Missed Calls",
    description: "You're busy serving clients. The phone rings and goes to voicemail.",
    icon: <XCircle className="w-8 h-8 text-red-500" />
  },
  {
    title: "Missed Enquiries",
    description: "Customers message on WhatsApp. They don't get an immediate reply.",
    icon: <XCircle className="w-8 h-8 text-orange-500" />
  },
  {
    title: "Missed Bookings",
    description: "Impatient prospects move on to your competitors who answer faster.",
    icon: <XCircle className="w-8 h-8 text-yellow-500" />
  },
  {
    title: "Lost Revenue",
    description: "Every missed interaction is a missed opportunity to grow your business.",
    icon: <TrendingDown className="w-8 h-8 text-red-600" />
  }
];

export default function ProblemSection() {
  return (
    <section className="py-32 relative" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The hidden cost of <br />
            <span style={{ color: 'var(--color-text-tertiary)' }}>being busy.</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            When you're running a business, you can't be everywhere at once. But your customers expect instant responses.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-0" style={{ background: 'var(--color-border)' }}></div>
          
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4 px-4"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 glass border border-[var(--color-border)] shadow-xl" style={{ background: 'var(--color-bg-tertiary)' }}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.description}</p>
              
              {/* Arrow for mobile */}
              {index < problems.length - 1 && (
                <ArrowDown className="w-6 h-6 my-6 md:hidden text-[var(--color-border)]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
