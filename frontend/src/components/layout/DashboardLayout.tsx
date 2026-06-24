import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-vibrant-plum text-[#FFFFFF] font-sans selection:bg-[#A66B8E]/40 selection:text-white p-2 overflow-hidden flex gap-2">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col rounded-[2rem] bg-[#0C0E12] shadow-2xl border border-white/[0.04] overflow-hidden relative">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 lg:px-6 pt-5 pb-8 w-full animate-fade-in-up overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
