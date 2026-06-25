import { motion } from 'framer-motion';
import { CloudRain, Droplets, Leaf } from 'lucide-react';

export default function EchoHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ background: 'var(--color-accent-light)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px]" style={{ background: 'var(--color-accent-subtle)' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass border border-[var(--color-border)]" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <Leaf className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Echo: Farm AI Agent</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                The Operational <br />
                <span style={{ color: 'var(--color-accent)' }}>Brain for your Farm.</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto lg:mx-0 font-light" style={{ color: 'var(--color-text-secondary)' }}>
                Echo is a comprehensive, autonomous AI assistant that tracks fields, monitors weather, schedules irrigation, and synthesizes daily reports—so you can focus on growing.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-[#120B0F]"
                  style={{ backgroundColor: 'var(--color-accent)', boxShadow: 'var(--shadow-premium)' }}
                >
                  Enter World
                </button>
              </div>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative w-full max-w-lg mx-auto"
            >
              {/* Abstract Dashboard Mockup */}
              <div className="glass rounded-2xl border border-[var(--color-border)] p-6 overflow-hidden relative shadow-2xl" style={{ background: 'var(--color-bg-tertiary)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)]" style={{ background: 'var(--color-bg-secondary)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <CloudRain className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Rain Detected</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Irrigation schedule skipped autonomously.</p>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Just now</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)]" style={{ background: 'var(--color-bg-secondary)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Irrigation Started</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Sugarcane Field A • 45m duration</p>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>2h ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)]" style={{ background: 'var(--color-bg-secondary)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <Leaf className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Daily Report Sent</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>SMS delivered via Twilio.</p>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>17:00 PM</span>
                  </div>
                </div>

                {/* Decorative glowing orb behind mockup */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[80px] -z-10" style={{ background: 'var(--color-accent)', opacity: 0.15 }} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
