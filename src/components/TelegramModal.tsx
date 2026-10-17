import React, { useEffect, useState } from 'react';
import { Send, X, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { APP_LOGO, TELEGRAM_URL } from '../data/coursesData';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  useEffect(() => {
    // Show automatically on first mount if not dismissed in this session
    const hasSeen = sessionStorage.getItem('gb_study_telegram_seen');
    if (!hasSeen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
    }
  }, [hasOpenedOnce]);

  if (!isOpen) return null;

  const handleJoin = () => {
    sessionStorage.setItem('gb_study_telegram_seen', 'true');
    window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleClose = () => {
    sessionStorage.setItem('gb_study_telegram_seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-pink-950/90 via-slate-900 to-slate-950 border border-pink-500/40 rounded-2xl p-6 shadow-2xl shadow-pink-600/20 text-center overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="telegram-popup-title"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-pink-300 hover:text-white bg-pink-900/40 hover:bg-pink-800/60 rounded-full transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="mx-auto w-20 h-20 mb-4 p-1 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 shadow-lg shadow-pink-600/40 flex items-center justify-center overflow-hidden">
          <img
            src={APP_LOGO}
            alt="GB STUDY Logo"
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title */}
        <h2 id="telegram-popup-title" className="text-2xl font-bold text-white mb-2 tracking-tight">
          Join <span className="text-pink-400">GB STUDY</span> Telegram Channel
        </h2>

        <p className="text-pink-200/80 text-sm mb-6 leading-relaxed">
          Get instant access to free daily PDF notes, lecture updates, DPP practice sheets, and direct study support!
        </p>

        {/* Benefits list */}
        <div className="bg-pink-950/40 border border-pink-500/20 rounded-xl p-3.5 mb-6 text-left space-y-2 text-xs text-pink-100/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Daily Handwritten Notes & DPPs (Class 9, 10, 11, 12)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Sanskrit, Science, Maths Board Exam Test Papers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
            <span>100% Free Forever - No Login or Fees</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleJoin}
            className="w-full py-3 px-5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-600/40 hover:shadow-pink-500/60 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            <span>Join Telegram</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto py-3 px-5 bg-slate-800/80 hover:bg-slate-800 text-pink-200 hover:text-white text-sm font-medium rounded-xl border border-pink-500/20 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
