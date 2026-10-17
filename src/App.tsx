import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { BatchCard } from './components/BatchCard';
import { BatchDetailView } from './components/BatchDetailView';
import { ChapterDetailView } from './components/ChapterDetailView';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { SearchModal } from './components/SearchModal';
import { TelegramModal } from './components/TelegramModal';
import { FloatingTelegramButton } from './components/FloatingTelegramButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { BATCHES_DATA } from './data/coursesData';
import { fetchLiveCourses } from './services/apiService';
import { Batch, Subject, Chapter, Lecture, NoteDoc } from './types';
import { Sparkles, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [coursesList, setCoursesList] = useState<Batch[]>(BATCHES_DATA);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Modals state
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [currentLectureList, setCurrentLectureList] = useState<Lecture[]>([]);
  const [currentNote, setCurrentNote] = useState<NoteDoc | null>(null);

  // Load live data from API on start if available
  useEffect(() => {
    async function initLiveCourses() {
      try {
        const live = await fetchLiveCourses();
        if (live && Array.isArray(live) && live.length > 0) {
          // Merge live meta with our rich batch subjects
          setCoursesList((prev) => {
            return prev.map((batch) => {
              const matched = live.find((l: any) => String(l.id) === String(batch.id));
              if (matched) {
                return {
                  ...batch,
                  name: matched.title || batch.name,
                  targetYear: matched.validity || batch.targetYear,
                };
              }
              return batch;
            });
          });
        }
      } catch (e) {
        console.log('Using pre-bundled batches:', e);
      }
    }
    initLiveCourses();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const live = await fetchLiveCourses();
      if (live && Array.isArray(live)) {
        setCoursesList((prev) =>
          prev.map((batch) => {
            const matched = live.find((l: any) => String(l.id) === String(batch.id));
            if (matched) {
              return {
                ...batch,
                name: matched.title || batch.name,
              };
            }
            return batch;
          })
        );
      }
    } catch (e) {
      console.log('Refresh completed with cache');
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle browser back button (history navigation)
  useEffect(() => {
    const handlePopState = () => {
      if (selectedChapter) {
        setSelectedChapter(null);
      } else if (selectedBatch) {
        setSelectedBatch(null);
        setSelectedSubject(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedChapter, selectedBatch]);

  // Batch Selection Handler
  const handleSelectBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setSelectedSubject(batch.subjects[0] || null);
    setSelectedChapter(null);
    window.history.pushState({ view: 'batch', batchId: batch.id }, '', `#batch-${batch.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chapter Selection Handler
  const handleSelectChapter = (chapter: Chapter, subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedChapter(chapter);
    window.history.pushState({ view: 'chapter', chapterId: chapter.id }, '', `#chapter-${chapter.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Batches
  const handleBackToBatches = () => {
    setSelectedBatch(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    window.history.pushState({ view: 'home' }, '', '#');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Batch from Chapter
  const handleBackToBatch = () => {
    setSelectedChapter(null);
    window.history.pushState({ view: 'batch', batchId: selectedBatch?.id }, '', `#batch-${selectedBatch?.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lecture play
  const handlePlayLecture = (lecture: Lecture, allLectures: Lecture[]) => {
    setCurrentLecture(lecture);
    setCurrentLectureList(allLectures);
  };

  // Note view
  const handleViewNote = (note: NoteDoc) => {
    setCurrentNote(note);
  };

  // Filtered batches for homepage
  const filteredBatches = coursesList.filter((batch) => {
    const matchesCategory =
      activeCategory === 'All' || batch.category === activeCategory;

    const cleanSearch = searchQuery.trim().toLowerCase();
    if (!cleanSearch) return matchesCategory;

    const matchesName = batch.name.toLowerCase().includes(cleanSearch);
    const matchesSubtitle = batch.subtitle.toLowerCase().includes(cleanSearch);
    const matchesSubject = batch.subjects.some((s) =>
      s.name.toLowerCase().includes(cleanSearch) ||
      s.chapters.some((c) => c.title.toLowerCase().includes(cleanSearch))
    );

    return matchesCategory && (matchesName || matchesSubtitle || matchesSubject);
  });

  const getCurrentView = (): 'home' | 'batch' | 'chapter' => {
    if (selectedChapter) return 'chapter';
    if (selectedBatch) return 'batch';
    return 'home';
  };

  return (
    <div className="min-h-screen bg-[#0b070f] text-pink-50 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onSearchOpen={() => setIsSearchOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleBackToBatches();
        }}
        activeCategory={activeCategory}
        onHomeClick={handleBackToBatches}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {selectedChapter && selectedBatch && selectedSubject ? (
          /* Chapter Detail View (Videos, Notes & Tests) */
          <ChapterDetailView
            batch={selectedBatch}
            subject={selectedSubject}
            chapter={selectedChapter}
            onBack={handleBackToBatch}
            onPlayLecture={handlePlayLecture}
            onViewNote={handleViewNote}
          />
        ) : selectedBatch ? (
          /* Batch Detail View (Overview & Batches with Combo Subjects) */
          <BatchDetailView
            batch={selectedBatch}
            onBack={handleBackToBatches}
            onSelectChapter={handleSelectChapter}
          />
        ) : (
          /* Homepage: Hero + Batches Grid */
          <>
            <HeroBanner
              onSearchOpen={() => setIsSearchOpen(true)}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCoursesCount={filteredBatches.length}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            {/* Batches Showcase Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black text-pink-400 uppercase tracking-wider mb-1">
                    <Layers className="w-4 h-4" />
                    <span>Free Premium Batches</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
                    {activeCategory === 'All' ? 'Available Courses & Batches' : `${activeCategory} Batches`}
                  </h2>
                </div>

                <div className="text-xs text-pink-300/80">
                  Showing <span className="font-bold text-pink-400">{filteredBatches.length}</span> structured batches
                </div>
              </div>

              {filteredBatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBatches.map((batch) => (
                    <BatchCard
                      key={batch.id}
                      batch={batch}
                      onSelectBatch={handleSelectBatch}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#150a1a] border border-pink-500/20 rounded-2xl p-8 max-w-xl mx-auto">
                  <BookOpen className="w-12 h-12 text-pink-400 mx-auto mb-3 opacity-60" />
                  <h3 className="text-lg font-bold text-white mb-2">No batches match your query</h3>
                  <p className="text-xs text-pink-200/70 mb-5">
                    Try searching for another subject or clear the search filter to see all batches.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                    }}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    View All Batches
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Floating Telegram Action Button */}
      <FloatingTelegramButton />

      {/* Mobile Android Bottom Navigation */}
      <MobileBottomNav
        currentView={getCurrentView()}
        onHomeClick={handleBackToBatches}
        onSearchOpen={() => setIsSearchOpen(true)}
        onOpenTelegram={() => setIsTelegramModalOpen(true)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleBackToBatches();
        }}
        onHomeClick={handleBackToBatches}
        onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
      />

      {/* Telegram Prompt Modal */}
      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      {/* Enhanced Video Player Modal (HLS + Quality + Speed + Study Pad) */}
      <VideoPlayerModal
        lecture={currentLecture}
        allLectures={currentLectureList}
        onClose={() => setCurrentLecture(null)}
        onSelectLecture={(lec) => setCurrentLecture(lec)}
      />

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        note={currentNote}
        onClose={() => setCurrentNote(null)}
      />

      {/* Cross-Platform Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBatch={handleSelectBatch}
        onSelectChapter={(b, s, c) => {
          setSelectedBatch(b);
          setSelectedSubject(s);
          setSelectedChapter(c);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPlayLecture={(lec, all) => {
          handlePlayLecture(lec, all);
        }}
        onViewNote={(nt) => {
          handleViewNote(nt);
        }}
      />
    </div>
  );
}
