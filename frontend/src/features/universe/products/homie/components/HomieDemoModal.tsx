import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HomieDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HomieDemoModal({ isOpen, onClose }: HomieDemoModalProps) {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', moveDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close handler that resets state
  const handleClose = () => {
    onClose();
    // Reset state after animation completes
    setTimeout(() => {
      setStep('details');
      setFormData({ name: '', email: '', phone: '', moveDate: '' });
    }, 300);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // We can use web3forms or similar later, simulating delay for now.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep('success');
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl glass border border-[var(--color-border)]"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        <div className="p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Start Your Move</h3>
                <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                  Let Homie take the stress out of your relocation. Enter your details to get early access.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Expected Move Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="month" 
                        value={formData.moveDate}
                        onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.email || !formData.phone || isSubmitting}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-[#120B0F]"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-[#120B0F] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Get Early Access
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-accent-subtle)' }}>
                  <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">You're on the list!</h3>
                <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                  Thanks, {formData.name.split(' ')[0]}. We will contact you soon at {formData.email} to help you plan your move.
                </p>
                <button 
                  onClick={handleClose}
                  className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] text-[#120B0F]"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
