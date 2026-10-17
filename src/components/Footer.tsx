import React from 'react';
import { Send, Heart, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { APP_LOGO, TELEGRAM_URL } from '../data/coursesData';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onHomeClick: () => void;
  onOpenTelegramModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onHomeClick,
  onOpenTelegramModal,
}) => {
  return (
    <footer className="bg-[#0e0612] border-t border-pink-500/20 pt-12 pb-24 md:pb-12 text-pink-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-pink-500/40 bg-pink-900/30 flex items-center justify-center">
                <img
                  src={APP_LOGO}
                  alt="GB STUDY Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-['Outfit'] text-2xl font-extrabold tracking-tight text-white">
                GB <span className="text-pink-500">STUDY</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-pink-200/70 max-w-md leading-relaxed">
              GB STUDY is committed to providing free, high-yield educational batches, NCERT video lectures, topper handwritten notes, and chapter DPPs for students across India.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenTelegramModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-600/30 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Official Telegram Channel</span>
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-3 font-['Outfit']">
              Featured Batches
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('Complete Pro Batch')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  PRO BATCH 2.0 (Master Batch)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Shemushi')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  SHEMUSHI BATCH (Shemushi + Vyakaran)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Manika')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  MANIKA BATCH (Manika + Vyakaran)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('2.0 Revision')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  SHEMUSHI & MANIKA 2.0 Editions
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-3 font-['Outfit']">
              Study Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-pink-400" />
                  <span>Telegram: @GBFreestudy</span>
                </a>
              </li>
              <li>
                <span className="text-pink-300/80">Daily DPPs & Notes PDF Updates</span>
              </li>
              <li>
                <span className="text-pink-300/80">100% Free - No Sign Up Needed</span>
              </li>
              <li>
                <span className="text-pink-300/80">Mobile & Laptop Optimized</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-pink-500/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-pink-300/60">
          <p>© {new Date().getFullYear()} GB STUDY. Dedicated to free, accessible education for all students.</p>
          <p className="flex items-center gap-1">
            <span>Powered with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>for curious minds</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
