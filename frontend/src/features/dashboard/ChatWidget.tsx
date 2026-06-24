import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Volume2, VolumeX } from 'lucide-react';
import { chatAPI } from '../../lib/api';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Aiva. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatAPI.send({
        messages: newMessages,
        generate_audio: audioEnabled
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);

      if (response.audio_base64 && audioEnabled) {
        const audio = new Audio(`data:audio/wav;base64,${response.audio_base64}`);
        audio.play().catch(err => console.error("Audio play failed", err));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I ran into an issue connecting to my systems. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-[#110B10]/95 backdrop-blur-3xl rounded-[24px] shadow-2xl border border-white/10 flex flex-col overflow-hidden z-50 animate-fade-in-up">
      {/* Header */}
      <div className="h-16 border-b border-white/[0.08] flex items-center justify-between px-5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#A66B8E]/20 flex items-center justify-center text-[#A66B8E]">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-white font-bold text-[14px]">Chat with Aiva</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Local LLM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${audioEnabled ? 'bg-[#A66B8E]/20 text-[#A66B8E]' : 'bg-white/5 text-white/40 hover:text-white'}`}
            title={audioEnabled ? "Voice Output On" : "Voice Output Off"}
          >
            {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-white/10 text-white/60' : 'bg-[#A66B8E]/20 text-[#A66B8E]'}`}>
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className={`p-3 rounded-[16px] text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-white/10 text-white rounded-tr-sm' : 'bg-white/[0.03] border border-white/[0.05] text-white/80 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-[#A66B8E]/20 flex items-center justify-center shrink-0 mt-1 text-[#A66B8E]">
                <Bot size={12} />
              </div>
              <div className="p-3 rounded-[16px] bg-white/[0.03] border border-white/[0.05] rounded-tl-sm flex items-center">
                <Loader2 size={14} className="text-[#A66B8E] animate-spin" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/[0.02] border-t border-white/[0.08]">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aiva anything..."
            className="w-full bg-[#110B10] border border-white/10 rounded-[14px] pl-4 pr-12 py-3.5 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#A66B8E]/50 focus:ring-1 focus:ring-[#A66B8E]/50 transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#A66B8E] text-white flex items-center justify-center hover:bg-[#B882A2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
