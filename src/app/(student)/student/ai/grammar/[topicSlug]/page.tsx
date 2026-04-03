// src/app/(student)/student/ai/grammar/[topicSlug]/page.tsx
'use client';

import React, { useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Plane, ShoppingBag, HeartPulse, Briefcase,
  Loader2, ArrowRight, BookOpenCheck
} from 'lucide-react';
import { GrammarQuestion, GrammarAnswer, GrammarLevel, GrammarQuizResult } from '@/types/ai-grammar';
import { QuizProgress } from '@/components/student/ai/grammar/QuizProgress';
import { QuizQuestion } from '@/components/student/ai/grammar/QuizQuestion';
import { QuizResult } from '@/components/student/ai/grammar/QuizResult';
import { toast } from 'sonner';

// ─── Topic data ───────────────────────────────────────────────────────────────

const TOPICS_DATA = [
  { id: 'social', title: 'Xã giao & Đời sống', icon: <Users size={24} /> },
  { id: 'travel', title: 'Du lịch & Di chuyển', icon: <Plane size={24} /> },
  { id: 'service', title: 'Dịch vụ & Mua sắm', icon: <ShoppingBag size={24} /> },
  { id: 'health', title: 'Sức khỏe & Khẩn cấp', icon: <HeartPulse size={24} /> },
  { id: 'work', title: 'Học tập & Công việc', icon: <Briefcase size={24} /> },
];

// ─── Helper: tính kết quả ─────────────────────────────────────────────────────

