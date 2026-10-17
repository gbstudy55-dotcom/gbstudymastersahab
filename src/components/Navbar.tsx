import React, { useState } from 'react';
import { Search, Send, Menu, X, BookOpen, Sparkles } from 'lucide-react';
import { APP_LOGO, TELEGRAM_URL } from '../data/coursesData';

interface NavbarProps {
  onSearchOpen: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  onHomeClick: () => void;
  onOpenTelegramModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchOpen,
  onSelectCategory,
  activeCategory,
  onHomeClick,
  onOpenTelegramModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'All Batches', category: 'All' },
    { label: 'Pro Batch 2.0', category: 'Complete Pro Batch' },
    { label: 'Shemushi Batch', category: 'Shemushi' },
    { label: 'Manika Batch', category: 'Manika' },
    { label: '2.0 Revision', category: '2.0 Revision' },
  ];

  const handleNavClick = (category: string) => {
    onSelectCategory(category);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#120a17]/90 backdrop-blur-md border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand wordmark & logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onHomeClick}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-pink-400/50 shadow-md shadow-pink-500/20 bg-pink-900/30 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src={APP_LOGO}
                  alt="GB STUDY"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-['Outfit'] text-xl font-extrabold tracking-tight text-white group-hover:text-pink-300 transition-colors whitespace-nowrap">
                  GB <span className="text-pink-500">STUDY</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-pink-300/80 -mt-1 hidden sm:block">
                  Free Educational Portal
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.category}
                onClick={() => handleNavClick(item.category)}
                className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
                  activeCategory === item.category
                    ? 'text-pink-400 font-bold border-b-2 border-pink-500'
                    : 'text-pink-100/80 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary action (Search + Join Telegram) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-2 px-3 py-2 text-xs text-pink-200/90 bg-pink-950/40 hover:bg-pink-900/40 border border-pink-500/30 rounded-xl transition-colors cursor-pointer"
              title="Search batches and lectures"
            >
              <Search className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Search courses...</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-pink-900/50 border border-pink-500/30 rounded text-pink-300">
                ⌘K
              </kbd>
            </button>

            {/* Telegram Channel CTA */}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow-md shadow-pink-600/30 hover:shadow-pink-500/50 transition-all cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Join Telegram</span>
              <span className="sm:hidden">Telegram</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-pink-200 hover:text-white hover:bg-pink-900/40 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-pink-500/20 bg-[#120a17] px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.category}
              onClick={() => handleNavClick(item.category)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === item.category
                  ? 'bg-pink-900/50 text-pink-300 font-bold border border-pink-500/30'
                  : 'text-pink-100 hover:bg-pink-950/40'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-pink-500/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTelegramModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-pink-600/30"
            >
              <Send className="w-4 h-4" />
              <span>GB STUDY Telegram Channel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
