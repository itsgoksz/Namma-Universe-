/**
 * Aiva — Services Page
 * Matte Black OS aesthetic.
 * Service catalog with premium card grid.
 * Tailored for Snip & Streak Hair & Beauty Studio.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Scissors, Clock, IndianRupee, Edit, Trash2 } from 'lucide-react';
import { servicesAPI } from '../../lib/api';
import type { Service } from '../../types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesAPI
      .list()
      .then(setServices)
      .catch(() => {
        setServices([
          { id: 1, business_id: 1, name: 'Haircut & Styling', duration_minutes: 30, price: 250, is_active: true, created_at: '' },
          { id: 2, business_id: 1, name: 'Hair Spa for Men', duration_minutes: 45, price: 699, is_active: true, created_at: '' },
          { id: 3, business_id: 1, name: 'Global Hair Colour For Women', duration_minutes: 90, price: 1499, is_active: true, created_at: '' },
          { id: 4, business_id: 1, name: 'Blowout Dry', duration_minutes: 30, price: 399, is_active: true, created_at: '' },
          { id: 5, business_id: 1, name: 'Hair Streaks / Highlights', duration_minutes: 90, price: 1199, is_active: true, created_at: '' },
          { id: 6, business_id: 1, name: 'Detanning - Face', duration_minutes: 20, price: 399, is_active: true, created_at: '' },
          { id: 7, business_id: 1, name: 'Bleach - Under Arms', duration_minutes: 15, price: 249, is_active: true, created_at: '' },
          { id: 8, business_id: 1, name: 'Bleach - Face', duration_minutes: 15, price: 299, is_active: true, created_at: '' },
          { id: 9, business_id: 1, name: 'Bleach - Arms', duration_minutes: 25, price: 499, is_active: true, created_at: '' },
          { id: 10, business_id: 1, name: 'Bleach - Back', duration_minutes: 25, price: 399, is_active: true, created_at: '' },
          { id: 11, business_id: 1, name: 'Bleach - Feet', duration_minutes: 20, price: 299, is_active: true, created_at: '' },
          { id: 12, business_id: 1, name: 'D-Tan - Face', duration_minutes: 20, price: 499, is_active: true, created_at: '' },
          { id: 13, business_id: 1, name: 'Basic Clean Up', duration_minutes: 30, price: 499, is_active: true, created_at: '' },
          { id: 14, business_id: 1, name: 'Clean Up', duration_minutes: 40, price: 599, is_active: true, created_at: '' },
          { id: 15, business_id: 1, name: 'Gold Clean Up', duration_minutes: 40, price: 799, is_active: true, created_at: '' },
          { id: 16, business_id: 1, name: 'Silver Facial', duration_minutes: 60, price: 999, is_active: true, created_at: '' },
          { id: 17, business_id: 1, name: 'Gold Facial', duration_minutes: 60, price: 1299, is_active: true, created_at: '' },
          { id: 18, business_id: 1, name: 'Pearl Facial', duration_minutes: 60, price: 1199, is_active: true, created_at: '' },
          { id: 19, business_id: 1, name: 'Fruit Facial', duration_minutes: 50, price: 899, is_active: true, created_at: '' },
          { id: 20, business_id: 1, name: 'Manicure Gel', duration_minutes: 30, price: 399, is_active: true, created_at: '' },
          { id: 21, business_id: 1, name: 'Pedicure Spa', duration_minutes: 45, price: 499, is_active: true, created_at: '' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Services</h1>
          <p className="text-[11px] text-white/40 font-medium mt-1">
            Configure your service catalog & pricing
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-[#0A0508] bg-[#A66B8E] hover:bg-[#B882A2] transition-all whitespace-nowrap">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl animate-pulse" />
          ))
        ) : (
          services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25, ease: 'easeOut' }}
              className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 transition-all hover:border-white/10 flex flex-col justify-between group relative"
            >
              <div>
                {/* Top layout */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#A66B8E]/10">
                    <Scissors size={17} className="text-[#A66B8E]" />
                  </div>
                  {/* Floating edit/delete */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/25 hover:text-white/60 transition-all cursor-pointer">
                      <Edit size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-rose-500/10 text-white/25 hover:text-rose-400 transition-all cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-[13px] text-white mb-1">{service.name}</h3>

                {!service.is_active && (
                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-bold bg-white/5 border border-white/10 text-white/30 tracking-wide uppercase mt-1">
                    Inactive
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] pt-3 mt-4">
                <span className="flex items-center gap-1 text-[11px] text-white/35 font-semibold">
                  <Clock size={12} className="text-white/20" />
                  {service.duration_minutes} min
                </span>
                <span className="flex items-center text-[13px] font-bold text-[#A66B8E] tracking-tight">
                  <IndianRupee size={12} className="mr-0.5" />
                  {Number(service.price).toFixed(0)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
