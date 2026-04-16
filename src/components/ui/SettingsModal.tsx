import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Type, AlignLeft } from "lucide-react";
import { useApp } from "@/providers/AppContext";

export function SettingsModal() {
  const { state, dispatch } = useApp();

  if (!state.isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch({ type: "SET_SETTINGS_OPEN", payload: false })}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Settings</h2>
            <button
              onClick={() => dispatch({ type: "SET_SETTINGS_OPEN", payload: false })}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Theme Settings Pseudo-element */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Editor Theme</h3>
                    <p className="text-[10px] text-slate-500">Choose your workspace appearance</p>
                  </div>
                </div>
                <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                  <button className="px-3 py-1 text-[10px] font-bold rounded bg-white/10 text-white">Dark</button>
                  <button className="px-3 py-1 text-[10px] font-bold rounded text-slate-500 hover:text-slate-300 transition-colors cursor-not-allowed">Light</button>
                </div>
              </div>

              {/* Font Size Pseudo-element */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Font Size</h3>
                    <p className="text-[10px] text-slate-500">Editor text size scaling</p>
                  </div>
                </div>
                <select className="bg-black/50 border border-white/10 text-slate-300 text-[11px] rounded-md px-2 py-1 outline-none">
                  <option>12px</option>
                  <option selected>14px</option>
                  <option>16px</option>
                  <option>18px</option>
                </select>
              </div>

              {/* Word Wrap Pseudo-element */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                    <AlignLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Word Wrap</h3>
                    <p className="text-[10px] text-slate-500">Wrap long lines of code automatically</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={() => dispatch({ type: "SET_SETTINGS_OPEN", payload: false })}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors border border-white/5"
              >
                Close Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
