"use client";

import React from "react";
import { 
  Code2, 
  Upload, 
  History, 
  Settings, 
  Search, 
  Monitor, 
  BookMarked 
} from "lucide-react";
import { useApp } from "@/providers/AppContext";
import { LanguagePicker } from "./LanguagePicker";

export function TopBar() {
  const { state, dispatch } = useApp();

  return (
    <header className="h-14 border-b border-white/10 glass px-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Code2 className="text-black w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">CODE MENTOR</span>
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
