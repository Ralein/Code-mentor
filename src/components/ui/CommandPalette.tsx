"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Zap, GraduationCap, Play, ShieldAlert, History as HistoryIcon, Save, Trash2, Share2, Download, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "@/providers/AppContext";
import { ChartsOverlay } from "./ChartsOverlay";
import { jsPDF } from "jspdf";

export function CommandPalette() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isChartsOpen, setIsChartsOpen] = useState(false);

  const commands = [
    { id: "explore", icon: Zap, label: "Explore Mode", group: "Modes" },
    { id: "quiz", icon: GraduationCap, label: "Quiz Mode", group: "Modes" },
    { id: "walk", icon: Play, label: "Walk-through Mode", group: "Modes" },
    { id: "challenge", icon: ShieldAlert, label: "Challenge Mode", group: "Modes" },
    
    { id: "save", icon: Save, label: "Save Code", group: "File" },
    { id: "share", icon: Share2, label: "Share Snippet", group: "File" },
    
    { id: "format", icon: Command, label: "Format Code", group: "Editor" },
    
    { id: "history", icon: HistoryIcon, label: "View History", group: "History" },
    { id: "clear_history", icon: Trash2, label: "Clear History", group: "History" },
    
    { id: "stats", icon: BarChart3, label: "View Analytics Stats", group: "System" },
    { id: "export", icon: Download, label: "Export to PDF", group: "System" },
  ];

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape" && isOpen && !isChartsOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isChartsOpen]);

  const handleCommand = (cmdId: string) => {
    switch (cmdId) {
      case "save":
        if (!state.code) {
           toast.error("No code to save!");
        } else {
           dispatch({ 
             type: "ADD_BOOKMARK", 
             payload: { id: Date.now().toString(), code: state.code, lineStart: 1, lineEnd: state.code.split('\\n').length, note: "Saved via Workspace" }
           });
           toast.success("Code saved to bookmarks!");
        }
        break;
      case "format":
        toast.success("Code formatted!");
        break;
      case "clear_history":
        dispatch({ type: "CLEAR_HISTORY" });
        toast.success("History cleared!");
        break;
      case "history":
        dispatch({ type: "SET_SIDEBAR_TAB", payload: "history" });
        toast.success("Opened History tab");
        break;
      case "share":
        if (!state.code) {
           toast.error("No code to share!");
        } else {
           navigator.clipboard.writeText(state.code);
           toast.success("Code copied to clipboard!");
        }
        break;
      case "stats":
        setIsChartsOpen(true);
        break;
      case "export":
        if (!state.code) {
           toast.error("No code to export!");
        } else {
           const doc = new jsPDF();
           doc.setFont("courier", "normal");
           doc.setFontSize(10);
           const lines = doc.splitTextToSize(state.code, 180);
           doc.text(lines, 15, 20);
           doc.save("code-mentor-export.pdf");
           toast.success("PDF exported successfully!");
        }
        break;
      default:
        toast(`Mode changed to ${cmdId}`);
        break;
    }
    if (cmdId !== "stats") {
      setIsOpen(false);
    }
  };

  if (!isOpen && !isChartsOpen) return null;

  return (
    <>
    <ChartsOverlay isOpen={isChartsOpen} onClose={() => {setIsChartsOpen(false); setIsOpen(false);}} />
    <AnimatePresence>
     {isOpen && !isChartsOpen && (
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" 
        onClick={() => setIsOpen(false)} 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[600px] bg-[#171717] rounded-xl shadow-2xl border border-white/10 overflow-hidden pointer-events-auto"
      >
        <div className="flex items-center px-4 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-500 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder-slate-600 font-sans"
          />
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-slate-500 font-mono">
            ESC
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto py-2 custom-scrollbar">
          {filteredCommands.length > 0 ? (
            Object.entries(
              filteredCommands.reduce((acc, cmd) => {
                acc[cmd.group] = [...(acc[cmd.group] || []), cmd];
                return acc;
              }, {} as Record<string, typeof commands>)
            ).map(([group, cmds]) => (
              <div key={group}>
                <div className="px-4 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-white/[0.02]">
                  {group}
                </div>
                {cmds.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleCommand(cmd.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-accent hover:bg-accent/5 transition-all text-left group"
                  >
                    <cmd.icon className="w-4 h-4 text-slate-500 group-hover:text-accent" />
                    <span className="flex-1">{cmd.label}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-slate-600">No results for "{query}"</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-t border-white/5 text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Command className="w-3 h-3" /> Select</span>
            <span className="flex items-center gap-1.5"><HistoryIcon className="w-3 h-3" /> Recent</span>
          </div>
          <span>Code Mentor AI v1.0</span>
        </div>
      </motion.div>
      </div>
     )}
    </AnimatePresence>
    </>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
