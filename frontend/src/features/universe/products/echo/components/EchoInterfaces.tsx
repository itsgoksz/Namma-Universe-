import { motion } from 'framer-motion';
import { Monitor, Smartphone, Volume2, MessageSquare } from 'lucide-react';

export default function EchoInterfaces() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Decoupled, Immersive <br />
            <span style={{ color: 'var(--color-text-tertiary)' }}>User Interfaces.</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Echo is presented through cutting-edge, glassmorphic modern UIs designed for immersive interaction across devices.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Web HUD Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-[var(--color-border)] shadow-xl glass" style={{ background: 'var(--color-bg-tertiary)' }}>
                  <Smartphone className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">React / Vite Web HUD</h3>
                  <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    A glassmorphic UI connecting to the FastAPI backend over a proxied WebSocket for a unified voice and text session.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-[var(--color-border)] shadow-xl glass" style={{ background: 'var(--color-bg-tertiary)' }}>
                  <Volume2 className="w-6 h-6" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Gemini Live Unified Brain</h3>
                  <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    Powered exclusively by the Gemini Live API functioning as the sole intelligent model for all chat and voice queries. Experience native-voice welcomes and real-time transcripts.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Desktop HUD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="glass rounded-3xl border border-[var(--color-border)] p-8 relative overflow-hidden shadow-2xl" style={{ background: 'var(--color-bg-tertiary)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10" style={{ background: 'var(--color-accent)', opacity: 0.1 }} />
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--color-border)]">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-[var(--color-border)]" style={{ background: 'var(--color-bg-primary)' }}>
                  <Monitor className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Desktop HUD (Jarvis UI)</h3>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Persistent monitoring & local infrastructure.</p>
                </div>
              </div>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full shadow-[0_0_8px_var(--color-accent)]" style={{ background: 'var(--color-accent)' }} />
                  <div>
                    <h4 className="font-semibold mb-1">Continuous Polling</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Real-time alert and reminder displays right on your desktop.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full shadow-[0_0_8px_var(--color-accent)]" style={{ background: 'var(--color-accent)' }} />
                  <div>
                    <h4 className="font-semibold mb-1">Local TTS / STT</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Utilizing SpeechRecognition and pyttsx3 for edge-native voice interactions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full shadow-[0_0_8px_var(--color-accent)]" style={{ background: 'var(--color-accent)' }} />
                  <div>
                    <h4 className="font-semibold mb-1">Tuned Pause Thresholds</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>2.5 second buffers allow users to speak naturally without cutoff.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
