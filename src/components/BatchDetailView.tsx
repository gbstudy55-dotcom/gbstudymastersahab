import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Video, FileText, Send, Sparkles, CheckCircle2, ChevronRight, Layers, HelpCircle, LayoutGrid } from 'lucide-react';
import { Batch, Subject, Chapter } from '../types';
import { TELEGRAM_URL } from '../data/coursesData';

interface BatchDetailViewProps {
  batch: Batch;
  onBack: () => void;
  onSelectChapter: (chapter: Chapter, subject: Subject) => void;
}

export const BatchDetailView: React.FC<BatchDetailViewProps> = ({
  batch,
  onBack,
  onSelectChapter,
}) => {
  const [activeTab, setActiveTab] = useState<'batches' | 'overview'>('batches');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    batch.subjects[0]?.id || ''
  );

  const activeSubject = batch.subjects.find((s) => s.id === selectedSubjectId) || batch.subjects[0];

  return (
    <div className="min-h-screen pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-[#120817] border-b border-pink-500/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-pink-400 font-mono">
            <span>GB STUDY</span>
            <span>&gt;</span>
            <span className="text-white font-bold">{batch.name}</span>
          </div>
        </div>
      </div>

      {/* Course Hero Banner */}
      <div className="relative bg-gradient-to-b from-[#1c0c24] to-[#120817] border-b border-pink-500/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {batch.badge && (
                <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white bg-pink-600 rounded-lg shadow-md border border-pink-400/30">
                  {batch.badge}
                </span>
              )}
              <span className="px-2.5 py-1 text-xs font-semibold text-pink-200 bg-pink-950/60 rounded-lg border border-pink-500/30">
                100% Free · No Key Needed
              </span>
              <span className="text-xs text-pink-400 font-medium">
                Validity: 500 Days
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              {batch.name}
            </h1>

            <p className="text-sm sm:text-base text-pink-200/80 leading-relaxed max-w-2xl">
              {batch.description}
            </p>

            {/* Telegram Community */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Join Official GB STUDY Telegram Group</span>
              </a>
            </div>
          </div>

          {/* Right Banner Card */}
          <div className="relative rounded-2xl overflow-hidden border border-pink-500/30 shadow-2xl shadow-pink-950/50 aspect-video lg:aspect-4/3 bg-slate-900">
            <img
              src={batch.thumbnail}
              alt={batch.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5">
              <span className="text-[11px] uppercase font-black tracking-wider text-pink-400">
                Course Portal
              </span>
              <span className="text-lg font-bold text-white">GB STUDY Premium Learning</span>
            </div>
          </div>
        </div>

        {/* Overview & Batches Tabs (Identical to original website structure) */}
        <div className="max-w-7xl mx-auto mt-8 flex items-center gap-6 border-b border-pink-500/20 text-sm font-bold">
          <button
            onClick={() => setActiveTab('batches')}
            className={`pb-3 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'batches'
                ? 'text-pink-400 border-b-2 border-pink-500 font-extrabold'
                : 'text-pink-200/70 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>BATCHES / SUBJECTS</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'text-pink-400 border-b-2 border-pink-500 font-extrabold'
                : 'text-pink-200/70 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>COURSE OVERVIEW</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'batches' ? (
          <div>
            {/* Subject Selector Tabs */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-pink-400" />
                  <span>Choose Combo Batch / Subject</span>
                </h2>
                <span className="text-xs text-pink-300/70 font-mono">
                  {batch.subjects.length} Batches available
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {batch.subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      selectedSubjectId === subject.id
                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 border border-pink-400/40 scale-105'
                        : 'bg-[#180d1f] hover:bg-[#22122b] text-pink-200 border border-pink-500/20'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{subject.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/30 text-pink-200">
                      {subject.chapters.length} Chapters
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chapters Grid */}
            {activeSubject && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Outfit']">
                      {activeSubject.name} — Chapter Index
                    </h3>
                    <p className="text-xs text-pink-300/70">
                      Select a chapter to access video lectures, official PDF notes, and tests.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSubject.chapters.map((chapter, chIdx) => (
                    <div
                      key={`${chapter.id}-${chIdx}`}
                      onClick={() => onSelectChapter(chapter, activeSubject)}
                      className="group bg-[#150a1a] hover:bg-[#1f0e26] border border-pink-500/20 hover:border-pink-500/60 rounded-2xl p-5 shadow-lg shadow-black/30 hover:shadow-pink-950/30 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Chapter Header */}
                        <div className="flex items-center justify-between text-xs text-pink-400 font-semibold mb-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-pink-950/60 border border-pink-500/30">
                            Chapter {chapter.chapterNumber}
                          </span>
                          <div className="flex items-center gap-3 text-pink-300/80 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Video className="w-3.5 h-3.5 text-pink-400" />
                              {chapter.lecturesCount} Lectures
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-pink-400" />
                              {chapter.notesCount} PDFs
                            </span>
                            <span className="flex items-center gap-1">
                              <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
                              Tests
                            </span>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors mb-2 line-clamp-1">
                          {chapter.title}
                        </h4>

                        <p className="text-xs text-pink-200/70 line-clamp-2 mb-4 leading-relaxed">
                          {chapter.description}
                        </p>
                      </div>

                      {/* Action Row */}
                      <div className="pt-3 border-t border-pink-500/15 flex items-center justify-between">
                        <span className="text-xs text-pink-400 font-semibold group-hover:underline flex items-center gap-1">
                          Explore Videos, Notes & Tests
                        </span>
                        <span className="p-2 rounded-xl bg-pink-600 group-hover:bg-pink-500 text-white shadow-md shadow-pink-600/30 transition-all group-hover:translate-x-0.5">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Overview Tab */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#150a1a] border border-pink-500/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                About this Course & Batch
              </h3>
              <p className="text-sm text-pink-200/80 leading-relaxed">
                Welcome to <strong>GB STUDY</strong>. This portal provides complete syllabus coverage, chapter-wise HLS video lectures with adaptive bitrate streaming (Auto, 1080p, 720p, 480p, 360p), verified handwritten PDF notes, and online tests.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {batch.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-pink-100">
                    <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-pink-950/60 to-rose-950/40 border border-pink-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  Need Help or Have Doubts?
                </h4>
                <p className="text-xs text-pink-200/80">
                  Join our official Telegram community for daily notes, answer keys, and discussion.
                </p>
              </div>

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>Join Telegram</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
