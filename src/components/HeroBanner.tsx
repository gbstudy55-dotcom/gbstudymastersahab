import React from 'react';
import { Search, Send, RotateCw, BookOpen, Layers, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { TELEGRAM_URL } from '../data/coursesData';

interface HeroBannerProps {
  onSearchOpen: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCoursesCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearchOpen,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCoursesCount,
  onRefresh,
  isRefreshing,
}) => {
  const categories = [
    { id: 'All', label: 'All Batches' },
    { id: 'Complete Pro Batch', label: 'Pro Batch 2.0 (Master)' },
    { id: 'Shemushi', label: 'Shemushi (Course A)' },
    { id: 'Manika', label: 'Manika (Course B)' },
    { id: '2.0 Revision', label: '2.0 Rapid Editions' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#1b0b20] via-[#120716] to-[#0b070f] pt-8 pb-8 px-4 sm:px-6 lg:px-8 border-b border-pink-500/20">
      {/* Pink grid background and ambient glow matching StudyBee */}
      <div className="absolute inset-0 pointer-events-none opacity-25 [background-image:linear-gradient(to_right,rgba(236,72,153,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,72,153,0.08)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_center,black_40%,transparent_80%)]" />
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-pink-600 rounded-full blur-[150px] pointer-events-none z-0 opacity-25" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] bg-rose-600 rounded-full blur-[160px] pointer-events-none z-0 opacity-20" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Telegram Announcement Banner */}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/70 border border-pink-500/30 text-xs font-semibold text-pink-300 mb-5 shadow-lg shadow-pink-950/40 hover:bg-pink-900/60 transition-colors group cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-pink-400 group-hover:rotate-12 transition-transform" />
          <span>Join GB STUDY Telegram Channel (@GBFreestudy)</span>
          <span className="text-pink-500">·</span>
          <span className="text-white font-bold underline">Join Now</span>
        </a>

        {/* Main Display Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 font-['Outfit'] [text-wrap:balance]">
          Study Smarter with <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">GB STUDY</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-pink-200/80 mb-7 leading-relaxed [text-wrap:balance]">
          Free online portal offering structured board courses, combo batches, CloudFront HLS video lectures, topper handwritten notes, and chapter tests — 100% free with no login.
        </p>

        {/* Instant Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-pink-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search batches, chapters (e.g. Sanskrit, Science, Sandhi, Real Numbers)..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border-2 border-pink-500/40 focus:border-pink-500 rounded-2xl text-white placeholder-pink-300/50 text-sm sm:text-base outline-none shadow-lg shadow-pink-950/50 focus:shadow-pink-500/25 transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 px-3 py-1.5 bg-pink-900/50 hover:bg-pink-800 text-xs text-pink-200 rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            ) : (
              <button
                onClick={onSearchOpen}
                className="absolute right-3 px-3.5 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-xs font-semibold text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                Search
              </button>
            )}
          </div>
        </div>

        {/* Category Segmented Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 border border-pink-400/50 scale-105'
                  : 'bg-pink-950/40 hover:bg-pink-900/40 text-pink-200 border border-pink-500/20 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Status & Refresh Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-pink-300/80 pt-2 border-t border-pink-500/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-medium">{totalCoursesCount} Batches Loaded</span>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-950/60 hover:bg-pink-900/60 border border-pink-500/30 text-pink-200 hover:text-white transition-colors cursor-pointer"
            title="Refresh batches from API"
          >
            <RotateCw className={`w-3.5 h-3.5 text-pink-400 ${isRefreshing ? 'animate-spin text-pink-300' : ''}`} />
            <span>Refresh</span>
          </button>

          <span className="text-pink-600">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-pink-400" />
            <span>Free Access · No Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};