function calculateResult(
  questions: GrammarQuestion[],
  answers: GrammarAnswer[]
): GrammarQuizResult {
  const score = answers.filter((a) => a.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? (score / total) * 100 : 0;

  // Phân tích theo level
  const levels: GrammarLevel[] = ['A1', 'A2', 'B1', 'B2'];
  const levelBreakdown = {} as Record<GrammarLevel, { correct: number; total: number }>;

  for (const level of levels) {
    const levelQuestions = questions.filter((q) => q.level === level);
    const levelAnswers = answers.filter((a) => {
      const q = questions.find((qq) => qq.id === a.questionId);
      return q?.level === level;
    });
    levelBreakdown[level] = {
      total: levelQuestions.length,
      correct: levelAnswers.filter((a) => a.isCorrect).length,
    };
  }

  // Feedback tự động
  let feedback = '';
  if (percentage >= 90) {
    feedback = 'Tuyệt vời! Bạn nắm rất vững ngữ pháp tiếng Nga ở tất cả các cấp độ. Hãy thử thách bản thân với các chủ đề khác!';
  } else if (percentage >= 70) {
    feedback = 'Kết quả tốt! Bạn đã nắm được phần lớn ngữ pháp cơ bản. Hãy tập trung cải thiện ở những cấp độ còn yếu.';
  } else if (percentage >= 50) {
    feedback = 'Bạn đang tiến bộ! Hãy ôn lại các quy tắc ngữ pháp ở phần giải thích và luyện tập thêm.';
  } else {
    feedback = 'Đừng nản lòng! Ngữ pháp tiếng Nga cần thời gian. Hãy đọc kỹ phần giải thích và thử lại nhé.';
  }

  // Thêm chi tiết theo level
  for (const level of levels) {
    const data = levelBreakdown[level];
    if (data.total > 0) {
      const pct = Math.round((data.correct / data.total) * 100);
      if (pct < 50) {
        feedback += ` Cần chú ý cải thiện ở cấp độ ${level}.`;
      }
    }
  }

  return { score, total, percentage, levelBreakdown, feedback };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GrammarQuizPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicSlug = resolvedParams.topicSlug;
  const topic = TOPICS_DATA.find((t) => t.id === topicSlug);

  // ─── State ──────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<GrammarAnswer[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState<GrammarQuizResult | null>(null);

  // ─── Handlers ───────────────────────────────────────────────────────────

  const startQuiz = useCallback(async () => {
    setIsLoading(true);
    setIsStarted(true);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedIndex(null);
    setIsAnswered(false);
    setResult(null);

    try {
      const res = await fetch('/api/grammar-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic?.title || topicSlug, count: 20 }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Lỗi HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('AI không tạo được câu hỏi.');
      }

      setQuestions(data.data);
    } catch (error) {
      console.error(error);
      toast.error(`Lỗi: ${error instanceof Error ? error.message : 'Không xác định'}`);
      setIsStarted(false);
    } finally {
      setIsLoading(false);
    }
  }, [topic?.title, topicSlug]);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const q = questions[currentIndex];
    const isCorrect = index === q.correctIndex;
    setAnswers((prev) => [
      ...prev,
      { questionId: q.id, selectedIndex: index, isCorrect },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Kết thúc quiz
      const finalResult = calculateResult(questions, [
        ...answers,
      ]);
      setResult(finalResult);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setIsStarted(false);
    // Sẽ gọi startQuiz khi user bấm nút
  };

  // ─── Not Found ──────────────────────────────────────────────────────────

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Chủ đề này không tồn tại</h1>
        <button
          onClick={() => router.push('/student/ai/grammar')}
          className="text-white bg-[#f07b32] px-6 py-2 rounded-xl"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // ─── Result Screen ─────────────────────────────────────────────────────

  if (result) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] font-sans">
        <main className="container mx-auto px-4 py-8 max-w-[680px]">
          <QuizResult result={result} topicTitle={topic.title} onRetry={handleRetry} />
        </main>
      </div>
    );
  }

  // ─── Main UI ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans">
      <main className="container mx-auto px-4 py-8 max-w-[780px]">

        {/* Quiz Container */}
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

          {/* Header */}
          <div className="p-5 md:p-6 border-b flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-[#f07b32] rounded-xl">
                <BookOpenCheck size={22} />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-800">{topic.title}</h1>
                <p className="text-xs text-gray-400">Ngữ pháp AI · 20 câu hỏi</p>
              </div>
            </div>
            {isStarted && questions.length > 0 && (
              <button
                onClick={() => router.push('/student/ai/grammar')}
                className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
              >
                Thoát
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">

            {/* ── Chưa bắt đầu ── */}
            {!isStarted && (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-28 h-28 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <span className="text-5xl">📝</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-3 text-gray-800">Sẵn sàng kiểm tra?</h3>
                <p className="text-gray-500 mb-3 max-w-sm">
                  AI sẽ tạo <strong>20 câu trắc nghiệm</strong> về ngữ pháp tiếng Nga theo chủ đề <strong>{topic.title}</strong>.
                </p>
                <p className="text-xs text-gray-400 mb-8 max-w-xs">
                  📊 Câu hỏi trải đều từ <strong>A1 → B2</strong>. Mỗi lần là bộ câu hỏi hoàn toàn mới!
                </p>
                <button
                  onClick={startQuiz}
                  className="bg-[#f07b32] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:bg-[#e26a24] transition-all flex items-center gap-2"
                >
                  🚀 Bắt đầu làm bài
                </button>
              </div>
            )}

            {/* ── Loading ── */}
            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <Loader2 size={36} className="animate-spin text-[#f07b32]" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">AI đang tạo câu hỏi...</h3>
                <p className="text-sm text-gray-400">Vui lòng đợi trong giây lát</p>
              </div>
            )}

            {/* ── Quiz đang diễn ra ── */}
            {isStarted && !isLoading && questions.length > 0 && (
              <div className="space-y-6">
                {/* Progress */}
                <QuizProgress
                  current={currentIndex}
                  total={questions.length}
                  level={questions[currentIndex].level}
                  correctCount={answers.filter((a) => a.isCorrect).length}
                />

                {/* Question */}
                <QuizQuestion
                  key={currentIndex}
                  question={questions[currentIndex]}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                  isAnswered={isAnswered}
                />

                {/* Next Button */}
                {isAnswered && (
                  <div className="flex justify-end pt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <button
                      onClick={handleNext}
                      className="bg-[#f07b32] hover:bg-[#d46522] text-white px-8 py-3.5 rounded-2xl font-bold text-base transition-all flex items-center gap-2"
                    >
                      {currentIndex + 1 >= questions.length ? (
                        <>Xem kết quả</>
                      ) : (
                        <>Câu tiếp <ArrowRight size={18} /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
