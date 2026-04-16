"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Activity, Zap, Clock, X, ChevronRight } from "lucide-react";

export function ChartsOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"performance" | "activity" | "skills">("activity");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[800px] h-[60vh] bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">Developer Analytics</h2>
                <p className="text-[11px] text-slate-500">Real-time learning insights and performance data</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar nav for charts */}
            <div className="w-48 border-r border-white/5 bg-black/20 p-4 space-y-2">
              {[
                { id: "activity", icon: Activity, label: "Weekly Activity" },
                { id: "performance", icon: Zap, label: "Code Performance" },
                { id: "skills", icon: Clock, label: "Learning Hours" },
              ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                     activeTab === tab.id 
                       ? "bg-accent/10 text-accent border border-accent/20" 
                       : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
                   }`}
                 >
                   <div className="flex items-center gap-2">
                     <tab.icon className="w-4 h-4" />
                     <span>{tab.label}</span>
                   </div>
                   {activeTab === tab.id && <ChevronRight className="w-3 h-3" />}
                 </button>
              ))}
            </div>

            {/* Display Chart */}
            <div className="flex-1 p-8 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
              
              {activeTab === "activity" && (
                <div className="w-full h-full flex flex-col justify-end gap-3 px-8 pb-4">
                  <div className="flex justify-between items-end h-48 w-full gap-2">
                    {[35, 60, 20, 85, 45, 95, 70].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3">
                         <div className="w-full flex justify-center h-full items-end group">
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${h}%` }}
                             transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                             className="w-12 bg-gradient-to-t from-accent/20 to-accent rounded-t-sm relative group-hover:from-accent/40 group-hover:to-accent/80 transition-all cursor-pointer"
                           >
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-white">
                               {h}%
                             </div>
                           </motion.div>
                         </div>
                         <span className="text-[10px] font-bold text-slate-500">
                           {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                         </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "performance" && (
                <div className="w-full flex items-center justify-center gap-12">
                   {/* Cool Circular Progress UI */}
                   {[
                     { label: "Code Quality", value: 92, color: "text-emerald-400" },
                     { label: "Avg. Latency", value: 45, color: "text-blue-400", suffix: "ms" },
                     { label: "Refactors", value: 12, color: "text-purple-400", suffix: "" }
                   ].map((stat, i) => (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        key={i} 
                        className="flex flex-col items-center gap-4"
                      >
                         <div className="relative w-32 h-32 flex items-center justify-center">
                           <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                              <motion.circle 
                                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                                strokeDasharray="283"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * (stat.value > 100 ? 100 : stat.value)) / 100 }}
                                transition={{ duration: 1, ease: "easeOut", delay: i * 0.2 + 0.3 }}
                                className={stat.color}
                                strokeLinecap="round"
                              />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className="text-2xl font-bold font-mono text-white">
                                {stat.value}{stat.suffix}
                              </span>
                           </div>
                         </div>
                         <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</span>
                      </motion.div>
                   ))}
                </div>
              )}

              {activeTab === "skills" && (
                 <div className="w-full h-full flex flex-col justify-center px-12 gap-6">
                    {[
                      { skill: "React Fundamentals", progress: 85 },
                      { skill: "Advanced TypeScript", progress: 62 },
                      { skill: "System Architecture", progress: 40 },
                      { skill: "Performance Optimization", progress: 78 }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-300">{item.skill}</span>
                          <span className="font-mono text-accent">{item.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: \`\${item.progress}%\` }}
                             transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                             className="h-full bg-accent relative"
                           >
                             <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                           </motion.div>
                        </div>
                      </div>
                    ))}
                 </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
