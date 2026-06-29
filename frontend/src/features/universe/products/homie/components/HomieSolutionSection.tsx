import { motion } from 'framer-motion';
import { UserCircle, BrainCircuit, Bot } from 'lucide-react';

export default function HomieSolutionSection() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full mb-6 border border-[var(--color-border)]" style={{ background: 'var(--color-bg-tertiary)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>A Personal Relocation Advisor</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Instead of an unfiltered list of properties, <br />
            <span style={{ color: 'var(--color-accent)' }}>Homie starts with you.</span>
          </h2>
        </div>

        <div className="space-y-16">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center glass border border-[var(--color-border)]" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <UserCircle className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-3">1. Tell Us About Your Life</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Are you moving for a new job at Manyata Tech Park, a startup in Koramangala, or an internship in HSR Layout? What's your budget? Do you prefer a shared flat, a studio, or a coliving space? We capture your exact lifestyle needs first.
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse gap-8 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center glass border border-[var(--color-border)]" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <BrainCircuit className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="md:w-2/3 md:text-right">
              <h3 className="text-2xl font-bold mb-3">2. The Intelligence Engine Goes to Work</h3>
              <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Homie analyzes millions of data points to generate your personalized Relocation Scorecard. We evaluate every neighborhood and property based on what actually matters:
              </p>
              <ul className="text-left inline-block space-y-2 mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                <li><strong className="text-white">Commute Intelligence:</strong> Exact daily travel time & cost by car, bike, or metro.</li>
                <li><strong className="text-white">Livability Scores:</strong> Real data on safety, food options, walkability, & internet.</li>
                <li><strong className="text-white">Property Quality:</strong> AI-analyzed reviews & verified amenities.</li>
              </ul>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center glass border border-[var(--color-border)]" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <Bot className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-3">3. The Relocation Copilot</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Have a specific question? Just ask Homie. <br/><br/>
                <em className="text-white">"I work at Infosys Electronic City and have a budget of ₹12,000 for a private room. Where should I live?"</em><br/><br/>
                Our Copilot instantly recommends the best areas, hand-picks top-rated PGs or flats, and gives you a complete breakdown of expected monthly expenses.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
