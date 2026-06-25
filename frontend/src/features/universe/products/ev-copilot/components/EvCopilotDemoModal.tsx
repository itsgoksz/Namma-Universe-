import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface EvCopilotDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EvCopilotDemoModal({ isOpen, onClose }: EvCopilotDemoModalProps) {
  const [step, setStep] = useState<'details' | 'calendar' | 'success'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate next 5 weekdays for the calendar
  const availableDates = useState(() => {
    const days = [];
    let current = new Date();
    while (days.length < 5) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        days.push({
          full: current.toISOString(),
          day: current.toLocaleDateString('en-US', { weekday: 'short' }),
          date: current.getDate().toString()
        });
      }
    }
    return days;
  })[0];

  const times = ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'];

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('details');
      setFormData({ name: '', email: '', phone: '' });
      setSelectedDate(null);
      setSelectedTime(null);
    }, 300);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "fd261ad2-ead6-4ebd-a330-5538a35906d5",
          subject: "New Demo Booking: EV Copilot",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_selected: selectedDate,
          time_selected: selectedTime,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStep('success');
      } else {
        console.error(result);
        alert("Failed to send demo request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl glass border border-[var(--color-border)] overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            </button>

            <AnimatePresence mode="wait">
              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h3 className="text-2xl font-bold mb-2">Book a Demo</h3>
                  <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    See how Car Co-Pilot makes EV road trips effortless. Let's start with your details.
                  </p>

                  <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep('calendar');
                    }}
                  >
                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Name</label>
                      <input
                        type="text"
                        required
                        pattern="[A-Za-z\s\-]{2,}"
                        title="Please enter a valid name (minimum 2 characters)"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Phone Number</label>
                      <input
                        type="tel"
                        required
                        pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
                        title="Please enter a valid phone number (e.g. +1 555-000-0000)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!formData.name || !formData.email || !formData.phone}
                      className="w-full py-3 mt-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    >
                      Next: Choose a Time
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h3 className="text-2xl font-bold mb-2">Select a Time</h3>
                  <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    When works best for you, {formData.name.split(' ')[0]}?
                  </p>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                        <CalendarIcon size={16} />
                        <span className="text-sm font-medium">Select Date</span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {availableDates.map((d) => (
                          <button
                            key={d.full}
                            onClick={() => setSelectedDate(d.full)}
                            className={`flex flex-col items-center justify-center min-w-[4rem] py-3 rounded-xl border transition-all ${selectedDate === d.full ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)] hover:border-white/20'}`}
                            style={{
                              backgroundColor: selectedDate === d.full ? 'var(--color-accent-subtle)' : 'var(--color-bg-secondary)',
                            }}
                          >
                            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{d.day}</span>
                            <span className="text-lg font-bold" style={{ color: selectedDate === d.full ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{d.date}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedDate && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <div className="flex items-center gap-2 mb-3 mt-4" style={{ color: 'var(--color-text-secondary)' }}>
                            <Clock size={16} />
                            <span className="text-sm font-medium">Select Time</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {times.map((t) => (
                              <button
                                key={t}
                                onClick={() => setSelectedTime(t)}
                                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${selectedTime === t ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-[var(--color-border)] hover:border-white/20'}`}
                                style={{
                                  backgroundColor: selectedTime === t ? 'var(--color-accent-subtle)' : 'var(--color-bg-secondary)',
                                  color: selectedTime === t ? 'var(--color-accent)' : 'var(--color-text-primary)'
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-4 flex gap-3">
                      <button
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:bg-white/5 border border-[var(--color-border)]"
                        onClick={() => setStep('details')}
                      >
                        Back
                      </button>
                      <button
                        disabled={!selectedDate || !selectedTime || isSubmitting}
                        className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                        onClick={handleSubmit}
                      >
                        {isSubmitting ? (
                          <><Loader2 size={18} className="animate-spin" /> Confirming...</>
                        ) : (
                          'Confirm Booking'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-success-light)' }}>
                    <CheckCircle className="w-8 h-8" style={{ color: 'var(--color-success)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                  <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                    Thanks, {formData.name.split(' ')[0]}. We've sent a calendar invite to {formData.email}. We look forward to showing you Car Co-Pilot!
                  </p>
                  <button
                    className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] border border-[var(--color-border)]"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
