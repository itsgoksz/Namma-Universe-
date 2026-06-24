/**
 * Aiva — Calls Experience
 * Matte Black OS aesthetic.
 * Conversation Intelligence console.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  PhoneIncoming,
  PhoneForwarded,
  PhoneMissed,
  Bot,
  Clock,
  Volume2,
  Play,
  Pause,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { callsAPI } from '../../lib/api';
import type { Call } from '../../types';

const outcomeConfig: Record<
  string,
  { label: string; icon: React.ElementType; bg: string; text: string; border: string }
> = {
  booked: { label: 'Booked', icon: Phone, bg: 'bg-[#A66B8E]/10', text: 'text-[#A66B8E]', border: 'border-[#A66B8E]/20' },
  rescheduled: { label: 'Rescheduled', icon: PhoneIncoming, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  cancelled: { label: 'Cancelled', icon: Phone, bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  faq: { label: 'FAQ', icon: Bot, bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  transferred: { label: 'Transferred', icon: PhoneForwarded, bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  missed: { label: 'Missed', icon: PhoneMissed, bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  unknown: { label: 'Unknown', icon: Phone, bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10' },
};

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [filter, setFilter] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadCalls();
  }, [filter]);

  const loadCalls = async () => {
    setLoading(true);
    try {
      const data = await callsAPI.list({ outcome: filter || undefined, page: 1, page_size: 50 });
      setCalls(data.items || []);
      if (data.items && data.items.length > 0) {
        setSelectedCall(data.items[0]);
      }
    } catch {
      const mockCalls: Call[] = [
        {
          id: 1, business_id: 1, customer_id: 1,
          call_start: '2026-06-02T09:15:00Z', call_end: '2026-06-02T09:18:30Z',
          duration_seconds: 210, outcome: 'booked',
          transcript: 'Customer: Hi, I\'d like to book a haircut and styling for tomorrow afternoon if possible.\n\nAI: I\'d be happy to assist with your booking! Let me check availability at Snip & Streak for tomorrow. We have slots at 2:00 PM and 4:30 PM with Emily Carter. Which time works best for you?\n\nCustomer: 2 PM works perfectly. Can you assign it to Emily?\n\nAI: Excellent! I\'ve booked your haircut and styling tomorrow at 2:00 PM with Emily Carter. A confirmation SMS is on its way to your number. Is there anything else you need?\n\nCustomer: That is all. Thank you!\n\nAI: You\'re welcome, Sarah! We look forward to seeing you tomorrow. Have a beautiful day!',
          recording_url: 'dummy_url', transfer_reason: null, voice_provider: 'vapi', provider_call_id: 'vapi_123',
          customer_name: 'Sarah Johnson', created_at: '2026-06-02T09:15:00Z'
        },
        {
          id: 2, business_id: 1, customer_id: 2,
          call_start: '2026-06-02T10:30:00Z', call_end: '2026-06-02T10:31:00Z',
          duration_seconds: 60, outcome: 'faq',
          transcript: 'Customer: Hi, are you guys located near the Metro station in JP Nagar?\n\nAI: Yes, we are! Snip & Streak is located on the 2nd Phase of JP Nagar, just a 5-minute walk from the JP Nagar Metro Station, right opposite the central park.\n\nCustomer: Great, thank you so much.\n\nAI: You\'re welcome! Feel free to call back if you need help scheduling an appointment. Goodbye!',
          recording_url: 'dummy_url', transfer_reason: null, voice_provider: 'vapi', provider_call_id: 'vapi_124',
          customer_name: 'Mike Chen', created_at: '2026-06-02T10:30:00Z'
        },
        {
          id: 3, business_id: 1, customer_id: 3,
          call_start: '2026-06-02T14:00:00Z', call_end: '2026-06-02T14:02:30Z',
          duration_seconds: 150, outcome: 'transferred',
          transcript: 'Customer: Hi, I need to reschedule my bridal package trial because of an urgent travel schedule. Can I talk to Priya?\n\nAI: I understand completely. Rescheduling bridal packages requires staff validation. Let me transfer you directly to Priya Sharma to adjust your slot right away. Please hold.',
          recording_url: 'dummy_url', transfer_reason: 'Client requested bridal package adjustment and transfer to Priya.',
          voice_provider: 'vapi', provider_call_id: 'vapi_126', customer_name: 'Emma Parker', created_at: '2026-06-02T14:00:00Z'
        },
        {
          id: 4, business_id: 1, customer_id: null,
          call_start: '2026-06-02T11:45:00Z', call_end: '2026-06-02T11:45:15Z',
          duration_seconds: 15, outcome: 'missed', transcript: null, recording_url: null,
          transfer_reason: null, voice_provider: 'vapi', provider_call_id: 'vapi_125',
          customer_name: null, created_at: '2026-06-02T11:45:00Z'
        }
      ];
      setCalls(mockCalls);
      setSelectedCall(mockCalls[0]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '—';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const getCallMetadata = (call: Call) => {
    if (call.outcome === 'booked') {
      return { intent: 'Appointment Booking', sentiment: 'Friendly / Satisfied', action: 'Aiva scheduled haircut & styling for tomorrow at 2:00 PM. Sent confirmation via WhatsApp.' };
    }
    if (call.outcome === 'faq') {
      return { intent: 'Location Inquiry', sentiment: 'Inquiring / Neutral', action: 'Aiva answered Metro proximity directions and parking details automatically.' };
    }
    if (call.outcome === 'transferred') {
      return { intent: 'Bridal Package Rescheduling', sentiment: 'Anxious / Urgent', action: 'Transferred directly to Priya Sharma for custom package scheduling.' };
    }
    return { intent: 'Inquiry Abandoned', sentiment: 'Unknown', action: 'Call ended before transaction commenced.' };
  };

  return (
    <div className="flex flex-col gap-5 pb-12 min-h-[calc(100vh-8rem)]">
      {/* Title */}
      <div>
        <h1 className="text-[24px] font-black text-white tracking-tight">AI Calls</h1>
        <p className="text-[13px] mt-1 text-white/40 font-medium">Review Aiva receptionist call recordings, transcripts, and customer sentiment</p>
      </div>

      {/* Split-pane grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-stretch">
        
        {/* Left Side: Calls List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Outcome Filter */}
          <div className="flex flex-wrap gap-1.5 bg-white/[0.03] backdrop-blur-2xl p-2 border border-white/[0.08] rounded-xl">
            {['', 'booked', 'faq', 'transferred', 'missed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[#A66B8E] text-gray-900'
                    : 'text-white/40 hover:bg-white/5'
                }`}
              >
                {f === '' ? 'All' : outcomeConfig[f]?.label || f}
              </button>
            ))}
          </div>

          {/* Scrollable list */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-lg animate-shimmer" />
              ))
            ) : calls.length === 0 ? (
              <div className="text-center py-12 bg-white/[0.03] backdrop-blur-2xl rounded-xl border border-white/[0.08]">
                <p className="font-semibold text-white/40 text-xs">No calls recorded</p>
              </div>
            ) : (
              calls.map((call) => {
                const config = outcomeConfig[call.outcome] || outcomeConfig.unknown;
                const isSelected = selectedCall?.id === call.id;

                return (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white/[0.03] backdrop-blur-2xl border-[#A66B8E]/30'
                        : 'bg-white/[0.03] backdrop-blur-2xl border-white/[0.08] hover:border-white/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${config.bg} ${config.text} ${config.border} flex-shrink-0`}>
                      <config.icon size={14} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[13px] text-white truncate">
                          {call.customer_name || 'Unknown Caller'}
                        </h4>
                        <span className="text-[9px] text-white/30 font-semibold">
                          {new Date(call.call_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[9px] text-white/30 font-bold uppercase tracking-widest">
                        <span>{config.label}</span>
                        <span>{new Date(call.call_start).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Transcript & Intel Panel */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {selectedCall ? (
              <motion.div
                key={selectedCall.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col h-full min-h-[520px] justify-between"
              >
                
                {/* Header */}
                <div className="p-5 border-b border-white/[0.08] flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-[14px] text-white">{selectedCall.customer_name || 'Unknown Caller'}</h3>
                    <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest mt-0.5 flex items-center gap-2">
                      <span>Call #{selectedCall.id}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Clock size={10} /> {formatDuration(selectedCall.duration_seconds)}
                      </span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                    outcomeConfig[selectedCall.outcome]?.bg
                  } ${outcomeConfig[selectedCall.outcome]?.text} ${outcomeConfig[selectedCall.outcome]?.border}`}>
                    {selectedCall.outcome}
                  </span>
                </div>

                {/* Sub Split: Chat + Intel */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-10 divide-y md:divide-y-0 md:divide-x divide-white/5 items-stretch overflow-hidden">
                  
                  {/* Chat */}
                  <div className="md:col-span-6 p-5 overflow-y-auto max-h-[340px] space-y-3">
                    {selectedCall.transcript ? (
                      selectedCall.transcript.split('\n\n').map((block, idx) => {
                        const isAiva = block.startsWith('AI:');
                        return (
                          <div key={idx} className={`flex ${isAiva ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[85%] flex flex-col gap-1">
                              <span className={`text-[8px] font-bold uppercase tracking-widest px-1 ${
                                isAiva ? 'text-[#A66B8E] text-right' : 'text-white/30'
                              }`}>
                                {isAiva ? 'Aiva AI' : 'Customer'}
                              </span>
                              <div
                                className={`px-3 py-2 rounded-2xl text-[12px] leading-relaxed border ${
                                  isAiva
                                    ? 'bg-[#A66B8E]/10 text-white border-[#A66B8E]/10 rounded-tr-none'
                                    : 'bg-[#120B0F] text-white/70 border-white/[0.08] rounded-tl-none'
                                }`}
                              >
                                {block.replace(/^(AI|Customer):\s*/, '')}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div className="space-y-2">
                          <AlertTriangle size={20} className="text-rose-400 mx-auto" />
                          <p className="text-xs text-white/40 font-semibold">No audio transcript recorded for this call.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Intel Panel */}
                  <div className="md:col-span-4 p-5 bg-[#120B0F] space-y-5 overflow-y-auto">
                    <div>
                      <span className="block text-[8px] text-white/25 font-bold uppercase tracking-widest">Customer Intent</span>
                      <span className="text-[12px] font-bold text-white mt-1 block">
                        {getCallMetadata(selectedCall).intent}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[8px] text-white/25 font-bold uppercase tracking-widest">Sentiment Analysis</span>
                      <span className="text-[12px] font-bold text-[#A66B8E] mt-1 block flex items-center gap-1">
                        <Sparkles size={11} /> {getCallMetadata(selectedCall).sentiment}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[8px] text-white/25 font-bold uppercase tracking-widest">Operational Action</span>
                      <p className="text-[11px] text-white/40 mt-1.5 font-medium leading-relaxed">
                        {getCallMetadata(selectedCall).action}
                      </p>
                    </div>

                    {selectedCall.transfer_reason && (
                      <div className="pt-3 border-t border-white/[0.08]">
                        <span className="block text-[8px] text-rose-400 font-bold uppercase tracking-widest">Escalation Reason</span>
                        <p className="text-[11px] text-white/40 mt-1 font-bold italic leading-relaxed">
                          "{selectedCall.transfer_reason}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer audio player */}
                {selectedCall.recording_url && (
                  <div className="p-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-full bg-[#A66B8E] hover:bg-[#B882A2] text-gray-900 flex items-center justify-center transition-all cursor-pointer"
                    >
                      {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                    </button>
                    <div className="flex-1 flex items-center gap-2">
                      <Volume2 size={12} className="text-white/30" />
                      <div className="h-4 flex-1 flex items-center gap-[3px]">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-[2px] rounded-full transition-all ${
                              isPlaying ? 'bg-[#A66B8E]' : 'bg-white/10'
                            }`}
                            style={{
                              height: `${Math.max(10, Math.sin(i * 0.5) * 100 * (isPlaying ? Math.random() : 0.2))}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white/25">
                      {isPlaying ? '0:24' : '0:00'} / {formatDuration(selectedCall.duration_seconds)}
                    </span>
                  </div>
                )}

              </motion.div>
            ) : (
              <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08] p-8 h-full flex items-center justify-center text-center text-white/30 text-xs font-semibold">
                Select a call from the list to view dialogue insights.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
