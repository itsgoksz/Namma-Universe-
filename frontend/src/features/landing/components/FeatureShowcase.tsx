import { motion } from 'framer-motion';
import { Heart, PhoneCall, CalendarCheck, Smile, Users, Moon } from 'lucide-react';

export default function FeatureShowcase() {
  const reasons = [
    { icon: <Heart className="w-6 h-6 text-pink-500" />, text: "Because every customer deserves an answer." },
    { icon: <PhoneCall className="w-6 h-6 text-blue-400" />, text: "Every call is answered." },
    { icon: <CalendarCheck className="w-6 h-6 text-purple-400" />, text: "Every booking opportunity is captured." },
    { icon: <Smile className="w-6 h-6 text-yellow-400" />, text: "Customers never feel ignored." },
    { icon: <Users className="w-6 h-6 text-green-400" />, text: "Your staff stays focused on the people already in your business." },
    { icon: <Moon className="w-6 h-6 text-indigo-400" />, text: "Your business remains available even after closing hours." },
  ];

  return (
    <section className="py-32 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-10">
                Why businesses <br />
                <span className="text-gradient">choose Aiva</span>
              </h2>
              
              <div className="space-y-6">
                {reasons.map((reason, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
                      {reason.icon}
                    </div>
                    <div>
                      <p className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>{reason.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="relative rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-2xl glass"
              style={{ background: 'var(--color-bg-tertiary)' }}
            >
              {/* Abstract Dashboard Visual */}
              <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="h-6 w-1/3 rounded bg-white/5"></div>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 p-6 rounded-xl border border-[var(--color-border)]" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="h-4 w-1/4 rounded bg-white/10 mb-4"></div>
                  <div className="text-3xl font-bold mb-2">₹18,084</div>
                  <div className="h-2 w-1/3 rounded bg-white/5"></div>
                </div>
                <div className="p-6 rounded-xl border border-[var(--color-border)]" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="h-4 w-1/2 rounded bg-white/10 mb-4"></div>
                  <div className="text-2xl font-bold mb-2">94.7%</div>
                  <div className="h-2 w-2/3 rounded bg-white/5"></div>
                </div>
                <div className="p-6 rounded-xl border border-[var(--color-border)]" style={{ background: 'var(--color-bg-secondary)' }}>
                  <div className="h-4 w-1/2 rounded bg-white/10 mb-4"></div>
                  <div className="text-2xl font-bold mb-2">78.0%</div>
                  <div className="h-2 w-2/3 rounded bg-white/5"></div>
                </div>
                <div className="col-span-2 mt-4 space-y-3">
                  <div className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white/5"></div>
                  <div className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white/5"></div>
                  <div className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white/5"></div>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
