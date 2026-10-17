import { Batch, Subject, Chapter, Lecture, NoteDoc } from '../types';
import fullDbRaw from './mastersahab_full_db.json';

export const APP_LOGO = 'https://i.ibb.co/0R7qc34v/1093.jpg';
export const TELEGRAM_URL = 'https://t.me/GBFreestudy';
export const TELEGRAM_CHANNEL_NAME = 'GB STUDY';

// Helper to convert fullDbRaw batches into Subject & Chapter hierarchy
function buildShemushiSubjects(batchRaw: any): Subject {
  const chapters: Chapter[] = batchRaw.subjects.map((sub: any, idx: number) => {
    // Deduplicate videos by videoUrl or title
    const uniqueVideos: any[] = [];
    const seenVideos = new Set<string>();
    (sub.videos || []).forEach((v: any, vIdx: number) => {
      const vKey = (v.videoUrl && v.videoUrl.trim()) || v.title || `${v.id}-${vIdx}`;
      if (!seenVideos.has(vKey)) {
        seenVideos.add(vKey);
        uniqueVideos.push(v);
      }
    });

    const lectures: Lecture[] = uniqueVideos.map((v: any, vIdx: number) => ({
      id: `${batchRaw.id}-${sub.id}-v-${v.id || vIdx}-${vIdx}`,
      title: v.title || `Lecture ${vIdx + 1}`,
      duration: v.duration || '40:00',
      videoUrl: v.videoUrl || '',
      description: `Official Class 10 video lecture for ${sub.title}. Full concepts, shloka vyakhya, and board questions.`,
      order: vIdx + 1
    }));

    // Deduplicate notes by fileUrl or title
    const uniqueNotes: any[] = [];
    const seenNotes = new Set<string>();
    (sub.notes || []).forEach((n: any, nIdx: number) => {
      const nKey = (n.fileUrl && n.fileUrl.trim()) || n.title || `${n.id}-${nIdx}`;
      if (!seenNotes.has(nKey)) {
        seenNotes.add(nKey);
        uniqueNotes.push(n);
      }
    });

    const notes: NoteDoc[] = uniqueNotes.map((n: any, nIdx: number) => ({
      id: `${batchRaw.id}-${sub.id}-n-${n.id || nIdx}-${nIdx}`,
      title: n.title || `${sub.title} Notes`,
      fileSize: '2.5 MB',
      pages: 12,
      pdfUrl: n.fileUrl || '',
      type: n.title?.toLowerCase().includes('dpp') ? 'DPP / Practice' : 'Handwritten Notes',
      previewText: `Official ${sub.title} study notes and practice questions with solutions for CBSE Board 2026-2027.`
    }));

    return {
      id: `ch-${batchRaw.id}-${sub.id}-${idx}`,
      title: sub.title,
      chapterNumber: idx + 1,
      description: `${sub.title} — Detailed chapter covering complete textbook syllabus, grammar rules, and previous year board questions.`,
      lecturesCount: lectures.length,
      notesCount: notes.length,
      lectures,
      notes
    };
  });

  return {
    id: `${batchRaw.id}-sub`,
    name: batchRaw.title,
    iconName: 'BookOpen',
    color: 'from-pink-500 to-rose-600',
    chaptersCount: chapters.length,
    chapters
  };
}

const rawShemushi = fullDbRaw.find((b: any) => b.id === '45307') || fullDbRaw[0];
const rawManika = fullDbRaw.find((b: any) => b.id === '45306') || fullDbRaw[1];
const rawShemushi2 = fullDbRaw.find((b: any) => b.id === '49799') || fullDbRaw[2];
const rawManika2 = fullDbRaw.find((b: any) => b.id === '49853') || fullDbRaw[3];

const shemushiSubject = buildShemushiSubjects(rawShemushi);
const manikaSubject = buildShemushiSubjects(rawManika);
const shemushi2Subject = buildShemushiSubjects(rawShemushi2);
const manika2Subject = buildShemushiSubjects(rawManika2);

