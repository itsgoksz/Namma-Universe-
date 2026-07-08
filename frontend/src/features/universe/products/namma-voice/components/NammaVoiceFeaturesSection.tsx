import { motion } from 'framer-motion';
import { Camera, Radio, ThumbsUp, CheckCircle2 } from 'lucide-react';

export default function NammaVoiceFeaturesSection() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full mb-6 border border-[var(--color-border)]" style={{ background: 'var(--color-bg-tertiary)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Core Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Crowd-Sourcing <br />
            <span style={{ color: 'var(--color-accent)' }}>Civic Monitoring.</span>
          </h2>
        </div>

        <div className="space-y-16">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center glass border border-[var(--color-border)]" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <Camera className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-3">Frictionless Reporting (/report)</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Users can quickly submit an issue by providing a photo, title, precise location, and a short description. It takes seconds to document a problem you encounter while walking or driving.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse gap-8 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center glass border border-[var(--color-border)]" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <Radio className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="md:w-2/3 md:text-right">
              <h3 className="text-2xl font-bold mb-3">Community Wall & Proximity Tracking (/wall, /issues)</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Scroll through a feed of problems reported by neighbors. Proximity tracking allows you to stay informed about what's happening right in your immediate vicinity, ensuring local issues stay relevant to you.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center glass border border-[var(--color-border)]" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <ThumbsUp className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-3">Support & Discussion</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Instead of duplicate reports, users can "Support" (upvote) existing issues to increase their urgency. They can also leave comments to provide updates, discuss workarounds, or share critical information.
              </p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse gap-8 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center glass border border-[var(--color-border)]" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="md:w-2/3 md:text-right">
              <h3 className="text-2xl font-bold mb-3">Lifecycle Tracking (/my-reports)</h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Every issue has a clear state (Unresolved vs. Resolved), allowing the community to track progress and see tangible results when problems are fixed. A public record of community victories.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
