import os

filepath = "/Users/gokulgautham/Aiva/frontend/src/features/dashboard/DashboardPage.tsx"

with open(filepath, "r") as f:
    content = f.read()

start_index = content.find("  return (")
if start_index == -1:
    print("Return block not found")
    exit(1)

new_jsx = """  return (
    <div className="flex flex-col gap-6 pb-12 animate-fade-in-up">

      {/* ─── ROW 1: WELCOME, SATISFACTION, AIVA OVERVIEW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Welcome Card (Spans 2) */}
        <div className="lg:col-span-2 rounded-[20px] shadow-2xl border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-8 min-h-[260px] bg-white/[0.03] backdrop-blur-2xl">
          {/* Fluid/Jellyfish abstract background effect */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[140%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E0BFB8]/20 via-[#C07C88]/5 to-transparent blur-[60px] rotate-12 transform-gpu" />
            <div className="absolute top-[40%] right-[10%] w-[40%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B76E79]/10 via-transparent to-transparent blur-[40px] rounded-full mix-blend-screen" />
          </div>
          
          <div className="relative z-10 w-full flex flex-col h-full justify-between">
            <div>
              <p className="text-white/50 text-[14px] font-medium mb-1">Welcome back,</p>
              <h2 className="text-[32px] font-black text-white tracking-tight leading-tight mb-2">
                {user?.full_name || 'Owner'}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[11px] font-bold tracking-wider uppercase">System Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
               <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5 flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Appointments</span>
                  <span className="text-[24px] font-bold text-white leading-none mt-1.5">{stats?.todays_appointments ?? 0}</span>
               </div>
               <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5 flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Calls Handled</span>
                  <span className="text-[24px] font-bold text-white leading-none mt-1.5">{stats?.calls_today ?? 0}</span>
               </div>
               <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5 flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">AI Bookings</span>
                  <span className="text-[24px] font-bold text-white leading-none mt-1.5">{stats?.ai_bookings ?? 0}</span>
               </div>
               <div className="bg-[#E0BFB8] border border-[#E0BFB8]/20 rounded-xl p-3.5 flex flex-col shadow-[0_0_15px_rgba(224,191,184,0.15)]">
                  <span className="text-[#120B0F]/50 uppercase tracking-widest font-bold text-[10px]">Occupancy</span>
                  <span className="text-[24px] font-bold text-[#120B0F] leading-none mt-1.5">
                    {Math.round(((stats?.todays_appointments ?? 1) / Math.max(1, (stats?.todays_appointments ?? 1) + 4)) * 100)}%
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Satisfaction Card (Spans 1) */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] flex flex-col relative overflow-hidden min-h-[260px] p-6 lg:col-span-1">
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Satisfaction</h3>
            <button className="w-6 h-6 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
              <MoreHorizontal size={12} />
            </button>
          </div>
          <p className="text-[11px] font-medium text-white/40 mt-1">From all bookings</p>
          
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 mt-4">
            <div className="relative w-full flex flex-col items-center">
              <svg viewBox="0 0 100 55" className="w-[150px] drop-shadow-lg overflow-visible">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1A1115" strokeWidth="8" strokeLinecap="round" />
                <path d="M 10 50 A 40 40 0 0 1 70 15" fill="none" stroke="#E0BFB8" strokeWidth="8" strokeLinecap="round" strokeDasharray="120" strokeDashoffset="0" />
              </svg>
              <div className="absolute bottom-1 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#E0BFB8] flex items-center justify-center shadow-[0_0_15px_rgba(224,191,184,0.4)] mb-1 text-[#120B0F]">
                  <Sparkles size={14} />
                </div>
                <div className="text-[28px] font-black text-white leading-none tracking-tight">{stats?.ai_performance ?? 99.9}%</div>
                <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">Based on feedback</div>
              </div>
              <div className="absolute bottom-0 left-2 text-[10px] font-bold text-white/30">0%</div>
              <div className="absolute bottom-0 right-2 text-[10px] font-bold text-white/30">100%</div>
            </div>
          </div>
        </div>

        {/* Aiva Overview Card (Spans 1) */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] flex flex-col relative overflow-hidden min-h-[260px] p-6 lg:col-span-1">
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Aiva Overview</h3>
            <button className="w-6 h-6 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
              <MoreHorizontal size={12} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-start relative z-10 gap-3">
            <div className="bg-white/[0.02] rounded-[14px] p-4 w-full border border-white/[0.04] shadow-inner flex flex-col justify-center">
              <div className="text-[11px] text-white/40 font-medium mb-1">Bookings Handled</div>
              <div className="text-[22px] text-white font-bold leading-none">{stats?.ai_bookings ?? 156} <span className="text-[12px] font-normal text-white/30 ml-1">clients</span></div>
            </div>
            
            <div className="bg-white/[0.02] rounded-[14px] p-4 w-full border border-white/[0.04] shadow-inner flex flex-col justify-center flex-1">
              <div className="text-[11px] text-[#E0BFB8] font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={10} /> Aiva Insights
              </div>
              <ul className="text-[12px] text-white/70 space-y-2">
                <li className="flex items-start gap-2">
                   <span className="text-[#E0BFB8] mt-0.5">•</span>
                   <span>Priya has 3 open slots today</span>
                </li>
                <li className="flex items-start gap-2">
                   <span className="text-[#E0BFB8] mt-0.5">•</span>
                   <span>{stats?.missed_calls ?? 0} missed callbacks detected</span>
                </li>
                <li className="flex items-start gap-2">
                   <span className="text-[#E0BFB8] mt-0.5">•</span>
                   <span>{stats?.repeat_customers ?? 5} repeat clients arriving</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* ─── LIVE TODAY TABLE (Moved up as requested) ─── */}
      <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-white tracking-tight">Live Today</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
              <p className="text-[12px] font-medium text-white/40">30 actions this month</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-12 pb-4 border-b border-white/[0.08] text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
            <div className="col-span-3 pl-2">Client</div>
            <div className="col-span-3">Service</div>
            <div className="col-span-3">Provider</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          <div className="space-y-1">
            {timeline.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.02] flex items-center justify-center mb-3 text-white/20">
                  <Calendar size={20} />
                </div>
                <h4 className="text-[14px] font-bold text-white/70 mb-1">No appointments yet today</h4>
                <p className="text-[13px] text-white/40">Any AI bookings or calls will appear here live.</p>
              </div>
            ) : (
              timeline.slice(0, 5).map((event) => (
                <div key={event.id} className="grid grid-cols-12 items-center py-4 hover:bg-white/[0.02] rounded-xl transition-colors px-2 cursor-pointer border border-transparent hover:border-white/[0.08]">
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-[10px] bg-[#120B0F] border border-white/10 text-white flex items-center justify-center font-bold text-[13px] shadow-md">
                      {event.title.charAt(0)}
                    </div>
                    <span className="text-[14px] font-bold text-white">{event.title}</span>
                  </div>
                  <div className="col-span-3 text-[13px] font-medium text-white/50">
                    {event.subtitle}
                  </div>
                  <div className="col-span-3 text-[13px] font-bold text-[#E0BFB8]">
                    {event.raw?.staff_member?.name || 'Aiva (AI)'}
                  </div>
                  <div className="col-span-2 text-[13px] font-medium text-white/50">
                    {event.time}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button className="text-white/30 hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── CHARTS ROW (Moved down) ─── */}
      <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] flex flex-col overflow-hidden p-6 min-h-[340px]">
        <div className="flex items-center justify-between z-10 mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-white tracking-tight">Revenue overview</h3>
            <p className="text-[12px] font-medium text-emerald-400 mt-1">(+5%) more in 2026</p>
          </div>
        </div>
        
        <div className="flex-1 relative w-full h-[200px]">
           {/* Chart SVG */}
           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E0BFB8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E0BFB8" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="90" x2="800" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="190" x2="800" y2="190" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              <path 
                d="M0,160 C100,120 150,180 250,140 C350,100 400,40 500,80 C600,120 650,60 800,30 L800,200 L0,200 Z" 
                fill="url(#chartGradient)" 
              />
              <path 
                d="M0,160 C100,120 150,180 250,140 C350,100 400,40 500,80 C600,120 650,60 800,30" 
                fill="none" 
                stroke="#E0BFB8" 
                strokeWidth="3" 
                strokeLinecap="round" 
                filter="url(#glow)"
              />
           </svg>
        </div>
      </div>

    </div>
  );
}
"""

with open(filepath, "w") as f:
    f.write(content[:start_index] + new_jsx)

print("Updated dashboard layout successfully!")
