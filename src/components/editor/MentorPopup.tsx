"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Terminal, 
  Lightbulb, 
  BookOpen, 
  Copy, 
  ShieldAlert,
  Loader2,
  BookmarkPlus
} from "lucide-react";
import { useApp } from "@/providers/AppContext";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";

interface MentorPopupProps {
  position: { x: number, y: number };
  onClose: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: {
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function MentorPopup({ position, onClose }: MentorPopupProps) {
  const { state, dispatch } = useApp();
  const [data, setData] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.selectedRange) {
      fetchExplanation();
    }
  }, [state.selectedRange]);

  const fetchExplanation = async () => {
    if (!state.code || !state.selectedRange) return;
    
    setIsStreaming(true);
    setError(null);
    setData(null);

    try {
      const resp = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: state.code,
          language: state.language,
          lineStart: state.selectedRange.start,
          lineEnd: state.selectedRange.end,
          mode: state.mode
        })
      });

      if (!resp.ok) throw new Error("Mentor connection lost");

      const raw = await resp.text();
      // Logic to parse the structured [LABEL] content
      const parsed = {
        preview: raw.match(/\[LINE PREVIEW\]\n([\s\S]*?)(?=\n\[|$)/)?.[1]?.trim(),
        plainEnglish: raw.match(/\[PLAIN ENGLISH\]\n([\s\S]*?)(?=\n\[|$)/)?.[1]?.trim(),
        deepDive: raw.match(/\[DEEP DIVE\]\n([\s\S]*?)(?=\n\[|$)/)?.[1]?.trim(),
        example: raw.match(/\[LIVE EXAMPLE\]\n([\s\S]*?)(?=\n\[|$)/)?.[1]?.trim(),
      };
      
      setData(parsed);
      dispatch({ type: "SET_ACTIVE_EXPLANATION", payload: parsed });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{ top: position.y, left: position.x }}
      className="absolute z-[60] w-[320px] bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Line {state.selectedRange?.start} Analysis</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-4">
        <AnimatePresence mode="wait">
          {isStreaming ? (
            <motion.div key="skeletons" variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
              <Skeleton height="40px" />
              <Skeleton height="80px" />
            </motion.div>
          ) : error ? (
            <motion.div key="error" className="py-4 text-center">
              <ShieldAlert className="w-8 h-8 text-red-500/50 mx-auto mb-2" />
              <p className="text-xs text-red-400">{error}</p>
              <button onClick={fetchExplanation} className="mt-2 text-[10px] text-accent font-bold uppercase tracking-widest">Retry</button>
            </motion.div>
          ) : data ? (
            <motion.div key="content" variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
              <motion.section variants={itemVariants} className="space-y-2">
                <p className="text-[11px] text-white font-medium leading-relaxed bg-accent/5 p-2 rounded-lg border border-accent/10">
                  {data.plainEnglish}
                </p>
              </motion.section>

              <motion.section variants={itemVariants} className="space-y-2">
                <div className="flex items-center gap-2">
                   <Terminal className="w-3 h-3 text-purple-400" />
                   <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Deep Dive</h4>
                </div>
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                  {data.deepDive}
                </p>
              </motion.section>

              {data.example && (
                <motion.section variants={itemVariants} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Lightbulb className="w-3 h-3 text-amber-400" />
                       <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Example</h4>
                    </div>
                    <button onClick={() => {
                        navigator.clipboard.writeText(data.example);
                        toast.success("Copied solution");
                    }}>
                      <Copy className="w-3 h-3 text-slate-600 hover:text-white transition-colors" />
                    </button>
                  </div>
                  <pre className="bg-black/60 p-2 rounded-lg border border-white/5 text-[9px] font-mono text-accent/80 overflow-x-auto">
                    <code>{data.example}</code>
                  </pre>
                </motion.section>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between">
        <button 
          onClick={() => {
            dispatch({ type: "ADD_BOOKMARK", payload: {
              id: Math.random().toString(36),
              code: state.code,
              lineStart: state.selectedRange!.start,
              lineEnd: state.selectedRange!.end,
              note: data?.plainEnglish || "Auto-saved explanation"
            }});
            toast.success("Saved for review");
          }}
          className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-accent transition-colors uppercase tracking-widest"
        >
          <BookmarkPlus className="w-3 h-3" />
          Save
        </button>
        <span className="text-[8px] text-slate-700 font-mono">CODE MENTOR LITE v1.0</span>
      </div>
    </motion.div>
  );
}
