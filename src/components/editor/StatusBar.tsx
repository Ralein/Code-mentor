"use client";

import React from "react";
import { useApp } from "@/providers/AppContext";
import { Cpu, Layers, MousePointer2, FileText } from "lucide-react";

export function StatusBar() {
  const { state } = useApp();
  
  const lineCount = state.code ? state.code.split("\n").length : 0;
  const charCount = state.code ? state.code.length : 0;

  return (
    <footer className="h-6 border-t border-white/5 bg-[#050505] flex items-center justify-between px-3 text-[10px] text-slate-500 z-10 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors cursor-default">
          <Layers className="w-3 h-3 text-accent/70" />
          <span className="uppercase tracking-widest font-bold">{state.language}</span>
        </div>
        
        <div className="flex items-center gap-1.5 cursor-default group">
          <FileText className="w-3 h-3 group-hover:text-accent transition-colors" />
          <span>{lineCount} lines</span>
        </div>

        <div className="flex items-center gap-1.5 cursor-default group">
          <MousePointer2 className="w-3 h-3 group-hover:text-accent transition-colors" />
          <span>{charCount} chars</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 cursor-default">
          <Cpu className="w-3 h-3 text-blue-400" />
          <span>Groq v3</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 uppercase tracking-tighter font-bold">
            <span className="text-slate-600">Mode:</span>
            <span className="text-accent">{state.mode}</span>
          </div>
          
          <div className="h-3 w-[1px] bg-white/10" />
          
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-slate-400">Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
