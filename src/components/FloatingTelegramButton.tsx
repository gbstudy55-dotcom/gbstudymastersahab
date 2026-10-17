import React from 'react';
import { Send } from 'lucide-react';
import { TELEGRAM_URL } from '../data/coursesData';

export const FloatingTelegramButton: React.FC = () => {
  return (
    <aside
      aria-label="Telegram Community"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40"
    >
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-4 py-3 rounded-full shadow-xl shadow-pink-600/40 hover:shadow-pink-500/60 transition-all duration-200 hover:scale-105 active:scale-95 border border-pink-400/40 group"
        title="Join GB STUDY Telegram Channel"
      >
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Send className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
        </span>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs uppercase font-extrabold tracking-wider text-pink-100">Telegram</span>
          <span className="text-sm font-bold text-white leading-none">@GBFreestudy</span>
        </div>
      </a>
    </aside>
  );
};
