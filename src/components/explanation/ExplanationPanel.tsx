"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "@/providers/AppContext";
import { 
  Sparkles, 
  BookOpen, 
  Terminal, 
  Lightbulb, 
  Link2, 
  ShieldAlert,
  Loader2,
  Copy,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/Skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface ExplanationData {
  plainEnglish: string;
  deepDive: string;
  example: string;
  relatedConcepts: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  linePreview: string;
}

export function ExplanationPanel() {
  const { state, dispatch } = useApp();
  const [data, setData] = useState<Partial<ExplanationData>>({});
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchExplanation = useCallback(async () => {
    if (!state.selectedRange || !state.code) return;

    // Reset state for new explanation
    setData({});
    setError(null);
    setIsStreaming(true);
    dispatch({ type: "SET_STREAMING", payload: true });

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: state.code,
          lineStart: state.selectedRange.start,
          lineEnd: state.selectedRange.end,
          language: state.language,
          mode: state.mode,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to fetch explanation");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();
            if (jsonStr === "[DONE]") break;
            
            try {
              const { content } = JSON.parse(jsonStr);
              fullContent += content;
              parseStreamingContent(fullContent);
            } catch (e) {
              // Silently handle partial JSON
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
        toast.error("Explanation failed to load");
      }
    } finally {
      setIsStreaming(false);
      dispatch({ type: "SET_STREAMING", payload: false });
    }
  }, [state.selectedRange, state.code, state.language, state.mode, dispatch]);

  const parseStreamingContent = (content: string) => {
    const sections = {
      linePreview: content.match(/\[LINE PREVIEW\]\n([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
      plainEnglish: content.match(/\[PLAIN ENGLISH\]\n([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
      deepDive: content.match(/\[DEEP DIVE\]\n([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
      example: content.match(/\[LIVE EXAMPLE\]\n([\s\S]*?)(?=\[|$)/)?.[1]?.trim(),
      difficulty: content.match(/\[DIFFICULTY\]\n([\s\S]*?)(?=\[|$)/)?.[1]?.trim() as any,
      relatedConcepts: content.match(/\[RELATED CONCEPTS\]\n([\s\S]*?)(?=\[|$)/)?.[1]?.split(",").map(s => s.trim()) || [],
    };
    setData(sections);
  };

  useEffect(() => {
    fetchExplanation();
  }, [state.selectedRange?.start, state.selectedRange?.end]);

  if (!state.selectedRange) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
        <Sparkles className="w-12 h-12 mb-4 text-accent animate-pulse" />
        <h3 className="text-sm font-bold uppercase tracking-widest mb-2 font-heading">Awaiting Selection</h3>
        <p className="text-xs max-w-[200px] leading-relaxed">
          Click any line in the editor to spark an AI mentoring session.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest">Mentor Analysis</span>
        </div>
        {data.difficulty && (
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            data.difficulty === "Beginner" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
            data.difficulty === "Intermediate" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
            "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {data.difficulty}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8">
        <AnimatePresence mode="wait">
          {isStreaming && !data.plainEnglish ? (
            <motion.div 
              key="skeletons"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton width="100px" height="12px" />
                  <Skeleton height="80px" rounded="rounded-xl" />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Plain English Section */}
              {data.plainEnglish && (
                <motion.section variants={itemVariants} className="space-y-3">
                  <div className="flex items-center gap-2 text-white">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Concept</h4>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed font-sans bg-white/5 p-4 rounded-xl border border-white/5">
                    {data.plainEnglish}
                  </div>
                </motion.section>
              )}

              {/* Deep Dive Section */}
              {data.deepDive && (
                <motion.section variants={itemVariants} className="space-y-3">
                  <div className="flex items-center gap-2 text-white">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Technical Breakdown</h4>
                  </div>
                  <div className="text-sm text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
                    {data.deepDive}
                  </div>
                </motion.section>
              )}

              {/* Code Example Section */}
              {data.example && (
                 <motion.section variants={itemVariants} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        <Lightbulb className="w-4 h-4 text-accent" />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider">Application</h4>
                      </div>
                      <button onClick={() => {
                        navigator.clipboard.writeText(data.example || "");
                        toast.success("Copied to clipboard");
                      }} className="text-slate-500 hover:text-white transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="bg-black border border-white/10 rounded-lg p-3 font-mono text-[12px] overflow-x-auto text-accent-soft/80">
                      <pre><code>{data.example}</code></pre>
                    </div>
                 </motion.section>
              )}

              {/* Related Concepts */}
              {(data.relatedConcepts?.length || 0) > 0 && (
                <motion.section variants={itemVariants} className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white">
                    <Link2 className="w-3.5 h-3.5 text-slate-500" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Related Concepts</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.relatedConcepts?.map((concept, i) => (
                      <button key={i} className="px-2 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-accent/40 transition-all flex items-center gap-1">
                        {concept}
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                </motion.section>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <p>{error}</p>
              </div>
              <button 
                onClick={fetchExplanation}
                className="w-full py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold uppercase tracking-widest transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Follow-up Question Input */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask follow-up..." 
            className="w-full bg-black border border-white/10 rounded-full py-2 px-4 text-xs focus:border-accent outline-none transition-all pr-12 text-slate-300"
          />
          <button className="absolute right-2 top-1.5 p-1 rounded-full bg-accent text-black scale-90 hover:scale-100 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
