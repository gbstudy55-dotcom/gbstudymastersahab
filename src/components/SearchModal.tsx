import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Video, FileText, ArrowRight } from 'lucide-react';
import { Batch, Chapter, Subject, Lecture, NoteDoc } from '../types';
import { BATCHES_DATA } from '../data/coursesData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBatch: (batch: Batch) => void;
  onSelectChapter: (batch: Batch, subject: Subject, chapter: Chapter) => void;
  onPlayLecture: (lecture: Lecture, allLectures: Lecture[]) => void;
  onViewNote: (note: NoteDoc) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectBatch,
  onSelectChapter,
  onPlayLecture,
  onViewNote,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  // Search batches
  const matchedBatches = cleanQ
    ? BATCHES_DATA.filter(
        (b) =>
          b.name.toLowerCase().includes(cleanQ) ||
          b.subtitle.toLowerCase().includes(cleanQ) ||
          b.category.toLowerCase().includes(cleanQ)
      )
    : [];

  // Search chapters & lectures & notes
  const matchedChapters: { batch: Batch; subject: Subject; chapter: Chapter }[] = [];
  const matchedLectures: { batch: Batch; subject: Subject; chapter: Chapter; lecture: Lecture }[] = [];
  const matchedNotes: { batch: Batch; subject: Subject; chapter: Chapter; note: NoteDoc }[] = [];

  if (cleanQ) {
    BATCHES_DATA.forEach((b) => {
      b.subjects.forEach((s) => {
        s.chapters.forEach((c) => {
          if (c.title.toLowerCase().includes(cleanQ) || c.description.toLowerCase().includes(cleanQ)) {
            matchedChapters.push({ batch: b, subject: s, chapter: c });
          }

          c.lectures.forEach((lec) => {
            if (lec.title.toLowerCase().includes(cleanQ) || lec.description.toLowerCase().includes(cleanQ)) {
              matchedLectures.push({ batch: b, subject: s, chapter: c, lecture: lec });
            }
          });

          c.notes.forEach((nt) => {
            if (nt.title.toLowerCase().includes(cleanQ) || (nt.previewText && nt.previewText.toLowerCase().includes(cleanQ))) {
              matchedNotes.push({ batch: b, subject: s, chapter: c, note: nt });
            }
          });
        });
      });
    });
  }

  const hasResults =
    matchedBatches.length > 0 ||
    matchedChapters.length > 0 ||
    matchedLectures.length > 0 ||
    matchedNotes.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#140819] border border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-950/70 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-pink-500/20 bg-[#1a0a20] flex items-center gap-3">
          <Search className="w-5 h-5 text-pink-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search batches, chapters, lectures, or PDF notes..."
            className="flex-1 bg-transparent text-white placeholder-pink-300/50 text-sm sm:text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-pink-300 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-pink-300 hover:text-white bg-pink-900/40 hover:bg-pink-800 rounded-lg cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {!cleanQ ? (
            <div className="py-8 text-center text-pink-300/60 text-xs">
              <p className="mb-2">Type keywords like "Sanskrit", "Chemical", "Sandhi", "Maths", or "Light"</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {['Sanskrit Shemushi', 'Sandhi Vyakaran', 'Class 10 Science', 'Physics Formulas', 'Topper Notes'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-2.5 py-1 bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/20 rounded-lg text-pink-200 text-xs"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-pink-300/60 text-xs">
              No matching courses or lectures found for "{query}".
            </div>
          ) : (
            <>
              {/* Batches Section */}
              {matchedBatches.length > 0 && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-pink-400 block mb-2">
                    Batches & Courses ({matchedBatches.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedBatches.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          onSelectBatch(b);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/15 flex items-center justify-between text-left transition-colors cursor-pointer group"
                      >
                        <div className="overflow-hidden mr-2">
                          <p className="text-sm font-bold text-white group-hover:text-pink-300 truncate">
                            {b.name}
                          </p>
                          <span className="text-xs text-pink-200/70 truncate block">
                            {b.subtitle}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapters Section */}
              {matchedChapters.length > 0 && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-pink-400 block mb-2">
                    Chapters ({matchedChapters.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedChapters.map(({ batch, subject, chapter }, idx) => (
                      <button
                        key={`search-ch-${chapter.id}-${idx}`}
                        onClick={() => {
                          onSelectChapter(batch, subject, chapter);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/15 flex items-center justify-between text-left transition-colors cursor-pointer group"
                      >
                        <div className="overflow-hidden mr-2">
                          <p className="text-xs font-semibold text-pink-400">
                            {batch.name} · {subject.name}
                          </p>
                          <p className="text-sm font-bold text-white group-hover:text-pink-300 truncate">
                            {chapter.title}
                          </p>
                        </div>
                        <BookOpen className="w-4 h-4 text-pink-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lectures Section */}
              {matchedLectures.length > 0 && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-pink-400 block mb-2">
                    Video Lectures ({matchedLectures.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedLectures.map(({ chapter, lecture }, idx) => (
                      <button
                        key={`search-lec-${lecture.id}-${idx}`}
                        onClick={() => {
                          onPlayLecture(lecture, chapter.lectures);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/15 flex items-center justify-between text-left transition-colors cursor-pointer group"
                      >
                        <div className="overflow-hidden mr-2">
                          <p className="text-xs font-semibold text-pink-400">
                            {chapter.title} · {lecture.duration}
                          </p>
                          <p className="text-sm font-bold text-white group-hover:text-pink-300 truncate">
                            {lecture.title}
                          </p>
                        </div>
                        <Video className="w-4 h-4 text-pink-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {matchedNotes.length > 0 && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-pink-400 block mb-2">
                    PDF Notes & DPPs ({matchedNotes.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedNotes.map(({ note }, idx) => (
                      <button
                        key={`search-note-${note.id}-${idx}`}
                        onClick={() => {
                          onViewNote(note);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/15 flex items-center justify-between text-left transition-colors cursor-pointer group"
                      >
                        <div className="overflow-hidden mr-2">
                          <span className="text-[11px] text-pink-400 font-semibold">
                            {note.type} · {note.fileSize}
                          </span>
                          <p className="text-sm font-bold text-white group-hover:text-pink-300 truncate">
                            {note.title}
                          </p>
                        </div>
                        <FileText className="w-4 h-4 text-pink-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
