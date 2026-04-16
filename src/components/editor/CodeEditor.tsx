"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { useApp } from "@/providers/AppContext";
import { 
  javascript 
} from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { EditorView } from "@codemirror/view";
import { Decoration, DecorationSet } from "@codemirror/view";
import { StateField, StateEffect, RangeSetBuilder } from "@codemirror/state";
import { gutter, GutterMarker } from "@codemirror/view";
import { analyzeCodeComplexity } from "@/lib/complexity";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { MentorPopup } from "./MentorPopup";
import { AnimatePresence } from "framer-motion";

class ComplexityMarker extends GutterMarker {
  constructor(public level: string) { super(); }
  toDOM() {
    const span = document.createElement("span");
    span.className = `w-1.5 h-1.5 rounded-full block mx-auto mt-2 ${
      this.level === "simple" ? "bg-green-500/50" :
      this.level === "moderate" ? "bg-amber-500/50" :
      "bg-red-500/50"
    }`;
    return span;
  }
}

// Custom styles for line highlights
const accentGlow = Decoration.line({
  attributes: { class: "bg-accent-soft border-l-[3px] border-accent/20 transition-all duration-200" }
});

const accentActive = Decoration.line({
  attributes: { class: "bg-accent-solid border-l-[3px] border-accent shadow-[inset_10px_0_20px_-15px_rgba(224,255,79,0.3)]" }
});

export function CodeEditor() {
  const { state, dispatch } = useApp();
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number, y: number } | null>(null);

  // Map state language to CodeMirror extension
  const languageExtension = useMemo(() => {
    switch (state.language) {
      case "javascript":
      case "typescript":
        return javascript({ jsx: true, typescript: state.language === "typescript" });
      case "python": return python();
      case "rust": return rust();
      case "go": return go();
      case "java": return java();
      case "cpp": return cpp();
      case "sql": return sql();
      case "html": return html();
      case "css": return css();
      case "json": return json();
      case "yaml": return yaml();
      default: return javascript();
    }
  }, [state.language]);

  const onChange = useCallback((value: string) => {
    dispatch({ type: "SET_CODE", payload: value });
  }, [dispatch]);

  const onUpdate = useCallback((view: any) => {
    setEditorView(view.view);
  }, []);

  // Handle line click logic
  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    if (!editorView) return;
    // Check if user has actually highlighted text (not just a cursor click)
    const { from, to } = editorView.state.selection.main;
    if (from === to) {
      dispatch({ type: "SET_SELECTED_RANGE", payload: null });
      setPopupPos(null);
      return; // Exit early if nothing is highlighted
    }

    // Simple logic to detect line from click position or selection
    const line = editorView.state.doc.lineAt(editorView.state.selection.main.head);
    
    // Calculate coordinates for popup
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = editorView.coordsAtPos(line.from);
    if (coords) {
      const x = coords.right - rect.left + 20;
      let y = coords.top - rect.top;

      // Flip up if near bottom
      const editorHeight = rect.height;
      if (y > editorHeight * 0.6) {
        y = y - 350; // Estimated popup height
      }

      setPopupPos({ x, y });
    }

    // Only update if it's a new line or intentional selection change
    dispatch({ 
      type: "SET_SELECTED_RANGE", 
      payload: { start: line.number, end: line.number } 
    });
  }, [editorView, dispatch]);

  // Extensions array
  const extensions = useMemo(() => {
    const exts: Extension[] = [
      languageExtension,
      EditorView.lineWrapping,
      gutter({
        lineMarker(view, line) {
          const lineNumber = view.state.doc.lineAt(line.from).number;
          const complexity = analyzeCodeComplexity(state.code);
          const level = complexity[lineNumber - 1]?.complexity || "simple";
          return new ComplexityMarker(level);
        },
        initialSpacer: () => new ComplexityMarker("simple"),
      }),
      EditorView.theme({
        "&": {
          backgroundColor: "transparent",
          height: "100%",
          fontSize: "14px",
        },
        ".cm-gutters": {
          backgroundColor: "#0d0d0d",
          color: "#4a4a4a",
          border: "none",
          paddingLeft: "8px",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "transparent",
          color: "#e0ff4f",
        },
        ".cm-activeLine": {
          backgroundColor: "rgba(255,255,255,0.02)",
        },
        ".cm-content": {
          caretColor: "#e0ff4f",
          fontFamily: "var(--font-mono)",
          padding: "20px 0",
        },
        ".cm-cursor": {
           borderLeftColor: "#e0ff4f",
        },
        ".cm-selectionBackground": {
          backgroundColor: "rgba(224, 255, 79, 0.15) !important",
        }
      }),
    ];
    return exts;
  }, [languageExtension]);

  return (
    <div 
      className="h-full w-full overflow-hidden relative cursor-text group"
      onClick={handleEditorClick}
    >
      <CodeMirror
        value={state.code}
        height="100%"
        theme="dark"
        extensions={extensions}
        onChange={onChange}
        onUpdate={onUpdate}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
          autocompletion: true,
        }}
        className="h-full custom-editor"
      />

      {/* Empty State Overlay */}
      {!state.code && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px]">
           <MatrixRain />
           <div className="z-10 flex flex-col items-center justify-center opacity-30">
             <div className="w-16 h-16 mb-4 border-2 border-dashed border-accent rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-2xl font-bold font-heading text-accent">?</span>
             </div>
             <p className="text-slate-400 font-mono text-sm tracking-tighter">Paste code to begin mentoring</p>
           </div>
        </div>
      )}

      {/* Floating Analysis Popup */}
      <AnimatePresence>
        {state.selectedRange && popupPos && (
          <MentorPopup 
            position={popupPos} 
            onClose={() => {
              dispatch({ type: "SET_SELECTED_RANGE", payload: null });
              setPopupPos(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
