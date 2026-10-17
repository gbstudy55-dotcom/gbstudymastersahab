import React from 'react';
import { BookOpen, Video, FileText, ArrowRight, Sparkles, Users } from 'lucide-react';
import { Batch } from '../types';

interface BatchCardProps {
  batch: Batch;
  onSelectBatch: (batch: Batch) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({ batch, onSelectBatch }) => {
  const totalLectures = batch.subjects.reduce(
    (acc, sub) => acc + sub.chapters.reduce((cAcc, ch) => cAcc + ch.lecturesCount, 0),
    0
  );

  const totalNotes = batch.subjects.reduce(
    (acc, sub) => acc + sub.chapters.reduce((cAcc, ch) => cAcc + ch.notesCount, 0),
    0
  );

  return (
    <div className="group relative bg-[#150b1a] hover:bg-[#1a0e22] border border-pink-500/25 hover:border-pink-500/60 rounded-2xl overflow-hidden shadow-lg shadow-black/40 hover:shadow-pink-950/40 transition-all duration-300 flex flex-col">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={batch.thumbnail}
          alt={batch.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#150b1a] via-black/40 to-transparent" />

        {/* Badge in pink */}
        {batch.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white bg-pink-600/90 backdrop-blur-md rounded-lg shadow-md border border-pink-400/40">
            {batch.badge}
          </span>
        )}

        {/* Free Tag */}
        <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold text-white bg-rose-600/90 backdrop-blur-md rounded-lg shadow-md border border-rose-400/30">
          100% Free
        </span>

        {/* Target Year / Mentor */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-pink-200">
          <span className="font-semibold text-white truncate">{batch.mentor}</span>
          <span className="text-pink-300 font-mono text-[11px]">{batch.targetYear}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed category metadata */}
          <div className="flex items-center gap-2 text-xs text-pink-400 font-semibold mb-1.5">
            <span>{batch.category}</span>
            <span aria-hidden="true">·</span>
            <span>{batch.language}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1 mb-1 font-['Outfit']">
            {batch.name}
          </h3>

          <p className="text-xs text-pink-200/70 line-clamp-2 mb-4 leading-relaxed">
            {batch.subtitle}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-pink-950/40 border border-pink-500/15 mb-4 text-center">
            <div>
              <span className="block text-xs font-bold text-pink-300">{batch.subjects.length}</span>
              <span className="text-[10px] text-pink-200/60 uppercase">Subjects</span>
            </div>
            <div className="border-x border-pink-500/20">
              <span className="block text-xs font-bold text-pink-300">{totalLectures}</span>
              <span className="text-[10px] text-pink-200/60 uppercase">Lectures</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-pink-300">{totalNotes}</span>
              <span className="text-[10px] text-pink-200/60 uppercase">PDF Notes</span>
            </div>
          </div>
        </div>

        {/* Buttons (prominent Pink as specifically requested) */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onSelectBatch(batch)}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-pink-600/30 hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer group/btn"
          >
            <span>Let's Study</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>

          <button
            onClick={() => onSelectBatch(batch)}
            className="py-2.5 px-3.5 bg-pink-950/60 hover:bg-pink-900/60 text-pink-200 hover:text-white text-xs font-semibold rounded-xl border border-pink-500/30 transition-colors cursor-pointer"
            title="View batch details and syllabus"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
