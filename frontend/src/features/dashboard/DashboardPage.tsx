/**
 * Aiva — Executive Dashboard
 * Premium Matte Black OS aesthetic.
 * iPadOS / Apple Fitness inspired.
 */

import { useEffect, useState } from 'react';
import {
  Calendar,
  PhoneCall,
  MoreHorizontal,
  Wallet,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  MessageSquare,
  Star,
  ClipboardCheck,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../features/auth/AuthProvider';
import { analyticsAPI, appointmentsAPI, callsAPI } from '../../lib/api';
import type { OverviewStats, Appointment, Call } from '../../types';
import ChatWidget from './ChatWidget';

interface UnifiedEvent {
  id: string;
  time: string;
  timestamp: number;
  type: 'appointment' | 'call' | 'action';
  title: string;
  subtitle: string;
  status: 'upcoming' | 'completed' | 'handled';
  icon: React.ElementType;
  raw?: any;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<UnifiedEvent[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = () => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      
      Promise.all([
        analyticsAPI.overview(),
        appointmentsAPI.list({ date_from: todayStr, date_to: todayStr }).catch(() => ({ items: [], total: 0 })),
        callsAPI.list({ page_size: 10 }).catch(() => ({ items: [], total: 0 }))
      ])
        .then(([statsData, apptsData, callsData]) => {
          setStats(statsData);
          
          const events: UnifiedEvent[] = [];
          
          if (apptsData.items && apptsData.items.length > 0) {
            apptsData.items.forEach((apt: Appointment) => {
              const timeStr = apt.start_time || '00:00:00';
              const dateStr = apt.date || todayStr;
              const timeObj = new Date(`${dateStr}T${timeStr}`);
              events.push({
                id: `apt-${apt.id}`,
                time: format(timeObj, 'h:mm a'),
                timestamp: timeObj.getTime(),
                type: 'appointment',
                title: apt.customer?.name || 'Client Booking',
                subtitle: `${apt.service?.name || 'Service'}`,
                status: (apt.status === 'scheduled' || apt.status === 'confirmed') ? 'upcoming' : 'completed',
                icon: Calendar,
                raw: apt
              });
            });
          }
          
          if (callsData.items && callsData.items.length > 0) {
            callsData.items.forEach((call: Call) => {
              const timeObj = new Date(call.created_at || Date.now());
              let title = 'Call Handled';
              if (call.outcome === 'booked') title = 'Booking via AI';
              if (call.outcome === 'faq') title = 'FAQ Answered';
              if (call.outcome === 'transferred') title = 'Transferred to Staff';
              
              events.push({
                id: `call-${call.id}`,
                time: format(timeObj, 'h:mm a'),
                timestamp: timeObj.getTime(),
                type: 'call',
                title,
                subtitle: `Caller: ${call.customer_name || 'Unknown'}`,
                status: 'handled',
                icon: PhoneCall,
                raw: call
              });
            });
          }

          events.sort((a, b) => a.timestamp - b.timestamp);
          setTimeline(events);
        })
        .finally(() => setLoading(false));
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (id: string) => {
    setTimeline(prev => prev.map(event => event.id === id ? { ...event, status: 'completed' } : event));
    if (id.startsWith('apt-')) {
      try {
        await appointmentsAPI.updateStatus(Number(id.replace('apt-', '')), 'completed');
      } catch (err) {
        console.error('Failed to update appointment status:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pt-4">
        <div className="h-16 w-1/3 bg-white/[0.03] rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="h-[140px] bg-white/[0.03] backdrop-blur-2xl rounded-[20px] border border-white/[0.08]" />
          <div className="h-[140px] bg-white/[0.03] backdrop-blur-2xl rounded-[20px] border border-white/[0.08]" />
          <div className="h-[140px] bg-white/[0.03] backdrop-blur-2xl rounded-[20px] border border-white/[0.08]" />
          <div className="h-[140px] bg-white/[0.03] backdrop-blur-2xl rounded-[20px] border border-white/[0.08]" />
        </div>
      </div>
    );
  }

  // Find Upcoming Customer
  const upcomingAppointments = timeline.filter(e => e.type === 'appointment' && e.status === 'upcoming');
  const sortedUpcoming = [...upcomingAppointments].sort((a, b) => a.timestamp - b.timestamp);
  const earliestUpcoming = sortedUpcoming[0];

  // Derive dynamic stats from fetched timeline (strictly pending so they decrement when completed)
  const pendingAppointments = timeline.filter(e => e.type === 'appointment' && e.status !== 'completed');
  const todaysAppointmentsCount = pendingAppointments.length;
  const todaysOccupancy = Math.round((todaysAppointmentsCount / Math.max(1, todaysAppointmentsCount + 4)) * 100);
  
  // Pending AI bookings today
  const pendingAiBookingsCount = pendingAppointments.filter(e => e.raw?.source === 'ai' || e.title === 'Booking via AI' || e.title === 'Client Booking').length;
  
  // Completed Appointments today
  const completedAppointments = timeline.filter(e => e.type === 'appointment' && e.status === 'completed');
  const completedAppointmentsCount = completedAppointments.length;
  
  // Estimated Revenue dynamically derived from backend API using actual database service prices
  const pendingEstimatedRevenue = stats?.estimated_revenue ?? 0;

  // Helper to get open slots for a staff member (out of 9 total slots today)
  const getOpenSlots = (staffId: number) => {
    const bookedCount = timeline.filter(e => 
      e.type === 'appointment' && 
      e.status === 'upcoming' && 
      e.raw?.staff_id === staffId
    ).length;
    return Math.max(0, 9 - bookedCount);
  };

  const getStaffInitialsColor = (staffId: number) => {
    const open = getOpenSlots(staffId);
    if (open === 0) {
      return "from-red-500/20 to-red-500/5 border-red-500/20 text-red-400";
    }
    return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400";
  };

  const renderStaffStatus = (staffId: number) => {
    const open = getOpenSlots(staffId);
    if (open === 0) {
      return (
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Busy</span>
        </div>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wide uppercase shrink-0">
        {open} {open === 1 ? 'Slot' : 'Slots'} Open
      </span>
    );
  };
  // Find staff member with open slots to highlight in Aiva Insights
  const staffListForInsights = [
    { id: 1, name: 'Emily', pronoun: 'her' },
    { id: 2, name: 'Priya', pronoun: 'her' },
    { id: 3, name: 'Chloe', pronoun: 'her' },
    { id: 4, name: 'Arjun', pronoun: 'his' }
  ];
  const staffAvailabilityForInsights = staffListForInsights.map(s => ({ ...s, open: getOpenSlots(s.id) }));
  const sortedStaffForInsights = [...staffAvailabilityForInsights].sort((a, b) => b.open - a.open);
  const prioritizedStaffForInsights = sortedStaffForInsights[0];

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fade-in-up">

      {/* ─── HEADER ROW ─── */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="text-[#B882A2] text-[15px] font-semibold mb-1 tracking-wide">Good afternoon,</p>
          <h2 className="text-[36px] font-black text-white tracking-tight leading-none">
            {user?.full_name?.split(' ')[0] || 'Gokul'}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#A66B8E]/10 hover:bg-[#A66B8E]/20 border border-[#A66B8E]/20 rounded-full text-[#A66B8E] text-[13px] font-bold transition-colors shadow-lg"
          >
            <MessageSquare size={16} strokeWidth={2.5} />
            Chat with Aiva
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-full text-[#B882A2] text-[13px] font-bold transition-colors shadow-lg">
            <Plus size={16} strokeWidth={3} />
            New Booking
          </button>
        </div>
      </div>
      
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* ─── ROW 1: 4 METRICS CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        
        {/* Card 1: Appointments Today */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6 relative overflow-hidden flex flex-col justify-between h-[150px]">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-[14px] bg-[#A66B8E]/10 flex items-center justify-center text-[#A66B8E]">
              <Calendar size={22} />
            </div>
            <div className="text-right">
              <span className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Appointments Today</span>
              <div className="text-[32px] font-black text-white leading-none mt-2">{todaysAppointmentsCount}</div>
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-white/40 text-[12px] font-medium">
              {earliestUpcoming ? `Next at ${earliestUpcoming.time}` : 'No more today'}
            </span>
          </div>
        </div>

        {/* Card 2: Occupancy */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6 relative overflow-hidden flex flex-col justify-between h-[150px]">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-[14px] bg-[#A66B8E]/10 flex items-center justify-center text-[#A66B8E]">
              <Users size={22} />
            </div>
            <div className="text-right">
              <span className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Occupancy</span>
              <div className="text-[32px] font-black text-white leading-none mt-2">
                {todaysOccupancy}%
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-white/40 text-[12px] font-medium">Based on today's schedule</span>
          </div>
        </div>

        {/* Card 3: Est. Revenue Today */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6 relative overflow-hidden flex flex-col justify-between h-[150px]">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-[14px] bg-[#A66B8E]/10 flex items-center justify-center text-[#A66B8E]">
              <Wallet size={22} />
            </div>
            <div className="text-right">
              <span className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Est. Revenue Today</span>
              <div className="text-[32px] font-black text-white leading-none mt-2">
                ₹{pendingEstimatedRevenue}
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <span className="inline-block px-2.5 py-1 bg-[#A66B8E]/10 text-[#A66B8E] text-[10px] font-bold rounded-md">↑ 12% vs last month</span>
          </div>
        </div>

        {/* Card 4: Upcoming Customer */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6 relative overflow-hidden flex flex-col justify-between h-[150px]">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-[14px] bg-[#A66B8E]/10 flex items-center justify-center text-[#A66B8E]">
              <Clock size={22} />
            </div>
            <div className="text-right flex flex-col items-end max-w-[65%]">
              <span className="text-white/40 font-bold text-[10px] uppercase tracking-widest text-right">Upcoming Customer</span>
              <div className="text-[22px] font-black text-white leading-tight mt-2 truncate w-full text-right" title={earliestUpcoming?.title || 'None'}>
                {earliestUpcoming ? earliestUpcoming.title : 'None'}
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-white/40 text-[12px] font-medium">
              {earliestUpcoming ? `At ${earliestUpcoming.time}` : 'No upcoming bookings'}
            </span>
          </div>
        </div>

      </div>

      {/* ─── ROW 2: AIVA OVERVIEW & LIVE TODAY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        
        {/* Aiva Overview */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#A66B8E] tracking-tight flex items-center gap-2">
              <Sparkles size={16} /> Aiva Overview
            </h3>
            <button className="w-7 h-7 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
              <MoreHorizontal size={14} />
            </button>
          </div>
          
          <div className="flex-1 flex gap-4">
            <div className="w-1/3 bg-[#110B10] rounded-[16px] p-6 flex flex-col justify-center items-center text-center border border-white/[0.02]">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">New Bookings Today</span>
              <span className="text-[42px] font-black text-white leading-none mb-2">{pendingAiBookingsCount}</span>
              <span className="text-white/30 text-[11px] font-medium">appointments scheduled</span>
            </div>
            
            <div className="w-2/3 flex flex-col justify-center">
              <div className="text-[10px] text-white/40 font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} className="text-[#A66B8E]" /> Aiva Insights
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 shrink-0 rounded-full bg-[#A66B8E]/10 flex items-center justify-center text-[#A66B8E]">
                     <Users size={14} />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[13px] text-white/90"><strong>{prioritizedStaffForInsights.name}</strong> has {prioritizedStaffForInsights.open} open {prioritizedStaffForInsights.open === 1 ? 'slot' : 'slots'} today.</span>
                     <span className="text-[12px] text-white/40">Aiva is prioritizing {prioritizedStaffForInsights.pronoun} calendar.</span>
                   </div>
                </li>
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 shrink-0 rounded-full bg-[#A66B8E]/10 flex items-center justify-center text-[#A66B8E]">
                     <PhoneCall size={14} />
                   </div>
                   <div className="flex flex-col">
                    {stats?.missed_calls && stats.missed_calls > 0 ? (
                      <>
                        <span className="text-[13px] text-white/90"><strong>{stats.missed_calls} missed callbacks</strong> detected.</span>
                        <span className="text-[12px] text-white/40">Aiva has sent SMS follow-ups.</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[13px] text-white/90"><strong>No missed callbacks</strong> detected.</span>
                        <span className="text-[12px] text-white/40">Aiva has processed all inquiries.</span>
                      </>
                    )}
                   </div>
                </li>
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 shrink-0 rounded-full bg-[#A66B8E]/10 flex items-center justify-center text-[#A66B8E]">
                     <CheckCircle2 size={14} />
                   </div>
                   <div className="flex flex-col">
                    <span className="text-[13px] text-white/90"><strong>{stats?.repeat_customers ?? 0} repeat clients</strong> arriving today.</span>
                    <span className="text-[12px] text-white/40">Aiva noted their preferences.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Today */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-white tracking-tight flex items-center gap-2">
                Live Today
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
                <p className="text-[11px] font-medium text-white/40">30 actions this month</p>
              </div>
            </div>
            <button className="w-7 h-7 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-12 pb-3 border-b border-white/[0.08] text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
              <div className="col-span-3 pl-2">Client</div>
              <div className="col-span-3">Service</div>
              <div className="col-span-3">Provider</div>
              <div className="col-span-2">Time</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="space-y-1">
              {timeline.filter(e => e.status !== 'completed').length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center mb-3 text-white/20">
                    <CheckCircle2 size={20} />
                  </div>
                  <h4 className="text-[13px] font-bold text-white/70 mb-1">All clear</h4>
                  <p className="text-[12px] text-white/40">No pending appointments today.</p>
                </div>
              ) : (
                timeline.filter(e => e.status !== 'completed').map((event) => (
                  <div key={event.id} className="grid grid-cols-12 items-center py-3 hover:bg-white/[0.02] rounded-xl transition-colors px-2 border border-transparent hover:border-white/[0.08]">
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[10px] bg-[#110B10] border border-white/10 text-white flex items-center justify-center font-bold text-[12px] shadow-sm">
                        {event.title.charAt(0)}
                      </div>
                      <span className="text-[13px] font-bold text-white truncate pr-2">{event.title}</span>
                    </div>
                    <div className="col-span-3 text-[12px] font-medium text-white/50 truncate pr-2">
                      {event.subtitle}
                    </div>
                    <div className="col-span-3 text-[12px] font-bold text-[#A66B8E]">
                      {event.raw?.staff_member?.name || 'Aiva (AI)'}
                    </div>
                    <div className="col-span-2 text-[12px] font-medium text-white/50">
                      {event.time}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <div className="group relative">
                        <button 
                          onClick={() => handleComplete(event.id)}
                          className="w-5 h-5 rounded border border-white/20 flex items-center justify-center hover:bg-[#A66B8E]/20 hover:border-[#A66B8E] transition-colors cursor-pointer"
                        >
                          <CheckCircle2 size={12} className="text-transparent group-hover:text-[#A66B8E] transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-white tracking-tight flex items-center gap-2">
                Completed Today
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[12px] font-bold text-white/40">{completedAppointmentsCount} bookings finished</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-12 pb-3 border-b border-white/[0.08] text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
              <div className="col-span-3 pl-2">Client</div>
              <div className="col-span-3">Service</div>
              <div className="col-span-3">Provider</div>
              <div className="col-span-3">Time</div>
            </div>

            <div className="space-y-1">
              {completedAppointments.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center mb-3 text-white/20">
                    <ClipboardCheck size={20} />
                  </div>
                  <h4 className="text-[13px] font-bold text-white/70 mb-1">No completions yet</h4>
                  <p className="text-[12px] text-white/40">Completed appointments will appear here.</p>
                </div>
              ) : (
                completedAppointments.map((event) => (
                  <div key={event.id} className="grid grid-cols-12 items-center py-3 hover:bg-white/[0.02] rounded-xl transition-colors px-2 border border-transparent hover:border-white/[0.08]">
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[10px] bg-[#110B10] border border-white/10 text-white flex items-center justify-center font-bold text-[12px] shadow-sm">
                        {event.title.charAt(0)}
                      </div>
                      <span className="text-[13px] font-bold text-white/60 truncate pr-2 line-through decoration-white/20">{event.title}</span>
                    </div>
                    <div className="col-span-3 text-[12px] font-medium text-white/40 truncate pr-2">
                      {event.subtitle}
                    </div>
                    <div className="col-span-3 text-[12px] font-bold text-[#A66B8E]/60">
                      {event.raw?.staff_member?.name || 'Aiva (AI)'}
                    </div>
                    <div className="col-span-3 text-[12px] font-medium text-white/40 flex items-center gap-2">
                      <span>{event.time}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#A66B8E]/10 text-[#A66B8E] tracking-widest uppercase">Done</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ─── TODAY AT A GLANCE & TEAM STATUS ─── */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] shadow-2xl border border-white/[0.08] p-6 flex flex-col justify-between gap-6">
          
          {/* Top Half: Today at a Glance */}
          <div className="flex flex-col flex-1">
            <h3 className="text-[15px] font-bold text-white tracking-tight mb-4">Today at a glance</h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              
              <div className="bg-[#110B10]/40 border border-white/[0.05] hover:border-white/10 hover:bg-[#110B10]/60 rounded-[16px] p-4 flex flex-col justify-between transition-all duration-300">
                <div className="w-8 h-8 rounded-[10px] bg-[#110B10] border border-white/10 flex items-center justify-center text-[#A66B8E] shrink-0 self-start">
                  <Users size={16} />
                </div>
                <div className="mt-2">
                  <div className="text-[20px] font-black text-white leading-none">0</div>
                  <div className="text-[11px] font-bold text-white/50 mt-1">Walk-ins</div>
                  <div className="text-[9px] text-white/30 mt-0.5">So far today</div>
                </div>
              </div>

              <div className="bg-[#110B10]/40 border border-white/[0.05] hover:border-white/10 hover:bg-[#110B10]/60 rounded-[16px] p-4 flex flex-col justify-between transition-all duration-300">
                <div className="w-8 h-8 rounded-[10px] bg-[#110B10] border border-white/10 flex items-center justify-center text-[#A66B8E] shrink-0 self-start">
                  <CheckCircle2 size={16} />
                </div>
                <div className="mt-2">
                  <div className="text-[20px] font-black text-white leading-none">{stats?.repeat_customers ?? 5}</div>
                  <div className="text-[11px] font-bold text-white/50 mt-1">Returning Clients</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Booked today</div>
                </div>
              </div>

              <div className="bg-[#110B10]/40 border border-white/[0.05] hover:border-white/10 hover:bg-[#110B10]/60 rounded-[16px] p-4 flex flex-col justify-between transition-all duration-300">
                <div className="w-8 h-8 rounded-[10px] bg-[#110B10] border border-white/10 flex items-center justify-center text-[#A66B8E] shrink-0 self-start">
                  <ClipboardCheck size={16} />
                </div>
                <div className="mt-2">
                  <div className="text-[20px] font-black text-white leading-none">{completedAppointmentsCount}</div>
                  <div className="text-[11px] font-bold text-white/50 mt-1">Completed</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Bookings today</div>
                </div>
              </div>

              <div className="bg-[#110B10]/40 border border-white/[0.05] hover:border-white/10 hover:bg-[#110B10]/60 rounded-[16px] p-4 flex flex-col justify-between transition-all duration-300">
                <div className="w-8 h-8 rounded-[10px] bg-[#110B10] border border-white/10 flex items-center justify-center text-[#A66B8E] shrink-0 self-start">
                  <Wallet size={16} />
                </div>
                <div className="mt-2">
                  <div className="text-[20px] font-black text-white leading-none">
                    ₹{((stats?.revenue_estimate ?? 24500)/1000).toFixed(1)}K
                  </div>
                  <div className="text-[11px] font-bold text-white/50 mt-1">Total Revenue</div>
                  <div className="text-[9px] text-white/30 mt-0.5">+12% vs last month</div>
                </div>
              </div>

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06] my-1"></div>

          {/* Bottom Half: Team Status */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-white tracking-tight flex items-center gap-2">
                <Users size={16} className="text-[#A66B8E]" /> Team Status
              </h3>
              <span className="text-[9px] font-bold text-[#A66B8E] bg-[#A66B8E]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Floor Status
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 flex-1">
              
              {/* Emily */}
              <div className="bg-[#110B10]/40 border border-white/[0.05] hover:border-white/10 hover:bg-[#110B10]/60 rounded-[16px] p-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getStaffInitialsColor(1)} border flex items-center justify-center text-[10px] font-black shrink-0`}>
                    EC
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-white leading-none truncate">Emily</h4>
                    <p className="text-[9px] text-white/40 mt-1 truncate">Senior Stylist</p>
                  </div>
                </div>
                {renderStaffStatus(1)}
              </div>

              {/* Priya */}
              <div className="bg-[#110B10]/40 border border-white/[0.05] hover:border-white/10 hover:bg-[#110B10]/60 rounded-[16px] p-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getStaffInitialsColor(2)} border flex items-center justify-center text-[10px] font-black shrink-0`}>
                    PS
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-white leading-none truncate">Priya</h4>
                    <p className="text-[9px] text-white/40 mt-1 truncate">Colourist</p>
                  </div>
                </div>
                {renderStaffStatus(2)}
              </div>

              {/* Arjun */}
              <div className="bg-[#110B10]/40 border border-white/[0.05] hover:border-white/10 hover:bg-[#110B10]/60 rounded-[16px] p-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getStaffInitialsColor(4)} border flex items-center justify-center text-[10px] font-black shrink-0`}>
                    AJ
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-white leading-none truncate">Arjun</h4>
                    <p className="text-[9px] text-white/40 mt-1 truncate">Hair Designer</p>
                  </div>
                </div>
                {renderStaffStatus(4)}
              </div>

              {/* Chloe */}
              <div className="bg-[#110B10]/40 border border-white/[0.05] hover:border-white/10 hover:bg-[#110B10]/60 rounded-[16px] p-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getStaffInitialsColor(3)} border flex items-center justify-center text-[10px] font-black shrink-0`}>
                    CW
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-white leading-none truncate">Chloe</h4>
                    <p className="text-[9px] text-white/40 mt-1 truncate">Nail Tech</p>
                  </div>
                </div>
                {renderStaffStatus(3)}
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
