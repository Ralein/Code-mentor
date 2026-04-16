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

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (!reader) throw new Error("Could not initialize stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") break;
            try {
              const { content } = JSON.parse(dataStr);
              accumulatedText += content;

              // Partial updates for streaming feel
              const parsed = {
                plainEnglish: accumulatedText.match(/\[PLAIN ENGLISH\]\n?([\s\S]*?)(?=\n?\[|$)/)?.[1]?.trim(),
                deepDive: accumulatedText.match(/\[DEEP DIVE\]\n?([\s\S]*?)(?=\n?\[|$)/)?.[1]?.trim(),
                example: accumulatedText.match(/\[LIVE EXAMPLE\]\n?([\s\S]*?)(?=\n?\[|$)/)?.[1]?.trim(),
              };
              
              setData(parsed);
              setIsStreaming(false); // We hide skeletons as soon as we have any content
            } catch (e) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }
      
      dispatch({ type: "SET_ACTIVE_EXPLANATION", payload: accumulatedText });
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
          {(!data?.plainEnglish && !error) ? (
            <motion.div key="skeletons" variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
              <Skeleton height="40px" />
              <Skeleton height="80px" />
            </motion.div>
          ) : error ? (
            <motion.div key="error" className="py-4 text-center">
              <ShieldAlert className="w-8 h-8 text-red-500/50 mx-auto mb-2" />
              <p className="text-xs text-red-400">{error}</p>
              <button onClick={() => fetchExplanation()} className="mt-2 text-[10px] text-accent font-bold uppercase tracking-widest">Retry</button>
            </motion.div>
          ) : data ? (
            <motion.div key="content" variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
              {data.plainEnglish && (
                <motion.section variants={itemVariants} className="space-y-2">
                  <p className="text-[11px] text-white font-medium leading-relaxed bg-accent/5 p-3 rounded-xl border border-accent/10 shadow-[inner_0_0_20px_rgba(224,255,79,0.05)]">
                    {data.plainEnglish}
                  </p>
                </motion.section>
              )}

              {data.deepDive && (
                <motion.section variants={itemVariants} className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                     <Terminal className="w-3 h-3 text-purple-400" />
                     <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Deep Dive Analysis</h4>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                      {data.deepDive}
                    </p>
                  </div>
                </motion.section>
              )}

              {data.example && (
                <motion.section variants={itemVariants} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                       <Lightbulb className="w-3 h-3 text-amber-400" />
                       <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Pro Implementation</h4>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(data.example);
                        toast.success("Solution copied");
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-md transition-colors group"
                    >
                      <Copy className="w-3 h-3 text-slate-600 group-hover:text-white" />
                    </button>
                  </div>
                  <pre className="bg-black/80 p-3 rounded-xl border border-white/5 text-[9px] font-mono text-accent/90 overflow-x-auto shadow-xl">
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
