import React from 'react';
import { Home, Layers, Search, Send } from 'lucide-react';
import { TELEGRAM_URL } from '../data/coursesData';

interface MobileBottomNavProps {
  currentView: 'home' | 'batch' | 'chapter';
  onHomeClick: () => void;
  onSearchOpen: () => void;
  onOpenTelegram: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onHomeClick,
  onSearchOpen,
  onOpenTelegram,
}) => {
  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#120716]/95 backdrop-blur-lg border-t border-pink-500/20 py-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around">
        <button
          onClick={onHomeClick}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-pink-400 font-bold' : 'text-pink-200/70 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={onHomeClick}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            currentView !== 'home' ? 'text-pink-400 font-bold' : 'text-pink-200/70 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Batches</span>
        </button>

        <button
          onClick={onSearchOpen}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-pink-200/70 hover:text-white transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          onClick={onOpenTelegram}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Telegram</span>
        </button>
      </div>
    </nav>
  );
};
