/**
 * Aiva — Staff Page
 * Matte Black OS aesthetic.
 * Premium team profile cards with weekly availability schedule.
 * Tailored for Snip & Streak Hair & Beauty Studio.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, Mail, Calendar, UserCheck } from 'lucide-react';
import { staffAPI } from '../../lib/api';
import type { Staff } from '../../types';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffAPI
      .list()
      .then(setStaffList)
      .catch(() => {
        setStaffList([
          {
            id: 1,
            business_id: 1,
            name: 'Emily Rose',
            role: 'Senior Stylist',
            phone: '+1 (555) 111-2222',
            email: 'emily.r@glowsalon.com',
            availability: {
              monday: { start: '09:00', end: '17:00', available: true },
              tuesday: { start: '09:00', end: '17:00', available: true },
              wednesday: { start: '09:00', end: '17:00', available: true },
              thursday: { start: '09:00', end: '17:00', available: true },
              friday: { start: '09:00', end: '17:00', available: true },
              saturday: { start: '10:00', end: '16:00', available: true },
              sunday: { start: '', end: '', available: false }
            },
            is_active: true,
            created_at: ''
          },
          {
            id: 2,
            business_id: 1,
            name: 'Alex Kim',
            role: 'Senior Colorist',
            phone: '+1 (555) 333-4444',
            email: 'alex.k@glowsalon.com',
            availability: {
              monday: { start: '10:00', end: '18:00', available: true },
              tuesday: { start: '10:00', end: '18:00', available: true },
              wednesday: { start: '', end: '', available: false },
              thursday: { start: '10:00', end: '18:00', available: true },
              friday: { start: '10:00', end: '18:00', available: true },
              saturday: { start: '10:00', end: '15:00', available: true },
              sunday: { start: '', end: '', available: false }
            },
            is_active: true,
            created_at: ''
          },
          {
            id: 3,
            business_id: 1,
            name: 'Jordan Lee',
            role: 'Nail Specialist',
            phone: '+1 (555) 555-6666',
            email: 'jordan.l@glowsalon.com',
            availability: {
              monday: { start: '09:00', end: '17:00', available: true },
              tuesday: { start: '09:00', end: '17:00', available: true },
              wednesday: { start: '09:00', end: '17:00', available: true },
              thursday: { start: '', end: '', available: false },
              friday: { start: '09:00', end: '17:00', available: true },
              saturday: { start: '09:00', end: '14:00', available: true },
              sunday: { start: '', end: '', available: false }
            },
            is_active: true,
            created_at: ''
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Staff</h1>
          <p className="text-[11px] text-white/40 font-medium mt-1">
            Manage team members, roles & weekly availability
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-[#0A0508] bg-[#A66B8E] hover:bg-[#B882A2] transition-all whitespace-nowrap">
          <Plus size={14} /> Add Member
        </button>
      </div>

      {/* Staff Cards */}
      <div className="flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl animate-pulse" />
          ))
        ) : (
          staffList.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.25, ease: 'easeOut' }}
              className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 transition-all hover:border-white/10"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                {/* Profile Block */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[11px] font-bold text-[#0A0508] bg-[#A66B8E] flex-shrink-0">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[13px] text-white">{member.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#A66B8E]/10 border border-[#A66B8E]/20 text-[#A66B8E] uppercase tracking-wider">
                        {member.role}
                      </span>
                      {member.is_active && (
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
                          <UserCheck size={10} /> Active
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-white/40 font-medium">
                      {member.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={11} className="text-white/25" />
                          {member.phone}
                        </span>
                      )}
                      {member.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={11} className="text-white/25" />
                          {member.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Weekly Schedule Grid */}
                <div className="flex-1 w-full md:max-w-xl border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Calendar size={11} className="text-white/30" />
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">
                      Weekly Schedule
                    </h4>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {days.map((day) => {
                      const avail = member.availability?.[day];
                      const isAvailable = avail?.available;
                      return (
                        <div key={day} className="text-center flex flex-col gap-1">
                          <span className="text-[8px] font-bold text-white/25 uppercase tracking-wider">
                            {day.slice(0, 3)}
                          </span>
                          <div
                            className={`rounded-lg py-1.5 px-0.5 text-[8px] font-bold transition-all truncate ${
                              isAvailable
                                ? 'bg-[#A66B8E]/8 border border-[#A66B8E]/15 text-[#A66B8E]/80'
                                : 'bg-white/3 border border-white/[0.08] text-white/20'
                            }`}
                          >
                            {isAvailable
                              ? `${avail?.start?.slice(0, 5)}–${avail?.end?.slice(0, 5)}`
                              : 'Off'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
