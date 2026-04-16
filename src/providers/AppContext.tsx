"use client";

import React, { createContext, useContext, useState, useEffect, useReducer } from "react";

export type LearningMode = "explore" | "quiz" | "walk-through" | "challenge";

interface CodeSnippet {
  id: string;
  code: string;
  language: string;
  timestamp: number;
}

interface Bookmark {
  id: string;
  code: string;
  lineStart: number;
  lineEnd: number;
  note: string;
}

interface AppState {
  code: string;
  language: string;
  selectedRange: { start: number, end: number } | null;
  mode: LearningMode;
  isReadOnly: boolean;
  isStreaming: boolean;
  history: CodeSnippet[];
  bookmarks: Bookmark[];
}

type AppAction =
  | { type: "SET_CODE"; payload: string }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "SET_SELECTED_RANGE"; payload: { start: number, end: number } | null }
  | { type: "SET_MODE"; payload: LearningMode }
  | { type: "TOGGLE_READ_ONLY" }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "ADD_TO_HISTORY"; payload: CodeSnippet }
  | { type: "ADD_BOOKMARK"; payload: Bookmark }
  | { type: "REMOVE_BOOKMARK"; payload: string };

const initialState: AppState = {
  code: "",
  language: "javascript",
  selectedRange: null,
  mode: "explore",
  isReadOnly: false,
  isStreaming: false,
  history: [],
  bookmarks: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CODE":
      return { ...state, code: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_SELECTED_RANGE":
      return { ...state, selectedRange: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "TOGGLE_READ_ONLY":
      return { ...state, isReadOnly: !state.isReadOnly };
    case "SET_STREAMING":
      return { ...state, isStreaming: action.payload };
    case "ADD_TO_HISTORY":
      return { ...state, history: [action.payload, ...state.history].slice(0, 20) };
    case "ADD_BOOKMARK":
      return { ...state, bookmarks: [...state.bookmarks, action.payload] };
    case "REMOVE_BOOKMARK":
      return { ...state, bookmarks: state.bookmarks.filter(b => b.id !== action.payload) };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persistence (History & Bookmarks)
  useEffect(() => {
    const savedHistory = localStorage.getItem("code-mentor-history");
    const savedBookmarks = localStorage.getItem("code-mentor-bookmarks");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      history.forEach((h: CodeSnippet) => dispatch({ type: "ADD_TO_HISTORY", payload: h }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("code-mentor-history", JSON.stringify(state.history));
    localStorage.setItem("code-mentor-bookmarks", JSON.stringify(state.bookmarks));
  }, [state.history, state.bookmarks]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
