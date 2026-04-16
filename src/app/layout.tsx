import type { Metadata } from "next";
import { JetBrains_Mono, Syne, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Mentor | Master Your Code",
  description: "AI-powered line-by-line code teaching and explanation dashboard.",
};

import { AppProvider } from "@/providers/AppContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-black text-slate-200 selection:bg-accent/30">
        <AppProvider>
          <Toaster position="bottom-right" toastOptions={{
            style: {
              background: "#171717",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            }
          }} />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
