import React, { useState } from 'react';
import { ArrowLeft, Play, FileText, Download, Eye, Clock, CheckCircle2, BookOpen, Send, Sparkles, HelpCircle, ExternalLink } from 'lucide-react';
import { Chapter, Subject, Batch, Lecture, NoteDoc } from '../types';
import { TELEGRAM_URL } from '../data/coursesData';
import { TestModal } from './TestModal';

interface ChapterDetailViewProps {
  batch: Batch;
  subject: Subject;
  chapter: Chapter;
  onBack: () => void;
  onPlayLecture: (lecture: Lecture, allLectures: Lecture[]) => void;
  onViewNote: (note: NoteDoc) => void;
}

export const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({
  batch,
  subject,
  chapter,
  onBack,
  onPlayLecture,
  onViewNote,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'notes' | 'tests'>('videos');
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [selectedTestTitle, setSelectedTestTitle] = useState('');

  const openTest = (title: string) => {
    setSelectedTestTitle(title);
    setIsTestOpen(true);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-[#120817] border-b border-pink-500/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {batch.name}</span>
          </button>

          <span className="text-xs text-pink-400 font-medium">
            {subject.name}
          </span>
        </div>
      </div>

      {/* Chapter Overview Header */}
      <div className="bg-gradient-to-b from-[#1c0c24] to-[#120817] border-b border-pink-500/20 py-7 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 text-xs text-pink-400 font-semibold mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-pink-950/60 border border-pink-500/30">
              Chapter {chapter.chapterNumber}
            </span>
            <span>·</span>
            <span>{subject.name}</span>
            <span>·</span>
            <span className="text-pink-300">{batch.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mb-3">
            {chapter.title}
          </h1>

          <p className="text-sm text-pink-200/80 max-w-3xl leading-relaxed mb-6">
            {chapter.description}
          </p>

          {/* 3 Category Folder Buttons (Videos, Notes, Tests) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 border border-pink-400/40 scale-105'
                  : 'bg-pink-950/40 hover:bg-pink-900/40 text-pink-200 border border-pink-500/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Videos ({chapter.lectures.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 border border-pink-400/40 scale-105'
                  : 'bg-pink-950/40 hover:bg-pink-900/40 text-pink-200 border border-pink-500/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notes & PDFs ({chapter.notes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'tests'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 border border-pink-400/40 scale-105'
                  : 'bg-pink-950/40 hover:bg-pink-900/40 text-pink-200 border border-pink-500/20'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Online Tests (2)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: VIDEOS */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Chapter Video Lectures
              </h2>
              <span className="text-xs text-pink-300/70">
                CloudFront HLS Stream · Multiple Qualities
              </span>
            </div>

            <div className="space-y-4">
              {chapter.lectures.map((lecture, index) => (
                <div
                  key={`${lecture.id}-${index}`}
                  className="bg-[#150a1a] hover:bg-[#1d0e24] border border-pink-500/20 hover:border-pink-500/50 rounded-2xl p-4 sm:p-5 shadow-lg shadow-black/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Lecture Order indicator */}
                    <div className="w-12 h-12 rounded-xl bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-pink-400 font-extrabold text-sm shrink-0 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-pink-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {lecture.duration}
                        </span>
                        <span>·</span>
                        <span>Lecture {lecture.order}</span>
                        <span>·</span>
                        <span className="text-emerald-400">Stream Ready</span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                        {lecture.title}
                      </h3>

                      <p className="text-xs text-pink-200/70 line-clamp-2 max-w-2xl leading-relaxed">
                        {lecture.description}
                      </p>
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="w-full sm:w-auto pt-2 sm:pt-0 flex items-center gap-2">
                    <button
                      onClick={() => onPlayLecture(lecture, chapter.lectures)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-pink-600/30 hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Watch Lecture</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: NOTES */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Chapter PDF Notes & DPPs
              </h2>
              <span className="text-xs text-pink-300/70">
                Official CloudFront PDFs · View & Download
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.notes.map((note, index) => (
                <div
                  key={`${note.id}-${index}`}
                  className="bg-[#150a1a] hover:bg-[#1d0e24] border border-pink-500/20 hover:border-pink-500/50 rounded-2xl p-5 shadow-lg shadow-black/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-pink-900/60 text-pink-300 border border-pink-500/30 text-[11px]">
                        {note.type}
                      </span>
                      <span className="text-pink-300/80 text-xs">
                        {note.pages} Pages · {note.fileSize}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {note.title}
                    </h3>

                    {note.previewText && (
                      <p className="text-xs text-pink-200/70 line-clamp-2 mb-4 italic leading-relaxed bg-black/20 p-2.5 rounded-xl border border-pink-500/10">
                        "{note.previewText}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-pink-500/15 flex items-center gap-2">
                    <button
                      onClick={() => onViewNote(note)}
                      className="flex-1 py-2 px-3 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-md shadow-pink-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>

                    <a
                      href={note.pdfUrl}
                      download={`${note.title}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-pink-950/60 hover:bg-pink-900/60 text-pink-200 hover:text-white font-semibold text-xs rounded-xl border border-pink-500/30 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TESTS (ONLINE TESTS & PRACTICE) */}
        {activeTab === 'tests' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Chapter Tests & Practice Sets
              </h2>
              <span className="text-xs text-pink-300/70">
                Learn Mode (Instant Solutions) & Practice Mode (Timer)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#150a1a] hover:bg-[#1d0e24] border border-pink-500/20 hover:border-pink-500/50 rounded-2xl p-5 shadow-lg shadow-black/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-pink-900/60 text-pink-300 border border-pink-500/30 text-[11px]">
                      MCQ Chapter Test 01
                    </span>
                    <span className="text-pink-300/80 text-xs">
                      5 Questions · 5 Mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">
                    {chapter.title} — Comprehensive Board Test
                  </h3>

                  <p className="text-xs text-pink-200/70 mb-4 leading-relaxed">
                    Test your understanding of संधि, समास, अन्वय, and grammar rules from this chapter.
                  </p>
                </div>

                <div className="pt-3 border-t border-pink-500/15 flex items-center gap-2">
                  <button
                    onClick={() => openTest(`${chapter.title} — Board Test 01`)}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Start Test (Choose Mode)</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#150a1a] hover:bg-[#1d0e24] border border-pink-500/20 hover:border-pink-500/50 rounded-2xl p-5 shadow-lg shadow-black/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-pink-900/60 text-pink-300 border border-pink-500/30 text-[11px]">
                      PYQ Speed Test 02
                    </span>
                    <span className="text-pink-300/80 text-xs">
                      5 Questions · 5 Mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">
                    Previous Years' Selected Exam Questions
                  </h3>

                  <p className="text-xs text-pink-200/70 mb-4 leading-relaxed">
                    Previous 5 years' CBSE exam questions selected to maximize marks and speed.
                  </p>
                </div>

                <div className="pt-3 border-t border-pink-500/15 flex items-center gap-2">
                  <button
                    onClick={() => openTest(`${chapter.title} — PYQ Speed Test 02`)}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Start Test (Choose Mode)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Modal Component */}
      <TestModal
        isOpen={isTestOpen}
        testTitle={selectedTestTitle}
        onClose={() => setIsTestOpen(false)}
      />
    </div>
  );
};
