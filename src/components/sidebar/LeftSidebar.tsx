"use client";

import React, { useState } from "react";
import { FolderTree, Clock, Bookmark, ChevronRight, FileCode, Trash2 } from "lucide-react";
import { useApp } from "@/providers/AppContext";
import { motion } from "framer-motion";

export function LeftSidebar() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<"files" | "history" | "bookmarks">("files");

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-white/5 p-1 bg-white/5">
        {[
          { id: "files", icon: FolderTree, label: "Files" },
          { id: "history", icon: Clock, label: "History" },
          { id: "bookmarks", icon: Bookmark, label: "Saved" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center py-2 rounded-md transition-all ${
              activeTab === tab.id 
                ? "bg-white/10 text-accent" 
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold tracking-tight uppercase">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {activeTab === "files" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 rotate-90 transition-all" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace</span>
              </div>
            </div>
            
            <div className="space-y-1 ml-2">
              <div className="flex items-center gap-2 p-1.5 rounded-md bg-accent/10 border border-accent/20">
                <FileCode className="w-4 h-4 text-accent" />
                <span className="text-sm text-white truncate">current_snippet.ts</span>
              </div>
              {/* More files could go here */}
            </div>

            <div className="mt-8 border-t border-white/5 pt-4">
              <p className="text-[10px] text-slate-600 uppercase font-bold tracking-wider mb-2">Instructions</p>
              <p className="text-xs text-slate-400 leading-relaxed px-1">
                Paste code or upload a file. Click any line to get an instant AI explanation.
              </p>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-2">
            {state.history.length === 0 ? (
              <div className="text-center py-10 opacity-30">
                <Clock className="w-10 h-10 mx-auto mb-2" />
                <p className="text-xs">No history yet</p>
              </div>
            ) : (
              state.history.map((item) => (
                <div 
                  key={item.id}
                  className="p-2 rounded-md hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer group transition-all"
                  onClick={() => dispatch({ type: "SET_CODE", payload: item.code })}
                >
                  <p className="text-xs text-white truncate mb-1">{item.code.slice(0, 50)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 capitalize">{item.language}</span>
                    <span className="text-[10px] text-slate-600">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="space-y-3">
             {state.bookmarks.length === 0 ? (
              <div className="text-center py-10 opacity-30">
                <Bookmark className="w-10 h-10 mx-auto mb-2" />
                <p className="text-xs">Save lines to see them here</p>
              </div>
            ) : (
              state.bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="p-2 rounded-md bg-white/5 border border-white/10 group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-accent">L{bookmark.lineStart}-{bookmark.lineEnd}</span>
                    <button 
                      onClick={() => dispatch({ type: "REMOVE_BOOKMARK", payload: bookmark.id })}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <code className="text-[10px] text-slate-400 block mb-2 line-clamp-2 italic">
                    "{bookmark.code.trim()}"
                  </code>
                  {bookmark.note && (
                     <p className="text-xs text-white bg-white/5 p-2 rounded">{bookmark.note}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/5 border border-accent/10">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">Connected to Groq</span>
        </div>
      </div>
    </div>
  );
}
