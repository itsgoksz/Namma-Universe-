/**
 * Aiva — Header
 * Matte Black OS aesthetic.
 * Fixed: search icon overlap, baseline alignment.
 */

import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthProvider';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-[56px] shrink-0 sticky top-0 z-20 flex items-center justify-between px-5 lg:px-6">
      {/* Left — Mobile menu only */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-2.5 ml-auto">
        
        {/* Search — fixed padding so icon and text don't overlap */}
        <div className="relative hidden md:flex items-center h-9">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            className="w-[200px] h-full pl-10 pr-3 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] font-medium focus:outline-none focus:ring-1 focus:ring-[#A66B8E]/30 transition-all placeholder:text-white/25 text-white"
          />
        </div>

        {/* Mail */}
        <button className="w-9 h-9 bg-white/[0.04] border border-white/[0.06] rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors" title="Messages">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </button>

        {/* Bell */}
        <button className="relative w-9 h-9 bg-white/[0.04] border border-white/[0.06] rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors" title="Notifications">
          <Bell size={14} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#A66B8E] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] p-0.5 cursor-pointer hover:border-white/20 transition-colors">
          <div className="w-full h-full rounded-md bg-[#1C1117] text-white flex items-center justify-center font-bold text-[11px]">
            {user?.full_name?.charAt(0).toUpperCase() || 'O'}
          </div>
        </div>
      </div>
    </header>
  );
}
