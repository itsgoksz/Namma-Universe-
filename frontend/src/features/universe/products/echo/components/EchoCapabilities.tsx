import { motion } from 'framer-motion';
import { Mic, Activity, Clock, CheckCircle2 } from 'lucide-react';

const capabilities = [
  {
    title: "Reactive Activities (User-Driven)",
    description: "Directly query Echo via voice or text. The agent interprets the intent, updates the database, and responds immediately.",
    icon: <Mic className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />,
    features: [
      "Crop Management & Status Checks",
      "Irrigation History Audits",
      "Fertilizer Inventory Control",
      "Manual Sprinkler Overrides",
      "Real-time Weather Inquiries"
    ]
  },
  {
    title: "Proactive Activities (System-Driven)",
    description: "Echo operates a 24/7 background scheduler that actively monitors the farm without waiting for your prompts.",
    icon: <Activity className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />,
    features: [
      "Continuous Weather Polling",
      "Automated Irrigation Adjustments",
      "Downtime Catch-up & Backfilling",
      "Proactive UI Alert Generation",
      "Daily SMS & Spoken Briefings"
    ]
  }
];

export default function EchoCapabilities() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none opacity-20" style={{ background: 'var(--color-accent)' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full mb-6 border border-[var(--color-border)]" style={{ background: 'var(--color-bg-tertiary)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Multi-Agent System</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            A synergistic <br />
            <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #2DD4FF, #6D5EF7)' }}>Dual-Brain Architecture.</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Echo isn't just a chatbot. It seamlessly blends reactive command execution with autonomous system interruptions when critical conditions arise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="p-10 rounded-3xl border border-[var(--color-border)] relative overflow-hidden group"
              style={{ background: 'var(--color-bg-tertiary)' }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent-light)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-[var(--color-border)]" style={{ background: 'var(--color-bg-primary)' }}>
                {cap.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{cap.title}</h3>
              <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                {cap.description}
              </p>
              
              <ul className="space-y-4">
                {cap.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                    <span style={{ color: 'var(--color-text-primary)' }}>{feature}</span>
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
