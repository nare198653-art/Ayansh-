import React from 'react';
import { Palette, Sparkles, MessageSquareHeart, Printer, BookOpen } from 'lucide-react';

interface HeaderProps {
  onToggleChat: () => void;
  isChatOpen: boolean;
  onResetToNew: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleChat, isChatOpen, onResetToNew }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={onResetToNew}
          className="flex items-center gap-3 text-left group cursor-pointer"
          aria-label="ColorCraft Studio Home"
        >
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-amber-400 via-rose-400 to-indigo-500 p-0.5 shadow-md shadow-amber-200/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Palette className="w-6 h-6 text-amber-600 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Fredoka',sans-serif] text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors">
                ColorCraft
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Studio
              </span>
            </div>
            <p className="text-xs text-stone-700 hidden sm:block">
              Custom 5-Page Children's Coloring Books & Custom Covers
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
            <Printer className="w-4 h-4 text-amber-600" />
            <span>PDF Print Ready • Letter / A4</span>
          </div>

          <button
            onClick={onToggleChat}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isChatOpen
                ? 'bg-amber-600 text-white shadow-md shadow-amber-300'
                : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 shadow-xs'
            }`}
            aria-label="Toggle AI Storyteller and Coloring Assistant"
          >
            <MessageSquareHeart className={`w-4 h-4 ${isChatOpen ? 'text-white' : 'text-amber-600'}`} />
            <span>AI Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
};
