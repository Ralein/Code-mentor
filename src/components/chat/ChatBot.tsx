"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  X, 
  Minimize2, 
  Zap, 
  Loader2, 
  Trash2,
  Sparkles
} from "lucide-react";
import { useApp } from "@/providers/AppContext";
import { toast } from "react-hot-toast";

export function ChatBot() {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    dispatch({ type: "SEND_MESSAGE", payload: userMessage });
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...state.messages, userMessage],
          context: {
            code: state.code,
            language: state.language,
            line: state.selectedRange
          }
        }),
      });

      if (!response.ok) throw new Error("Failed to reach mentor");

      const data = await response.json();
      dispatch({ 
        type: "SEND_MESSAGE", 
        payload: { role: "assistant", content: data.message } 
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => dispatch({ type: "SET_CHAT_OPEN", payload: !state.isChatOpen })}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-[0_0_25px_rgba(224,255,79,0.4)] hover:scale-110 transition-transform active:scale-95 group"
      >
        {state.isChatOpen ? (
          <Minimize2 className="w-6 h-6 text-black" />
        ) : (
          <MessageSquare className="w-6 h-6 text-black group-hover:animate-bounce" />
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {state.isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden glass"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Mentor Chat</h3>
                  <div className="flex items-center gap-1.5 leading-none">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Always Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => dispatch({ type: "CLEAR_MESSAGES" })}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => dispatch({ type: "SET_CHAT_OPEN", payload: false })}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20"
            >
              {state.messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                  <Zap className="w-12 h-12 mb-4 text-accent" />
                  <p className="text-sm font-mono tracking-tight">Ask me anything about your code, or highlight a line for specific analysis.</p>
                </div>
              )}
              {state.messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-accent text-black font-medium" 
                      : "bg-white/5 border border-white/10 text-slate-300"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSendMessage}
              className="p-4 border-t border-white/10 bg-black/40"
            >
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the mentor..."
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-accent/50 transition-all placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-accent text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
