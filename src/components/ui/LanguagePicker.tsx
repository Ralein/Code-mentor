"use client";

import React, { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useApp } from "@/providers/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "rust", name: "Rust" },
  { id: "go", name: "Go" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "ruby", name: "Ruby" },
  { id: "swift", name: "Swift" },
  { id: "sql", name: "SQL" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
  { id: "yaml", name: "YAML" },
  { id: "bash", name: "Bash" },
];

export function LanguagePicker() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.id === state.language) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
      >
        <Globe className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          {currentLang.name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-0 mt-2 w-48 py-1 glass rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      dispatch({ type: "SET_LANGUAGE", payload: lang.id });
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      state.language === lang.id 
                        ? "bg-accent/10 text-accent font-medium" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {lang.name}
                    {state.language === lang.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
