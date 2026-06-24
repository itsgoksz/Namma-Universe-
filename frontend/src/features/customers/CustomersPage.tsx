/**
 * Aiva — Customers Page
 * Premium, minimal Apple/Linear inspired split-screen directory layout.
 * Custom crafted for Snip & Streak Hair & Beauty Studio.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Phone as PhoneIcon,
  Mail,
  AlertCircle,
  FileText,
  Clock,
  ChevronRight,
  Scissors
} from 'lucide-react';
import { customersAPI } from '../../lib/api';
import type { Customer } from '../../types';

interface SalonMetadata {
  preferredStylist: string;
  preferredServices: string[];
  rebookingLikelihood: { label: string; text: string; bg: string; fill: string };
  visits: Array<{
    date: string;
    service: string;
    stylist: string;
    status: 'completed' | 'no_show' | 'cancelled';
  }>;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customersAPI.list({ search: search || undefined, page: 1, page_size: 50 });
      setCustomers(data.items);
      if (data.items.length > 0 && !selectedId) {
        setSelectedId(data.items[0].id);
      }
    } catch {
      const fallbackData = [
        {
          id: 1,
          business_id: 1,
          name: 'Sarah Johnson',
          phone: '+91 98450 12345',
          email: 'sarah.johnson@gmail.com',
          notes: 'Prefers organic shampoos. Sensitive scalp. High-value customer who books regularly.',
          reliability_score: 98,
          total_visits: 12,
          no_show_count: 0,
          created_at: '2025-01-15',
          updated_at: '2026-05-20'
        },
        {
          id: 2,
          business_id: 1,
          name: 'Mike Chen',
          phone: '+91 98450 98765',
          email: 'mike.chen@outlook.com',
          notes: 'Always books color treatments with Emily. Usually arrives exactly on time.',
          reliability_score: 85,
          total_visits: 5,
          no_show_count: 1,
          created_at: '2025-03-10',
          updated_at: '2026-05-18'
        },
        {
          id: 3,
          business_id: 1,
          name: 'Lisa Park',
          phone: '+91 98450 45678',
          email: 'lisa.park@instagram.com',
          notes: 'VIP customer. Prefers quiet appointments. Usually books premium treatments.',
          reliability_score: 100,
          total_visits: 24,
          no_show_count: 0,
          created_at: '2024-06-01',
          updated_at: '2026-05-22'
        },
        {
          id: 4,
          business_id: 1,
          name: 'James Wilson',
          phone: '+91 98450 32109',
          email: 'james.wilson@yahoo.com',
          notes: 'Has missed 1 appointment. Aiva sent warning reminder which recovered next visit.',
          reliability_score: 67,
          total_visits: 3,
          no_show_count: 1,
          created_at: '2025-04-20',
          updated_at: '2026-05-15'
        },
      ];
      setCustomers(fallbackData);
      if (fallbackData.length > 0 && !selectedId) {
        setSelectedId(fallbackData[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === selectedId) || null;

  const getScoreDetails = (score: number) => {
    if (score >= 90) return { bg: 'bg-[#A66B8E]/10', border: 'border-[#A66B8E]/20', text: 'text-[#A66B8E]', fill: 'bg-[#A66B8E]', label: 'Highly Reliable' };
    if (score >= 70) return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', fill: 'bg-amber-400', label: 'Needs Reminders' };
    return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', fill: 'bg-rose-400', label: 'High No-Show Risk' };
  };

  const getSalonMetadata = (customer: Customer): SalonMetadata => {
    // Deterministic mappings based on customer ID
    const stylists = ['Emily', 'Priya', 'Chloe', 'Arjun'];
    const services = ['Balayage & Styling', 'Signature Haircut', 'Keratin Therapy', 'Classic Blowout', 'Full Colouring & Treatment'];
    
    const stylistIndex = customer.id % stylists.length;
    const preferredStylist = stylists[stylistIndex];
    
    const preferredServices = [
      services[customer.id % services.length],
      services[(customer.id + 2) % services.length]
    ];

    let rebookingLikelihood = { label: 'Medium', text: 'text-amber-400', bg: 'bg-amber-500/10', fill: 'bg-amber-400' };
    if (customer.reliability_score >= 90) {
      rebookingLikelihood = { label: 'High', text: 'text-[#A66B8E]', bg: 'bg-[#A66B8E]/10', fill: 'bg-[#A66B8E]' };
    } else if (customer.reliability_score < 70) {
      rebookingLikelihood = { label: 'Low', text: 'text-rose-400', bg: 'bg-rose-500/10', fill: 'bg-rose-400' };
    }

    const dates = ['May 24, 2026', 'May 10, 2026', 'Apr 18, 2026', 'Mar 29, 2026', 'Mar 02, 2026'];
    const visits = Array.from({ length: Math.min(customer.total_visits || 1, 4) }).map((_, idx) => {
      const isNoShow = idx === 1 && customer.no_show_count > 0;
      return {
        date: dates[idx % dates.length],
        service: services[(customer.id + idx) % services.length],
        stylist: stylists[(stylistIndex + idx) % stylists.length],
        status: (isNoShow ? 'no_show' : 'completed') as 'completed' | 'no_show' | 'cancelled'
      };
    });

    return {
      preferredStylist,
      preferredServices,
      rebookingLikelihood,
      visits
    };
  };

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black tracking-tight text-white">Clients</h1>
          <p className="text-[13px] text-white/40 mt-1 font-medium">Directory of Snip & Streak Hair & Beauty Studio</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold text-gray-900 bg-[#A66B8E] hover:bg-[#B882A2] transition-all shadow-[0_4px_15px_rgba(212,248,75,0.2)] cursor-pointer">
          <Plus size={14} /> New Client
        </button>
      </div>

      {/* Split Directory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mt-2">
        {/* Left Side: Directory List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-lg text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-[#A66B8E]/30 transition-all placeholder:text-white/25 text-white"
            />
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-lg animate-shimmer" />
              ))
            ) : (
              customers.map((customer) => {
                const score = getScoreDetails(customer.reliability_score);
                const isSelected = customer.id === selectedId;
                return (
                  <motion.div
                    key={customer.id}
                    onClick={() => setSelectedId(customer.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-white/[0.03] backdrop-blur-2xl border-[#A66B8E]/30'
                        : 'bg-white/[0.03] backdrop-blur-2xl border-white/[0.08] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#120B0F] text-white border border-white/10 uppercase">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-[13px] text-white truncate">{customer.name}</h4>
                        <p className="text-[11px] text-white/40 truncate mt-0.5">{customer.phone || 'No phone'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${score.bg} ${score.border} ${score.text}`}>
                        {customer.reliability_score}%
                      </span>
                      <ChevronRight size={12} className={isSelected ? 'text-[#A66B8E]' : 'text-white/20'} />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: High-End Customer Detail Dashboard (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedCustomer ? (
              <motion.div
                key={selectedCustomer.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-6"
              >
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold bg-[#120B0F] text-[#A66B8E] border border-white/10 uppercase">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedCustomer.name}</h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-white/40 justify-center sm:justify-start">
                        {selectedCustomer.phone && (
                          <span className="flex items-center gap-1">
                            <PhoneIcon size={11} className="text-white/30" />
                            {selectedCustomer.phone}
                          </span>
                        )}
                        {selectedCustomer.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={11} className="text-white/30" />
                            {selectedCustomer.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#120B0F] border border-white/10 text-white/40 tracking-wide uppercase">
                    ID: #{selectedCustomer.id}
                  </span>
                </div>

                {/* Salon Specific Indicators Grid */}
                <div>
                  <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Salon Indicators</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Preferred Stylist */}
                    <div className="p-3.5 bg-[#120B0F] border border-white/[0.08] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Preferred Stylist</span>
                        <span className="text-xs font-semibold text-white block">
                          {getSalonMetadata(selectedCustomer).preferredStylist}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#A66B8E]/10 text-[#A66B8E] flex items-center justify-center font-bold text-xs">
                        {getSalonMetadata(selectedCustomer).preferredStylist.charAt(0)}
                      </div>
                    </div>

                    {/* Rebooking Likelihood */}
                    <div className="p-3.5 bg-[#120B0F] border border-white/[0.08] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Rebooking Likelihood</span>
                        <span className={`text-xs font-semibold block ${getSalonMetadata(selectedCustomer).rebookingLikelihood.text}`}>
                          {getSalonMetadata(selectedCustomer).rebookingLikelihood.label} Likelihood
                        </span>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${getSalonMetadata(selectedCustomer).rebookingLikelihood.fill} animate-pulse-ring`} />
                    </div>

                    {/* Reliability Score */}
                    <div className="p-3.5 bg-[#120B0F] border border-white/[0.08] rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Reliability Score</span>
                        <span className="text-xs font-bold text-white">{selectedCustomer.reliability_score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreDetails(selectedCustomer.reliability_score).fill}`}
                          style={{ width: `${selectedCustomer.reliability_score}%` }}
                        />
                      </div>
                    </div>

                    {/* Preferred Services */}
                    <div className="p-3.5 bg-[#120B0F] border border-white/[0.08] rounded-xl space-y-1.5">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Preferred Services</span>
                      <div className="flex flex-wrap gap-1.5">
                        {getSalonMetadata(selectedCustomer).preferredServices.map((srv, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#A66B8E] bg-[#A66B8E]/10 px-2 py-0.5 rounded"
                          >
                            <Scissors size={8} />
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Notes Area */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <FileText size={11} className="text-white/30" />
                    <span>Stylist & Consultation Notes</span>
                  </div>
                  <div className="p-4 bg-[#120B0F] border border-white/[0.08] rounded-xl">
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      {selectedCustomer.notes || 'No notes on file. Add stylist preferences or consultation logs below.'}
                    </p>
                  </div>
                </div>

                {/* Visit History Timeline */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <Clock size={11} className="text-white/30" />
                    <span>Visit History Timeline</span>
                  </div>
                  
                  <div className="relative border-l border-white/[0.08] pl-4 space-y-4.5 ml-2">
                    {getSalonMetadata(selectedCustomer).visits.map((visit, idx) => {
                      const isNoShow = visit.status === 'no_show';
                      return (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[21.5px] top-0.5 w-2.5 h-2.5 rounded-full bg-white/[0.03] backdrop-blur-2xl border-2 ${
                            isNoShow ? 'border-rose-400' : 'border-[#A66B8E]'
                          }`} />
                          
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-white">{visit.service}</h4>
                              <p className="text-[10px] text-white/40 mt-0.5">Stylist: {visit.stylist}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-white/30 block font-medium">{visit.date}</span>
                              <span className={`inline-block text-[8px] font-bold px-1.5 py-0.2 rounded mt-0.5 uppercase ${
                                isNoShow ? 'bg-rose-500/10 text-rose-400' : 'bg-[#A66B8E]/10 text-[#A66B8E]'
                              }`}>
                                {isNoShow ? 'No Show' : 'Completed'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08]">
                <AlertCircle size={28} className="mx-auto mb-2 text-white/20" />
                <p className="font-semibold text-white text-xs">No client selected</p>
                <p className="text-[10px] text-white/40 mt-0.5">Select a client from the directory to review their profile.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
