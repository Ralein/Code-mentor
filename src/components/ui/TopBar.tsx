"use client";

import React, { useState, useMemo } from "react";
import { 
  Upload, 
  History, 
  Settings, 
  Search, 
  BookMarked,
  Zap,
  ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/providers/AppContext";
import { LanguagePicker } from "./LanguagePicker";

export function TopBar() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const isMismatch = useMemo(() => {
    if (!state.code) return false;
    const isPython = state.code.includes("def ") || state.code.includes("import ") && !state.code.includes("from '");
    const isJS = state.code.includes("const ") || (state.code.includes("function ") && !state.code.includes("def "));
    
    if (isPython && state.language === "javascript") return true;
    if (isJS && state.language === "python") return true;
    return false;
  }, [state.code, state.language]);

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
        
        <div className="flex items-center gap-3">
          <LanguagePicker />
          {isMismatch && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400"
             >
               <ShieldAlert className="w-3 h-3" />
               <span className="text-[8px] font-bold uppercase tracking-tighter">Mode Mismatch</span>
             </motion.div>
          )}
        </div>
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
