"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { ExplanationPanel } from "@/components/explanation/ExplanationPanel";
import { StatusBar } from "@/components/editor/StatusBar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);

  return (
    <main className="flex flex-col h-screen bg-black overflow-hidden font-sans">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - File Tree & History */}
        <AnimatePresence initial={false}>
          {isLeftSidebarOpen && (
            <motion.aside
              key="left-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-r border-white/10 bg-[#0a0a0a] overflow-hidden flex flex-col"
            >
              <LeftSidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Central Area - Editor */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0d0d0d]">
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
          <StatusBar />
        </div>

        {/* Right Sidebar - AI Explanations */}
        <AnimatePresence initial={false}>
          {isRightSidebarOpen && (
            <motion.aside
              key="right-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-l border-white/10 glass overflow-hidden flex flex-col"
            >
              <ExplanationPanel />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Toggle Buttons for Sidebars (Responsive/UX) */}
      <button 
        onClick={() => setLeftSidebarOpen(!isLeftSidebarOpen)}
        className={`absolute bottom-10 left-4 z-50 p-2 rounded-full glass border border-white/10 text-slate-400 hover:text-accent transition-all ${isLeftSidebarOpen ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
      >
        <span className="text-[10px] font-bold">FILES</span>
      </button>
      
      <button 
        onClick={() => setRightSidebarOpen(!isRightSidebarOpen)}
        className={`absolute bottom-10 right-4 z-50 p-2 rounded-full glass border border-white/10 text-slate-400 hover:text-accent transition-all ${isRightSidebarOpen ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
      >
        <span className="text-[10px] font-bold">AI</span>
      </button>

      <CommandPalette />
    </main>
  );
}
