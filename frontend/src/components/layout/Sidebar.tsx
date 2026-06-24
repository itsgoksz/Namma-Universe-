/**
 * Aiva — Sidebar Navigation
 * Premium Matte Black OS aesthetic.
 * Fixed: padding, "S" cutoff, item spacing.
 */

import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  BarChart3,
  Settings,
  X,
  LogOut,
  Activity,
  Phone
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthProvider';
import { analyticsAPI } from '../../lib/api';
import type { OverviewStats } from '../../types';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview' },
  { path: '/appointments', icon: Calendar, label: 'Schedule' },
  { path: '/customers', icon: Users, label: 'Clients' },
  { path: '/staff', icon: UserCog, label: 'Team' },
  { divider: true },
  { path: '/analytics', icon: BarChart3, label: 'Insights' },
  { path: '/calls', icon: Phone, label: 'AI Calls' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    analyticsAPI.overview().then(setStats).catch(() => {});
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A0508] rounded-[1.5rem] shadow-2xl overflow-hidden w-[220px] border border-white/[0.08] relative">
      {/* Brand Header */}
      <div className="px-5 pt-8 pb-6 flex flex-col relative z-10">
        <h1 className="text-[16px] font-black tracking-[0.2em] text-white uppercase leading-none pl-1.5">
          Snip & Streak
        </h1>
        <p className="text-[10px] font-medium text-white/30 mt-1.5 tracking-widest uppercase">Powered by Aiva</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-3 overflow-y-auto z-10 relative mt-4">
        {navItems.map((item, idx) => {
          if (item.divider) {
            return <div key={`div-${idx}`} className="h-px bg-white/5 my-3 mx-2" />;
          }

          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path!));

          return (
            <NavLink
              key={item.path}
              to={item.path!}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group relative cursor-pointer"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 w-[3px] h-5 bg-[#A66B8E] rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Background Highlight */}
              {isActive && (
                <div className="absolute inset-0 bg-white/[0.06] rounded-xl pointer-events-none" />
              )}

              <div className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-[#A66B8E]' : 'text-white/35 group-hover:text-white/70'}`}>
                {item.icon && <item.icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />}
              </div>
              
              <span className={`text-[13px] z-10 transition-colors duration-200 ${
                isActive ? 'text-white font-semibold' : 'text-white/50 font-medium group-hover:text-white/70'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Live AI Status Widget */}
      <div className="px-5 py-4 border-t border-white/[0.08] z-10 relative">
        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center justify-between">
          AI Status
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A66B8E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#A66B8E]"></span>
          </span>
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40">
            <Activity size={12} />
            <span className="text-[11px] font-medium">Calls Handled</span>
          </div>
          <span className="text-[11px] font-bold text-white">{stats?.calls_today ?? 0}</span>
        </div>
      </div>

      {/* User profile footer */}
      <div className="border-t border-white/[0.08] px-4 py-3 flex items-center justify-between z-10 relative bg-white/[0.02]">
        <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 text-white flex items-center justify-center font-bold text-[11px]">
            {user?.full_name?.charAt(0).toUpperCase() || 'O'}
          </div>
          <p className="text-[12px] font-semibold text-white leading-tight">{user?.full_name || 'Owner'}</p>
        </button>
        <button
          onClick={logout}
          className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={14} />
        </button>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#A66B8E]/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-45 bg-black lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-350 lg:hidden py-3 pl-3 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-6 right-3 z-50 p-2 rounded-xl bg-white/[0.03] backdrop-blur-2xl shadow-md text-white/60 hover:text-white border border-white/10"
        >
          <X size={14} />
        </button>
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative z-30 h-full w-[220px] shrink-0">
        {sidebarContent}
      </div>
    </>
  );
}
