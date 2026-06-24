/**
 * Aiva — Settings Page
 * Premium Matte Black OS aesthetic.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Clock, Bot, Bell, Shield, HelpCircle, Save } from 'lucide-react';

const tabs = [
  { id: 'business', label: 'Business Profile', icon: Building2 },
  { id: 'hours', label: 'Hours of Operation', icon: Clock },
  { id: 'ai', label: 'Aiva Config', icon: Bot },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Security & Account', icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [notifications, setNotifications] = useState({
    sms: true,
    whatsapp: false,
    rem_24h: true,
    rem_2h: true,
    followup: false,
    email: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const inputStyle = "w-full px-4 py-3 bg-[#120B0F] border border-white/10 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-[#A66B8E]/50 focus:border-[#A66B8E]/50 text-white transition-all placeholder:text-white/30 shadow-inner";
  const labelStyle = "block text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-fade-in-up">
      {/* Title */}
      <div className="pl-2">
        <h1 className="text-[32px] font-black text-white tracking-tight leading-tight">Settings</h1>
        <p className="text-[15px] font-medium text-white/60 mt-1 max-w-xl">
          Manage and configure your business environment settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Navigation Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] p-4 shadow-2xl">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all whitespace-nowrap cursor-pointer relative w-full text-left group"
                  style={{
                    color: isActive ? '#A66B8E' : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSettingTab"
                      className="absolute inset-0 bg-[#120B0F] border border-white/10 rounded-2xl shadow-inner"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <tab.icon size={18} className={`z-10 ${isActive ? 'text-[#A66B8E]' : 'text-white/40 group-hover:text-white/80'}`} />
                  <span className={`z-10 tracking-wide ${isActive ? 'text-white' : 'group-hover:text-white/80'}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tab Form Panel */}
        <div className="flex-1 w-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] p-8 md:p-10 shadow-2xl">
          {/* Business Profile Tab */}
          {activeTab === 'business' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-[20px] font-bold text-white tracking-tight">Business Profile</h3>
                <p className="text-[13px] text-white/40 font-medium mt-1">Update public business details and information</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className={labelStyle}>Business Name</label>
                  <input type="text" defaultValue="Snip & Streak" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Phone Number</label>
                  <input type="tel" defaultValue="+91 98450 12345" className={inputStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelStyle}>Office Address</label>
                  <input type="text" defaultValue="JP Nagar 7th Phase, Bangalore" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Operating Timezone</label>
                  <select className={inputStyle}>
                    <option>Asia/Kolkata</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.08] flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-gray-900 bg-[#A66B8E] hover:bg-[#B882A2] shadow-lg shadow-[#A66B8E]/20 transition-all cursor-pointer">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Hours of Operation Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-[20px] font-bold text-white tracking-tight">Hours of Operation</h3>
                <p className="text-[13px] text-white/40 font-medium mt-1">Set the daily opening times of your shop</p>
              </div>

              <div className="space-y-4 pt-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center gap-6 p-4 bg-[#120B0F] border border-white/[0.08] rounded-2xl">
                    <span className="w-24 text-[14px] font-bold text-white/80">{day}</span>
                    <input type="time" defaultValue={day === 'Sunday' ? '' : day === 'Saturday' ? '10:00' : '09:00'} className="px-4 py-2 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-xl text-[14px] font-semibold text-white focus:outline-none" />
                    <span className="text-[12px] text-white/40 font-bold uppercase tracking-widest">to</span>
                    <input type="time" defaultValue={day === 'Sunday' ? '' : day === 'Saturday' ? '16:00' : '17:00'} className="px-4 py-2 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-xl text-[14px] font-semibold text-white focus:outline-none" />
                    <label className="flex items-center gap-3 ml-auto cursor-pointer">
                      <input type="checkbox" defaultChecked={day !== 'Sunday'} className="w-5 h-5 rounded border-white/20 bg-white/[0.03] backdrop-blur-2xl text-[#A66B8E] focus:ring-[#A66B8E] focus:ring-offset-0" />
                      <span className="text-[13px] text-white/60 font-bold uppercase tracking-widest">Open</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/[0.08] flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-gray-900 bg-[#A66B8E] hover:bg-[#B882A2] shadow-lg shadow-[#A66B8E]/20 transition-all cursor-pointer">
                  <Save size={16} /> Save Hours
                </button>
              </div>
            </div>
          )}

          {/* Aiva configuration Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-[20px] font-bold text-white tracking-tight">Aiva Receptionist Configuration</h3>
                <p className="text-[13px] text-white/40 font-medium mt-1">Customize greeting responses and voice settings</p>
              </div>

              <div className="space-y-8 pt-4">
                <div>
                  <label className={labelStyle}>Greeting Message</label>
                  <textarea
                    rows={3}
                    defaultValue="Hello! Thank you for calling Snip & Streak. I am Aiva, how can I help you today?"
                    className="w-full px-4 py-4 bg-[#120B0F] border border-white/10 rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-[#A66B8E]/50 focus:border-[#A66B8E]/50 text-white transition-all placeholder:text-white/30 resize-none leading-relaxed shadow-inner"
                  />
                  <p className="text-[11px] text-white/40 font-semibold mt-2 flex items-center gap-1.5">
                    <HelpCircle size={14} /> This is the introductory greeting Aiva will speak when answering a call.
                  </p>
                </div>

                <div>
                  <label className={labelStyle}>Voice Integration Provider</label>
                  <div className="flex gap-4">
                    {['Vapi AI', 'Retell AI'].map((provider) => (
                      <button
                         key={provider}
                         className={`flex-1 py-4 px-4 rounded-xl text-[14px] font-bold transition-all border text-center cursor-pointer ${
                           provider === 'Vapi AI'
                             ? 'bg-[#A66B8E]/10 border-[#A66B8E]/30 text-[#A66B8E] shadow-inner'
                             : 'bg-[#120B0F] border-white/[0.08] text-white/40 hover:bg-white/[0.02]'
                         }`}
                      >
                         {provider}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>FAQ Knowledge Base</label>
                  <div className="space-y-4">
                    {[
                      { q: 'What are your operational hours?', a: "We are open Monday through Friday 9:00 AM to 5:00 PM, and Saturday 10:00 AM to 4:00 PM." },
                      { q: 'Do you accept walk-ins?', a: 'Yes, we accept walk-in clients, but booking an appointment is recommended.' },
                    ].map((faq, i) => (
                      <div key={i} className="p-5 bg-[#120B0F] border border-white/[0.08] rounded-2xl">
                        <p className="text-[14px] font-bold text-white">Q: {faq.q}</p>
                        <p className="text-[14px] mt-2 text-white/60 font-medium leading-relaxed">A: {faq.a}</p>
                      </div>
                    ))}
                    <button className="px-4 py-2.5 rounded-xl text-[12px] font-bold bg-[#A66B8E]/10 text-[#A66B8E] hover:bg-[#A66B8E]/20 transition-colors cursor-pointer border border-[#A66B8E]/20">
                      + Add FAQ Item
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.08] flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-gray-900 bg-[#A66B8E] hover:bg-[#B882A2] shadow-lg shadow-[#A66B8E]/20 transition-all cursor-pointer">
                  <Save size={16} /> Save Aiva Config
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-[20px] font-bold text-white tracking-tight">Notification Settings</h3>
                <p className="text-[13px] text-white/40 font-medium mt-1">Toggle automated messages and template dispatches</p>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  { key: 'sms' as const, label: 'SMS Confirmations', desc: 'Dispatch instant SMS confirmations after bookings' },
                  { key: 'whatsapp' as const, label: 'WhatsApp Messages', desc: 'Dispatch confirmation threads via WhatsApp' },
                  { key: 'rem_24h' as const, label: '24-Hour Reminders', desc: 'Send automated reminders 24 hours prior to appointment' },
                  { key: 'rem_2h' as const, label: '2-Hour Reminders', desc: 'Send quick reminders 2 hours prior to appointment' },
                  { key: 'followup' as const, label: 'Post-Visit Follow-Up', desc: 'Dispatch feedback requests 24 hours after visits' },
                  { key: 'email' as const, label: 'Email Confirmations', desc: 'Send copies of invoices and bookings via Email' },
                ].map((item) => {
                  const enabled = notifications[item.key];
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-5 bg-[#120B0F] border border-white/[0.08] rounded-2xl shadow-inner"
                    >
                      <div>
                        <h4 className="text-[14px] font-bold text-white">{item.label}</h4>
                        <p className="text-[12px] text-white/40 font-medium mt-1">{item.desc}</p>
                      </div>
                      
                      {/* Premium iOS-style Switch Toggle */}
                      <button
                        onClick={() => toggleNotification(item.key)}
                        className={`w-12 h-7 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                          enabled ? 'bg-[#A66B8E]' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${
                            enabled ? 'translate-x-5 bg-gray-900' : 'translate-x-0 bg-white/60'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Account and Security Tab */}
          {activeTab === 'account' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-[20px] font-bold text-white tracking-tight">Security & Account</h3>
                <p className="text-[13px] text-white/40 font-medium mt-1">Manage credentials, passwords, and authorization</p>
              </div>

              <div className="space-y-8 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Full Name</label>
                    <input type="text" defaultValue="Owner" className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Email Address</label>
                    <input type="email" defaultValue="admin@snipandstreak.com" className={inputStyle} />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/[0.08]">
                  <h4 className="text-[13px] font-bold text-white/60 uppercase tracking-widest mb-6">Change Password</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelStyle}>Current Password</label>
                      <input type="password" placeholder="••••••••" className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>New Password</label>
                      <input type="password" placeholder="••••••••" className={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.08] flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-gray-900 bg-[#A66B8E] hover:bg-[#B882A2] shadow-lg shadow-[#A66B8E]/20 transition-all cursor-pointer">
                  <Save size={16} /> Save Profile Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