// Standalone batches for each combo so users can access them directly or as part of PRO BATCH 2.0
export const BATCHES_DATA: Batch[] = [
  {
    id: '44743',
    name: 'PRO BATCH 2.0 - 2027 ( Shemushi + Manika )',
    subtitle: 'Class 10th Sanskrit Complete Board Course (Shemushi + Manika + Vyakaran)',
    category: 'Complete Pro Batch',
    badge: 'POPULAR BATCH',
    thumbnail: 'https://d1xo3otg0k74xn.cloudfront.net/566/admin_v1/bundle_management/course/601144344743_PRO%20BATCH%202.0%20%283%29.jpg',
    mentor: 'GB STUDY Sanskrit Faculty',
    targetYear: '500 Days • Live',
    language: 'Hindi / Sanskrit',
    isFree: true,
    description: 'The complete Master Sahab flagship Class 10 Sanskrit course including Shemushi Bhag-2 and Manika textbooks, complete Sanskrit grammar (Vyakaran: Sandhi, Samas, Pratyaya, Vachya, Anuvad, Ghatika, Patra Lekhan, Chitra Varnan), online tests with Learn & Practice mode, and verified handwritten notes.',
    features: [
      `130+ Real HLS Video Lectures with Adaptive Quality (1080p, 720p, 480p, 360p)`,
      `90+ Official Chapter-wise Printable PDF Notes & DPPs`,
      'Interactive Chapter Test series (Learn Mode & Practice Mode)',
      '100% Free Forever for all students - No login or key required',
      'Direct Doubt Support via GB STUDY Telegram Channel'
    ],
    telegramGroupUrl: 'https://t.me/GBFreestudy',
    subjects: [shemushiSubject, manikaSubject, shemushi2Subject, manika2Subject]
  },
  {
    id: '45307',
    name: 'SHEMUSHI BATCH (शेमुषी भाग-२)',
    subtitle: 'Class 10th Sanskrit Shemushi Textbook & Full Vyakaran (69 Videos, 46 PDFs)',
    category: 'Shemushi',
    badge: 'TEXTBOOK SPECIAL',
    thumbnail: 'https://d1xo3otg0k74xn.cloudfront.net/566/admin_v1/bundle_management/course/153063845307_PRO%202027%20BANNER%20%20%282%29.jpg',
    mentor: 'GB STUDY Sanskrit Panel',
    targetYear: '500 Days • Live',
    language: 'Hindi / Sanskrit',
    isFree: true,
    description: 'Complete Shemushi Bhag-2 course with 26 chapters and topics: Sandhi, Samas, Pratyaya, Vachya, Anuvad, Shuchi Paryavaranam, Buddhirbalavati Sada, Shishulalanam, Subhashitani, Patra Lekhan, Chitra Varnan, Ghatika, and tests.',
    features: [
      '69 Real HLS Video Lectures',
      '46 Verified PDF Notes & Question Banks',
      'Learn Mode & Practice Mode Tests',
      'Zero Login Required'
    ],
    telegramGroupUrl: 'https://t.me/GBFreestudy',
    subjects: [shemushiSubject]
  },
  {
    id: '45306',
    name: 'MANIKA BATCH (मणिका भाग-२)',
    subtitle: 'Class 10th Sanskrit Manika Textbook & Complete Grammar (63 Videos, 44 PDFs)',
    category: 'Manika',
    badge: 'COURSE B SPECIAL',
    thumbnail: 'https://d1xo3otg0k74xn.cloudfront.net/566/admin_v1/bundle_management/course/601144344743_PRO%20BATCH%202.0%20%283%29.jpg',
    mentor: 'GB STUDY Sanskrit Panel',
    targetYear: '500 Days • Live',
    language: 'Hindi / Sanskrit',
    isFree: true,
    description: 'Complete Manika Bhag-2 syllabus with 28 chapters: Vangmayam Tapah, Nasti Tyagasamam Sukham, Ramaniya Hi Srishtih Esha, Ajna Gurunam, Abhyasavashagam Manah, full Vyakaran, and DPP practice sheets.',
    features: [
      '63 Real HLS Video Lectures',
      '44 Verified PDF Notes & DPPs',
      'Interactive Chapter Tests',
      'Free Telegram Doubt Support'
    ],
    telegramGroupUrl: 'https://t.me/GBFreestudy',
    subjects: [manikaSubject]
  },
  {
    id: '49799',
    name: 'SHEMUSHI 2.0 BATCH',
    subtitle: 'Rapid Revision & Advanced Practice for Class 10 Sanskrit (12 Videos, 12 PDFs)',
    category: '2.0 Revision',
    badge: 'REVISION EDITION',
    thumbnail: 'https://d1xo3otg0k74xn.cloudfront.net/566/admin_v1/bundle_management/course/153063845307_PRO%202027%20BANNER%20%20%282%29.jpg',
    mentor: 'GB STUDY Faculty',
    targetYear: '2026 - 2027',
    language: 'Hindi / Sanskrit',
    isFree: true,
    description: 'Shemushi 2.0 edition featuring accelerated lessons on Sandhi 2.0, Pratyaya 2.0, Anuvad 2.0, and high-weightage board exam prediction questions.',
    features: [
      '12 Rapid Revision Video Lectures',
      '12 Chapter PDFs & Answer Keys',
      'High-yield board exam practice'
    ],
    telegramGroupUrl: 'https://t.me/GBFreestudy',
    subjects: [shemushi2Subject]
  },
  {
    id: '49853',
    name: 'MANIKA 2.0 BATCH',
    subtitle: 'Rapid Revision & Advanced Practice for Manika Course (12 Videos, 12 PDFs)',
    category: '2.0 Revision',
    badge: 'REVISION EDITION',
    thumbnail: 'https://d1xo3otg0k74xn.cloudfront.net/566/admin_v1/bundle_management/course/601144344743_PRO%20BATCH%202.0%20%283%29.jpg',
    mentor: 'GB STUDY Faculty',
    targetYear: '2026 - 2027',
    language: 'Hindi / Sanskrit',
    isFree: true,
    description: 'Manika 2.0 edition featuring accelerated lessons on Sandhi 2.0, Pratyaya 2.0, Anuvad 2.0, and high-weightage board exam prediction questions for Course B.',
    features: [
      '12 Rapid Revision Video Lectures',
      '12 Chapter PDFs & Answer Keys',
      'High-yield board exam practice'
    ],
    telegramGroupUrl: 'https://t.me/GBFreestudy',
    subjects: [manika2Subject]
  }
];
