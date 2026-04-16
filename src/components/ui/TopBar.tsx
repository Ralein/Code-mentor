"use client";

import React, { useState } from "react";
import { 
  Code2, 
  Upload, 
  History, 
  Settings, 
  Search, 
  Monitor, 
  BookMarked,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/providers/AppContext";
import { LanguagePicker } from "./LanguagePicker";

export function TopBar() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="h-14 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(224,255,79,0.4)]">
              <Zap className="w-5 h-5 text-black fill-current" />
            </div>
            {state.isStreaming && (
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-[-4px] border-2 border-accent rounded-xl"
              />
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tighter text-white font-heading leading-tight italic">
              CODE MENTOR
            </h1>
            <div className="flex items-center gap-1.5 leading-none">
              <div className={`w-1.5 h-1.5 rounded-full ${state.isStreaming ? "bg-accent animate-pulse" : "bg-slate-700"}`} />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                {state.isStreaming ? "Mentor is thinking..." : "System Ready"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="h-6 w-[1px] bg-white/10 mx-2" />
        
        <LanguagePicker />
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => {}} // open command palette logic
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-all group"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search or command...</span>
          <kbd className="ml-2 px-1.5 py-0.5 rounded bg-black/50 border border-white/10 border-b-2 font-mono text-[10px]">⌘K</kbd>
        </button>

        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-accent hover:bg-white/5 rounded-md transition-all">
            <Upload className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-accent hover:bg-white/5 rounded-md transition-all">
            <BookMarked className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-accent hover:bg-white/5 rounded-md transition-all">
            <History className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-accent hover:bg-white/5 rounded-md transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
