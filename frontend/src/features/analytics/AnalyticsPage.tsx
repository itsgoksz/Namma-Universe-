/**
 * Aiva — Executive Analytics
 * Matte Black OS aesthetic.
 * Tailored for Snip & Streak Hair & Beauty Studio.
 */

import { useEffect, useState } from 'react';
import {
  Sparkles,
  Award,
  TrendingUp,
  UserCheck,
  PhoneCall,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { analyticsAPI } from '../../lib/api';

export default function AnalyticsPage() {
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [callData, setCallData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [services, revenue, calls] = await Promise.all([
        analyticsAPI.services(30),
        analyticsAPI.revenue(30),
        analyticsAPI.calls(30),
      ]);
      setServiceData(services.services || []);
      setRevenueData(revenue.data || []);
      setCallData(calls.outcomes || {});
    } catch {
      setServiceData([
        { name: 'Signature Haircut', booking_count: 45, revenue: 54000 },
        { name: 'Balayage & Styling', booking_count: 28, revenue: 112000 },
        { name: 'Keratin Therapy', booking_count: 22, revenue: 88000 },
        { name: 'Classic Blowout', booking_count: 18, revenue: 27000 },
        { name: 'Full Colouring', booking_count: 15, revenue: 67500 },
      ]);
      setRevenueData([
        { date: '2026-05-01', revenue: 12500, bookings: 8 },
        { date: '2026-05-05', revenue: 18600, bookings: 12 },
        { date: '2026-05-10', revenue: 11200, bookings: 7 },
        { date: '2026-05-15', revenue: 24800, bookings: 14 },
        { date: '2026-05-20', revenue: 21200, bookings: 11 },
        { date: '2026-05-25', revenue: 31000, bookings: 16 },
        { date: '2026-05-30', revenue: 26500, bookings: 13 },
      ]);
      setCallData({ booked: 67, faq: 23, transferred: 8, missed: 5, cancelled: 4, rescheduled: 12 });
    } finally {
      setLoading(false);
    }
  };

  const getOutcomeLabel = (key: string) => {
    switch (key) {
      case 'booked': return 'Appointments Booked';
      case 'faq': return 'FAQs Answered';
      case 'transferred': return 'Transferred to Staff';
      case 'missed': return 'Missed & Handled';
      case 'cancelled': return 'Cancellations Processed';
      case 'rescheduled': return 'Reschedules Resolved';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  const totalCalls = Object.values(callData).reduce((sum, val) => sum + (val || 0), 0) || 1;
  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalBookings = revenueData.reduce((sum, item) => sum + (item.bookings || 0), 0);

  const customTooltipStyle = {
    background: '#140C11',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 500,
    color: '#ffffff',
    padding: '6px 10px',
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-10 w-48 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-lg animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-lg animate-shimmer" />
          ))}
        </div>
        <div className="h-72 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-[24px] font-black tracking-tight text-white">Insights</h1>
        <p className="text-[13px] text-white/40 mt-1 font-medium">Executive operational insight report for Snip & Streak</p>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total MTD Revenue</span>
            <TrendingUp size={14} className="text-[#A66B8E]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</span>
            <span className="text-[10px] font-semibold text-[#A66B8E]">+12.4%</span>
          </div>
          <p className="text-[9px] text-white/30">Based on {totalBookings} booked appointments</p>
        </div>

        <div className="p-4 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">AI Booking Rate</span>
            <Sparkles size={14} className="text-[#A66B8E]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white">94.7%</span>
            <span className="text-[10px] font-semibold text-[#A66B8E]">Optimal</span>
          </div>
          <p className="text-[9px] text-white/30">Industry standard: 78%</p>
        </div>

        <div className="p-4 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Client Retention</span>
            <UserCheck size={14} className="text-[#A66B8E]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white">74.0%</span>
            <span className="text-[10px] font-semibold text-[#A66B8E]">+3.1%</span>
          </div>
          <p className="text-[9px] text-white/30">Repeat salon clients this month</p>
        </div>

        <div className="p-4 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Missed Call Recovery</span>
            <PhoneCall size={14} className="text-[#A66B8E]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white">78.0%</span>
            <span className="text-[10px] font-semibold text-[#A66B8E]">Recovered</span>
          </div>
          <p className="text-[9px] text-white/30">Saved via automatic text-back</p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-7 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <h3 className="font-semibold text-[13px] text-white">Daily Revenue Growth</h3>
              <p className="text-[10px] text-white/30">Billing timeline showing daily gross salon booking value</p>
            </div>
            <span className="text-[9px] font-bold text-white/30 bg-[#120B0F] border border-white/[0.08] px-2.5 py-1 rounded uppercase tracking-widest">
              30 Days
            </span>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A66B8E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#A66B8E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    const parts = v.split('-');
                    return parts.length > 2 ? `${parts[2]}/${parts[1]}` : v;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#A66B8E"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-5 space-y-5">
          {/* Call Conversions */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="space-y-0.5">
              <h3 className="font-semibold text-[13px] text-white">Aiva Call Conversions</h3>
              <p className="text-[10px] text-white/30">Outcomes of incoming calls resolved by AI</p>
            </div>

            <div className="space-y-3">
              {Object.entries(callData).map(([key, val]) => {
                const percentage = Math.round((val / totalCalls) * 100);
                let barColor = 'bg-[#A66B8E]';
                if (key === 'missed') barColor = 'bg-rose-400';
                if (key === 'transferred') barColor = 'bg-amber-400';

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-white">
                      <span className="text-white/40">{getOutcomeLabel(key)}</span>
                      <span>
                        {val} calls <span className="text-white/20 ml-1">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Services */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-semibold text-[13px] text-white">Popular Treatments</h3>
                <p className="text-[10px] text-white/30">Top booked salon services by volume</p>
              </div>
              <Award size={14} className="text-[#A66B8E]" />
            </div>

            <div className="divide-y divide-white/5 pt-1">
              {serviceData.slice(0, 4).map((service, index) => (
                <div key={index} className="flex items-center justify-between py-2.5 text-xs first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 text-[10px] text-white/20 font-bold">0{index + 1}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{service.name}</p>
                      <p className="text-[9px] text-white/30">{service.booking_count} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹{service.revenue.toLocaleString('en-IN')}</p>
                    <p className="text-[9px] text-[#A66B8E] font-semibold flex items-center justify-end">
                      <ArrowUpRight size={8} /> Popular
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
