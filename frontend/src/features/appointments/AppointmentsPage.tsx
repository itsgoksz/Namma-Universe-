/**
 * Aiva — Appointments Experience
 * Premium Matte Black OS aesthetic.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Scissors,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Award,
  InfoIcon
} from 'lucide-react';
import {
  format,
  addDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths
} from 'date-fns';
import { appointmentsAPI } from '../../lib/api';
import type { Appointment } from '../../types';

type ViewMode = 'day' | 'week' | 'month';

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  scheduled: { bg: 'bg-white/5', text: 'text-white', border: 'border-white/10' },
  confirmed: { bg: 'bg-[#A66B8E]/10', text: 'text-[#A66B8E]', border: 'border-[#A66B8E]/30' },
  completed: { bg: 'bg-white/[0.02]', text: 'text-white/40', border: 'border-white/[0.08]' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  no_show: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
};

const stylists = [
  { id: 1, name: 'Emily Carter', role: 'Senior Stylist' },
  { id: 2, name: 'Priya Sharma', role: 'Colour Specialist' },
  { id: 3, name: 'Chloe Woods', role: 'Nail Technician' },
  { id: 4, name: 'Arjun', role: 'Hair Designer' }
];

const operatingHours = [
  { label: '09:00', time24: '09:00:00' },
  { label: '10:00', time24: '10:00:00' },
  { label: '11:00', time24: '11:00:00' },
  { label: '12:00', time24: '12:00:00' },
  { label: '13:00', time24: '13:00:00' },
  { label: '14:00', time24: '14:00:00' },
  { label: '15:00', time24: '15:00:00' },
  { label: '16:00', time24: '16:00:00' },
  { label: '17:00', time24: '17:00:00' }
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [currentDate, viewMode]);

  const loadAppointments = async () => {
    try {
      const data = await appointmentsAPI.list({
        date_from: format(currentDate, 'yyyy-MM-dd'),
        date_to: format(addDays(currentDate, viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 31), 'yyyy-MM-dd'),
      });
      setAppointments(data.items || []);
    } catch {
      // Mock Data
      setAppointments([
        {
          id: 1,
          business_id: 1,
          customer_id: 1,
          service_id: 1,
          staff_id: 1,
          date: format(currentDate, 'yyyy-MM-dd'),
          start_time: '09:00:00',
          end_time: '09:45:00',
          status: 'confirmed',
          source: 'ai',
          notes: 'Prefers organic shampoos.',
          customer: { id: 1, name: 'Sarah Johnson', phone: '+91 98450 12345' },
          service: { id: 1, name: 'Haircut + Styling', duration_minutes: 45 },
          staff_member: { id: 1, name: 'Emily Carter' },
          created_at: '',
          updated_at: ''
        },
        {
          id: 2,
          business_id: 1,
          customer_id: 2,
          service_id: 2,
          staff_id: 1,
          date: format(currentDate, 'yyyy-MM-dd'),
          start_time: '10:00:00',
          end_time: '11:00:00',
          status: 'scheduled',
          source: 'manual',
          notes: 'Consult on highlights.',
          customer: { id: 2, name: 'Mike Chen', phone: '+91 99000 98765' },
          service: { id: 2, name: 'Colour Consultation', duration_minutes: 60 },
          staff_member: { id: 1, name: 'Emily Carter' },
          created_at: '',
          updated_at: ''
        },
        {
          id: 3,
          business_id: 1,
          customer_id: 3,
          service_id: 3,
          staff_id: 2,
          date: format(currentDate, 'yyyy-MM-dd'),
          start_time: '11:30:00',
          end_time: '12:30:00',
          status: 'scheduled',
          source: 'ai',
          notes: 'Bridal pack trial.',
          customer: { id: 3, name: 'Emma Parker', phone: '+91 98860 45678' },
          service: { id: 3, name: 'Bridal Trial Pack', duration_minutes: 60 },
          staff_member: { id: 2, name: 'Priya Sharma' },
          created_at: '',
          updated_at: ''
        },
        {
          id: 4,
          business_id: 1,
          customer_id: 4,
          service_id: 4,
          staff_id: 3,
          date: format(currentDate, 'yyyy-MM-dd'),
          start_time: '14:00:00',
          end_time: '15:00:00',
          status: 'confirmed',
          source: 'online',
          notes: 'Prefers Chloe Woods.',
          customer: { id: 4, name: 'Neha Reddy', phone: '+91 98440 22334' },
          service: { id: 4, name: 'Classic Blowout', duration_minutes: 60 },
          staff_member: { id: 3, name: 'Chloe Woods' },
          created_at: '',
          updated_at: ''
        }
      ]);
    }
  };

  const handlePrevious = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, -1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const getDayAppointments = (time24: string, staffId: number) => {
    const timePrefix = time24.slice(0, 2);
    return appointments.filter(
      (apt) => (apt.staff_id === staffId || (!apt.staff_id && staffId === 1)) && apt.start_time?.startsWith(timePrefix)
    );
  };

  return (
    <div className="flex flex-col gap-5 pb-12 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-white tracking-tight">Schedule</h1>
          <p className="text-[13px] text-white/40 mt-1 font-medium">Stylist lanes and walk-in capacity</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-white/[0.03] backdrop-blur-2xl p-1 rounded-lg border border-white/[0.08]">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1.5 rounded-md text-[12px] font-bold capitalize transition-all ${viewMode === mode
                  ? 'bg-[#1C1117] text-white shadow-sm border border-white/10'
                  : 'text-white/40 hover:text-white'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#A66B8E] hover:bg-[#B882A2] text-gray-900 text-[12px] font-bold rounded-lg shadow-[0_4px_15px_rgba(212,248,75,0.2)] transition-all whitespace-nowrap">
            <Plus size={14} strokeWidth={2.5} /> New Booking
          </button>
        </div>
      </div>

      {/* CALENDAR CONTROLS */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="flex bg-white/[0.03] backdrop-blur-2xl shadow-lg border border-white/[0.08] rounded-xl p-1">
            <button onClick={handlePrevious} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleNext} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
              <ChevronRight size={18} />
            </button>
          </div>
          <span className="text-[18px] font-bold text-white tracking-tight">
            {format(currentDate, 'MMMM d, yyyy')}
          </span>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-white/60 hover:text-white bg-white/[0.03] backdrop-blur-2xl shadow-lg border border-white/[0.08] rounded-xl transition-all"
          >
            Today
          </button>
        </div>
      </div>

      {/* SCHEDULE GRID (DAY VIEW) */}
      {viewMode === 'day' && (
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/[0.08] overflow-hidden">
          <div className="grid grid-cols-[80px_1fr] divide-x divide-white/5">

            {/* Corner Cell */}
            <div className="bg-[#120B0F] p-4 flex items-center justify-center border-b border-white/[0.08]">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Time</span>
            </div>

            {/* Stylist Headers */}
            <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/[0.08] bg-[#120B0F]">
              {stylists.map(stylist => (
                <div key={stylist.id} className="p-4 text-center">
                  <div className="font-bold text-[14px] text-white tracking-tight">{stylist.name}</div>
                  <div className="text-[11px] text-white/40 mt-1 font-bold uppercase tracking-widest">{stylist.role}</div>
                </div>
              ))}
            </div>

            {/* Time Rows */}
            {operatingHours.map((hour) => (
              <div key={hour.time24} className="contents">
                {/* Time Label */}
                <div className="p-6 text-center border-b border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl">
                  <span className="text-[12px] font-bold text-white/60">{hour.label}</span>
                </div>

                {/* Stylist Lanes */}
                <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl">
                  {stylists.map(stylist => {
                    const cellAppts = getDayAppointments(hour.time24, stylist.id);
                    return (
                      <div key={`${hour.time24}-${stylist.id}`} className="p-4 min-h-[180px] hover:bg-white/[0.02] transition-colors relative group">
                        {cellAppts.map(apt => {
                          const statusStyle = statusColors[apt.status || 'scheduled'] || statusColors.scheduled;
                          return (
                            <motion.div
                              layoutId={`apt-${apt.id}`}
                              key={apt.id}
                              onClick={() => setSelectedApt(apt)}
                              className={`mb-2 p-3 rounded-xl border ${statusStyle.bg} ${statusStyle.border} cursor-pointer shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-[13px] font-bold ${statusStyle.text} truncate`}>
                                    {apt.customer?.name}
                                  </span>
                                  <span className="text-[#A66B8E] hover:text-[#B882A2] bg-[#A66B8E]/10 hover:bg-[#A66B8E]/20 p-1.5 rounded-lg transition-all shadow-sm">
                                    <InfoIcon size={13} />
                                  </span>
                                </div>
                                <span className={`text-[11px] font-medium ${statusStyle.text} opacity-80 truncate block mt-0.5`}>
                                  {apt.service?.name}
                                </span>
                              </div>
                              <div className="mt-3">
                                <span className={`text-[10px] ${statusStyle.text} font-bold uppercase tracking-widest`}>{apt.status}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                        {/* Hover Add Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="w-10 h-10 rounded-xl bg-[#1C1117] shadow-xl border border-white/10 text-[#A66B8E] flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform cursor-pointer">
                            <Plus size={18} strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide Drawer for Event Details */}
      <AnimatePresence>
        {selectedApt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApt(null)}
              className="fixed inset-0 z-45 bg-black backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/[0.03] backdrop-blur-2xl z-50 shadow-2xl border-l border-white/[0.08] p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-6">
                  <div>
                    <h3 className="font-bold text-[18px] text-white">Booking Profile</h3>
                    <p className="text-[12px] text-white/40 font-bold uppercase tracking-widest mt-1">ID: #{selectedApt.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApt(null)}
                    className="w-10 h-10 rounded-full bg-[#120B0F] border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="mt-6 p-6 bg-[#120B0F] rounded-[1.5rem] border border-white/[0.08]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-[#1C1117] border border-white/10 text-[#A66B8E] font-black flex items-center justify-center text-[22px] uppercase shadow-inner">
                      {selectedApt.customer?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[22px] text-white tracking-tight">{selectedApt.customer?.name}</h4>
                      {selectedApt.customer?.phone && (
                        <p className="text-[13px] font-bold text-white/40 mt-1 flex items-center gap-1.5">
                          <Phone size={14} />
                          {selectedApt.customer?.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
                    <div>
                      <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Reliability</span>
                      <span className="text-[14px] font-bold text-[#A66B8E] flex items-center gap-1.5 mt-1">
                        <Award size={16} /> 98% Score
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Source</span>
                      <span className="text-[14px] font-bold text-white capitalize mt-1 block">
                        {selectedApt.source === 'ai' ? 'Aiva Assistant' : selectedApt.source}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-6 px-2">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1C1117] border border-white/[0.08] flex items-center justify-center text-[#A66B8E] shrink-0">
                      <Scissors size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest block">Service</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[15px] font-bold text-white">
                          {selectedApt.service?.name || 'Haircut'}
                        </span>
                        {selectedApt.service?.duration_minutes && (
                          <span className="text-[13px] font-bold text-[#A66B8E] bg-[#A66B8E]/10 border border-[#A66B8E]/20 px-2 py-0.5 rounded-md">
                            {selectedApt.service.duration_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1C1117] border border-white/[0.08] flex items-center justify-center text-blue-400 shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest block">Staff Professional</span>
                      <div className="mt-1">
                        <span className="text-[15px] font-bold text-white">
                          {selectedApt.staff_member?.name || 'Not assigned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1C1117] border border-white/[0.08] flex items-center justify-center text-amber-400 shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest block">Time</span>
                      <div className="mt-1">
                        <span className="text-[15px] font-bold text-white">
                          {selectedApt.date || 'Today'} at {selectedApt.start_time?.slice(0, 5)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedApt.notes && (
                    <div className="pt-4 border-t border-white/[0.08]">
                      <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest block mb-3">Client Notes</span>
                      <div className="bg-[#120B0F] border border-white/[0.08] p-4 rounded-2xl text-[14px] font-medium text-white/60 leading-relaxed flex gap-3">
                        <FileText size={16} className="text-white/40 flex-shrink-0 mt-0.5" />
                        <span>{selectedApt.notes}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setSelectedApt(null)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[14px] font-bold text-gray-900 bg-[#A66B8E] hover:bg-[#B882A2] shadow-lg shadow-[#A66B8E]/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={18} /> Confirm & Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
