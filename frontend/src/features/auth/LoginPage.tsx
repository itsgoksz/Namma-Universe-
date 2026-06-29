/**
 * Aiva — Login Page
 * Matte Black iPadOS aesthetic — matches dashboard design system.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Sparkles, Phone, Calendar, Zap } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A0508] relative overflow-hidden">

      {/* ─── Ambient Background Orbs ─── */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#A66B8E]/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#A66B8E]/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] rounded-full bg-white/[0.01] blur-[80px] pointer-events-none" />

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
            Your Front Desk Assistant
            <br />
            <span className="text-[#A66B8E]">that never sleeps</span>
          </h2>
          <p className="text-[16px] text-white/40 leading-relaxed mb-12 max-w-md font-medium">
            Automatically answer calls, book appointments, and delight your customers — 24/7.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-4">
            {[
              { icon: Phone, text: 'AI answers every call instantly' },
              { icon: Calendar, text: 'Books appointments automatically' },
              { icon: Zap, text: 'Smart reminders & follow-ups' },
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

      {/* ─── Right Login Form ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[420px] animate-fade-in">

          {/* Form Card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[1.5rem] border border-white/[0.06] p-8 md:p-10 shadow-2xl relative overflow-hidden">

            {/* Card glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#A66B8E]/[0.06] rounded-full blur-[60px] pointer-events-none" />

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <h1 className="text-[14px] font-black tracking-[0.2em] text-white uppercase">
                Snip & Streak
              </h1>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-8">
              <h2 className="text-[22px] font-bold text-white tracking-tight mb-1.5">
                Welcome back
              </h2>
              <p className="text-[13px] font-medium text-white/35">
                Sign in to your dashboard
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[13px] font-semibold text-red-400 relative z-10">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] font-medium text-white placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#A66B8E]/40 focus:ring-1 focus:ring-[#A66B8E]/20 focus:bg-white/[0.06]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] font-medium text-white placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#A66B8E]/40 focus:ring-1 focus:ring-[#A66B8E]/20 focus:bg-white/[0.06]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-[#A66B8E] text-[#0A0508] text-[14px] font-bold transition-all duration-200 hover:bg-[#B882A2] hover:shadow-lg hover:shadow-[#A66B8E]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0A0508]/30 border-t-[#0A0508] rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in <ArrowRight size={16} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            {/* Footer link */}
            <p className="mt-8 text-center text-[13px] font-medium text-white/30 relative z-10">
              Don't have an account?{' '}
              <a href="/#demo" className="text-[#A66B8E] font-bold hover:underline underline-offset-2">
                Book demo and get started
              </a>
            </p>
          </div>

          {/* Bottom sparkle badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-white/15">
            <Sparkles size={12} />
            <span className="text-[11px] font-medium tracking-wider uppercase">Powered by Aiva AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
