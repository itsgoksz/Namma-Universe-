/**
 * Aiva — Register Page
 * Matte Black iPadOS aesthetic — matches dashboard design system.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Sparkles, CheckCircle2, Phone, Calendar, Zap } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    business_name: '',
    phone_number: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] font-medium text-white placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#A66B8E]/40 focus:ring-1 focus:ring-[#A66B8E]/20 focus:bg-white/[0.06]';

  return (
    <div className="min-h-screen flex bg-[#0A0508] relative overflow-hidden">

      {/* ─── Ambient Background Orbs ─── */}
      <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#A66B8E]/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#A66B8E]/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] left-[45%] w-[250px] h-[250px] rounded-full bg-white/[0.01] blur-[80px] pointer-events-none" />

      {/* ─── Left Branding Panel ─── */}
      <div className="hidden lg:flex lg:w-[48%] flex-col justify-center px-20 relative z-10">
        <div className="max-w-lg animate-fade-in-up">
          {/* Brand */}
          <div className="mb-12">
            <h1 className="text-[18px] font-black tracking-[0.2em] text-white uppercase leading-none">
              Snip & Streak
            </h1>
            <p className="text-[11px] font-medium text-white/25 mt-2 tracking-widest uppercase">
              Powered by Aiva
            </p>
          </div>

          {/* Hero headline */}
          <h2 className="text-[40px] font-extrabold text-white leading-[1.15] tracking-tight mb-6">
            Set up your
            <br />
            <span className="text-[#A66B8E]">AI receptionist</span>
            <br />
            in 2 minutes
          </h2>
          <p className="text-[16px] text-white/40 leading-relaxed mb-12 max-w-md font-medium">
            No credit card required. Start answering calls and booking appointments instantly.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-4">
            {[
              { icon: Phone, text: 'Never miss a call again' },
              { icon: Calendar, text: 'AI books appointments 24/7' },
              { icon: Zap, text: 'Automated reminders' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] w-max"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-7 h-7 rounded-lg bg-[#A66B8E]/10 flex items-center justify-center text-[#A66B8E]">
                  <item.icon size={14} />
                </div>
                <span className="text-[13px] font-semibold text-white/60">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Registration Form ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[460px] animate-fade-in">

          {/* Form Card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[1.5rem] border border-white/[0.06] p-8 md:p-10 shadow-2xl relative overflow-hidden">

            {/* Card glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#A66B8E]/[0.06] rounded-full blur-[60px] pointer-events-none" />

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <h1 className="text-[14px] font-black tracking-[0.2em] text-white uppercase">
                Snip & Streak
              </h1>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-7">
              <h2 className="text-[22px] font-bold text-white tracking-tight mb-1.5">
                Create your account
              </h2>
              <p className="text-[13px] font-medium text-white/35">
                Get started with your AI receptionist
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[13px] font-semibold text-red-400 relative z-10">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">

              {/* Name + Email row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    placeholder="John Doe"
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className={inputClasses}
                />
              </div>

              {/* Separator: Business Details */}
              <div className="pt-1">
                <div className="h-px bg-white/[0.06] mb-4" />
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30">
                    <Building2 size={12} />
                  </div>
                  <span className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Business Details</span>
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={form.business_name}
                  onChange={(e) => updateField('business_name', e.target.value)}
                  placeholder="e.g. Glow Beauty Salon"
                  required
                  className={inputClasses}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">
                  Business Phone
                </label>
                <input
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => updateField('phone_number', e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className={inputClasses}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-[#A66B8E] text-[#0A0508] text-[14px] font-bold transition-all duration-200 hover:bg-[#B882A2] hover:shadow-lg hover:shadow-[#A66B8E]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0A0508]/30 border-t-[#0A0508] rounded-full animate-spin" />
                ) : (
                  <>
                    Create account <ArrowRight size={16} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            {/* Footer link */}
            <p className="mt-7 text-center text-[13px] font-medium text-white/30 relative z-10">
              Already have an account?{' '}
              <Link to="/login" className="text-[#A66B8E] font-bold hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          {/* Bottom badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-white/15">
            <Sparkles size={12} />
            <span className="text-[11px] font-medium tracking-wider uppercase">Powered by Aiva AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
