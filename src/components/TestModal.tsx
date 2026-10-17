import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Clock, Award, RotateCcw, GraduationCap, Zap } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface TestModalProps {
  isOpen: boolean;
  testTitle: string;
  onClose: () => void;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'अधोलिखितवाक्येषु रेखांकितपदस्य सन्धिविच्छेदं कुरुत: "महानगरेषु जीवनं दुर्वाहं जातम।"',
    options: ['दुः + वहम्', 'दुर् + वहम्', 'दुस् + वहम्', 'दुह् + वहम्'],
    correctIndex: 0,
    explanation: 'विसर्गसन्धेः नियमानुसारम् विसर्गस्य रेफे (र्) परिवर्तनं भवति, अतः दुः + वहम् = दुर्वाहम्।'
  },
  {
    id: 2,
    question: 'रेखांकितपदस्य समासविग्रहं वा पदं वा लिखत: "महानगरेषु कालायसचक्रम् अनिशं प्रचलति।"',
    options: ['कालायसस्य चक्रम्', 'कालायसाय चक्रम्', 'कालस्य अयसचक्रम्', 'कालायसेन चक्रम्'],
    correctIndex: 0,
    explanation: 'षष्ठी तत्पुरुष समास: कालायसस्य (लोहे का) चक्रम् = कालायसचक्रम्।'
  },
  {
    id: 3,
    question: 'उचितप्रत्ययं चित्वा लिखत: "सा बुद्धिमती स्त्री कुत्रचित् गता।"',
    options: ['बुद्धि + मतुप्', 'बुद्धि + वतुप्', 'बुद्धि + टाप्', 'बुद्धि + ईयसुन्'],
    correctIndex: 0,
    explanation: 'बुद्धि शब्दे मतुप् प्रत्ययस्य योगेन बुद्धिमत् भवति, स्त्रीलिंगे बुद्धिमती।'
  },
  {
    id: 4,
    question: 'वाच्यपरिवर्तनं कुरुत: "बालकः पुस्तकं पठति।" (कर्मवाच्ये परिवर्त्यताम्)',
    options: ['बालकेन पुस्तकं पठ्यते।', 'बालकाय पुस्तकं पठति।', 'बालकात् पुस्तकं पठ्यते।', 'बालकेन पुस्तकः पठ्यते।'],
    correctIndex: 0,
    explanation: 'कर्मवाच्ये कर्तरि तृतीया (बालकेन), कर्मणि प्रथमा (पुस्तकम्) तथा क्रिया कर्मानुसारेण आत्मनेपदे (पठ्यते) भवति।'
  },
  {
    id: 5,
    question: 'उचितसमयवाचकपदं चिनुत: "अहं प्रातः 07:15 वादने विद्यालयं गच्छामि।"',
    options: ['सपाद-सप्तवादने', 'सार्ध-सप्तवादने', 'पादोनाष्टवादने', 'सप्तवादने'],
    correctIndex: 0,
    explanation: '07:15 इत्यस्य कृते "सपाद-सप्त" इति प्रयुज्यते।'
  }
];

