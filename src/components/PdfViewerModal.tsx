import React, { useState } from 'react';
import { X, Download, ExternalLink, Printer, ZoomIn, ZoomOut, FileText, CheckCircle2, BookOpen } from 'lucide-react';
import { NoteDoc } from '../types';

interface PdfViewerModalProps {
  note: NoteDoc | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ note, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!note) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[94vh] bg-[#120716] border border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-950/60 flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-pink-500/20 bg-[#180a1e]">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <div className="w-8 h-8 rounded-lg bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {note.title}
              </h3>
              <p className="text-[11px] text-pink-300/80">
                {note.type} · {note.pages} Pages · {note.fileSize}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-pink-950/60 border border-pink-500/30 rounded-xl p-1 text-pink-200 text-xs mr-2">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(75, prev - 15))}
                className="p-1 hover:text-white hover:bg-pink-900/50 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
                className="p-1 hover:text-white hover:bg-pink-900/50 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Button in Pink */}
            <a
              href={note.pdfUrl}
              download={`${note.title}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Open in new window */}
            <a
              href={note.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-pink-300 hover:text-white bg-pink-950/60 hover:bg-pink-900/60 border border-pink-500/30 rounded-xl transition-colors"
              title="Open full PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-pink-300 hover:text-white bg-pink-900/40 hover:bg-pink-800/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Reader Area */}
        <div className="flex-1 overflow-y-auto bg-[#0a050d] p-4 sm:p-6 flex flex-col items-center">
          <div
            className="w-full max-w-4xl bg-slate-950 border border-pink-500/30 rounded-xl shadow-xl overflow-hidden transition-all duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Embedded Interactive Viewer */}
            <div className="w-full h-[650px] relative bg-slate-900">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(note.pdfUrl)}&embedded=true`}
                title={note.title}
                className="w-full h-full border-0"
              />
            </div>

            {/* Document Study Summary Sheet */}
            <div className="p-6 bg-[#160a1a] border-t border-pink-500/20 text-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-pink-400 mb-3 font-['Outfit']">
                <BookOpen className="w-4 h-4" />
                <span>Chapter Notes Overview & Topper Highlights</span>
              </div>

              {note.previewText ? (
                <div className="p-4 rounded-xl bg-pink-950/40 border border-pink-500/20 text-xs sm:text-sm text-pink-100 leading-relaxed font-sans mb-4">
                  <p className="whitespace-pre-line">{note.previewText}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-pink-200/90 pt-2">
                <div className="flex items-start gap-2 bg-black/30 p-3 rounded-lg border border-pink-500/10">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Verified CBSE & State Board Syllabus alignment for 2026 examination.</span>
                </div>
                <div className="flex items-start gap-2 bg-black/30 p-3 rounded-lg border border-pink-500/10">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>Includes all step-by-step proofs, formulas, and previous years' questions.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
