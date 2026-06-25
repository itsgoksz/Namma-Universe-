import { Shield, ShieldAlert, History } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EchoSecuritySection() {
  return (
    <section className="py-32 relative" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Autonomous, yet <br />
            <span style={{ color: 'var(--color-text-tertiary)' }}>Human-in-the-Loop.</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Echo is designed to be highly intelligent but extremely safe. It respects boundaries and ensures data integrity even during outages.
          </p>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl border border-[var(--color-border)] glass flex flex-col md:flex-row gap-8 items-start"
            style={{ background: 'var(--color-bg-tertiary)' }}
          >
            <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center border border-[var(--color-border)]" style={{ background: 'var(--color-bg-primary)' }}>
              <ShieldAlert className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Strict Action Verification</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Despite having autonomous capabilities, Echo adheres strictly to a Human-in-the-loop protocol for destructive or resource-intensive tasks. While the agent can recommend irrigation or suggest deleting a crop, it will always ask for final, explicit user confirmation before executing physical actuations or database updates.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-3xl border border-[var(--color-border)] glass flex flex-col md:flex-row gap-8 items-start"
            style={{ background: 'var(--color-bg-tertiary)' }}
          >
            <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center border border-[var(--color-border)]" style={{ background: 'var(--color-bg-primary)' }}>
              <History className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Downtime Catch-up & Recovery</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Resilient to system or server outages. Every minute, the background scheduler updates a heartbeat. Upon recovery from an outage, Echo detects the gap, generates a System Catch-up alert, autonomously fetches missed historical weather data, and adjusts any pending irrigation recommendations to prevent overwatering.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-8 rounded-3xl border border-[var(--color-border)] glass flex flex-col md:flex-row gap-8 items-start"
            style={{ background: 'var(--color-bg-tertiary)' }}
          >
            <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center border border-[var(--color-border)]" style={{ background: 'var(--color-bg-primary)' }}>
              <Shield className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Natural Persona Enforcement</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                To ensure a premium UX, the system is strictly forbidden from using technical jargon like "databases", "JSON", or "API endpoints". It reports results as a professional human assistant would.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