export const TestModal: React.FC<TestModalProps> = ({ isOpen, testTitle, onClose }) => {
  const [mode, setMode] = useState<'chooser' | 'learn' | 'practice'>('chooser');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (mode === 'practice' && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (mode === 'practice' && timeLeft === 0 && !isFinished) {
      setIsFinished(true);
    }
  }, [mode, isFinished, timeLeft]);

  if (!isOpen) return null;

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    if (mode === 'learn') {
      setShowSolution((prev) => ({ ...prev, [currentIdx]: true }));
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const calculateScore = () => {
    let score = 0;
    SAMPLE_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = SAMPLE_QUESTIONS[currentIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#140819] border border-pink-500/40 rounded-3xl p-6 shadow-2xl shadow-pink-950/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-pink-300 hover:text-white bg-pink-900/40 hover:bg-pink-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. CHOOSER SCREEN */}
        {mode === 'chooser' && (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/40 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-pink-600/30">
              <GraduationCap className="w-8 h-8 text-pink-400" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                {testTitle || 'Chapter Practice Test'}
              </h3>
              <p className="text-xs text-pink-200/70">
                Select how you want to take this test
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setMode('learn')}
                className="p-5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-pink-600/40 transition-all flex flex-col items-center gap-2 cursor-pointer group"
              >
                <GraduationCap className="w-7 h-7 transition-transform group-hover:scale-110" />
                <span className="tracking-wide">LEARN MODE</span>
                <span className="text-[11px] font-normal opacity-90">Instant solutions & grammar explanations</span>
              </button>

              <button
                onClick={() => setMode('practice')}
                className="p-5 bg-pink-950/50 hover:bg-pink-900/60 border-2 border-pink-500/30 hover:border-pink-500 text-white font-extrabold text-sm rounded-2xl transition-all flex flex-col items-center gap-2 cursor-pointer group"
              >
                <Zap className="w-7 h-7 text-pink-400 transition-transform group-hover:scale-110" />
                <span className="tracking-wide">PRACTICE MODE</span>
                <span className="text-[11px] font-normal text-pink-200/70">5-minute timer & score card</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. TEST ACTIVE */}
        {mode !== 'chooser' && !isFinished && (
          <div className="flex flex-col h-full">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-3 mb-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-pink-400">
                  {mode === 'learn' ? 'Learn Mode' : 'Practice Mode'}
                </span>
                <p className="text-sm font-bold text-white truncate max-w-xs">{testTitle}</p>
              </div>

              {mode === 'practice' && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-pink-950/80 border border-pink-500/30 rounded-xl text-pink-300 font-mono text-xs font-bold">
                  <Clock className="w-4 h-4 text-pink-400" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            {/* Question Card */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="flex items-center justify-between text-xs text-pink-300 font-semibold">
                <span>Question {currentIdx + 1} of {SAMPLE_QUESTIONS.length}</span>
                <span>Points: +1</span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed bg-[#190a20] p-4 rounded-2xl border border-pink-500/20">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;
                  const showSol = mode === 'learn' && showSolution[currentIdx];

                  let btnStyle = 'bg-pink-950/30 border-pink-500/20 hover:border-pink-500/60 text-pink-100';

                  if (showSol) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-600/30';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-xs font-mono">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </span>

                      {showSol && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {showSol && isSelected && !isCorrect && (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Solution for Learn Mode */}
              {mode === 'learn' && showSolution[currentIdx] && (
                <div className="p-3.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-xs text-pink-200 leading-relaxed animate-in fade-in">
                  <span className="font-bold text-pink-400 block mb-1">💡 व्याख्या (Explanation):</span>
                  {currentQ.explanation}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between border-t border-pink-500/20 pt-4 mt-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2 bg-pink-950/40 hover:bg-pink-900/40 text-pink-200 disabled:opacity-30 rounded-xl text-xs font-semibold border border-pink-500/20 cursor-pointer"
              >
                Previous
              </button>

              {currentIdx < SAMPLE_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-600/40 transition-all cursor-pointer"
                >
                  Finish Test
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. TEST RESULTS */}
        {isFinished && (
          <div className="py-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/40 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-pink-600/30">
              <Award className="w-10 h-10 text-pink-400" />
            </div>

            <h3 className="text-2xl font-black text-white">Test Completed!</h3>

            <div className="p-4 rounded-2xl bg-[#190a20] border border-pink-500/30 max-w-sm mx-auto">
              <p className="text-xs text-pink-300 font-semibold uppercase mb-1">Your Score</p>
              <div className="text-4xl font-extrabold text-white font-mono">
                {calculateScore()} / {SAMPLE_QUESTIONS.length}
              </div>
              <p className="text-xs text-pink-200/80 mt-1">
                Accuracy: {Math.round((calculateScore() / SAMPLE_QUESTIONS.length) * 100)}%
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setShowSolution({});
                  setCurrentIdx(0);
                  setIsFinished(false);
                  setMode('chooser');
                }}
                className="px-5 py-2.5 bg-pink-950/60 hover:bg-pink-900 border border-pink-500/30 text-pink-200 hover:text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Test</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/40 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
