export interface Lecture {
  id: string;
  title: string;
  duration: string;
  videoUrl: string; // Real playable YouTube embed or video URL
  youtubeId?: string;
  description: string;
  dateAdded?: string;
  order: number;
}

export interface NoteDoc {
  id: string;
  title: string;
  fileSize: string;
  pages: number;
  pdfUrl: string;
  type: 'Handwritten Notes' | 'Lecture Notes' | 'DPP / Practice' | 'Formula Sheet' | 'Question Bank';
  previewText?: string;
}

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  description: string;
  lecturesCount: number;
  notesCount: number;
  lectures: Lecture[];
  notes: NoteDoc[];
}

export interface Subject {
  id: string;
  name: string;
  iconName: string;
  color: string;
  chaptersCount: number;
  chapters: Chapter[];
}

export interface Batch {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  badge?: string;
  thumbnail: string;
  mentor: string;
  targetYear: string;
  language: string;
  isFree: boolean;
  description: string;
  features: string[];
  subjects: Subject[];
  telegramGroupUrl?: string;
}
