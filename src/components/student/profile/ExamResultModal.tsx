// src/components/student/profile/ExamResultModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { TestRecord } from '@/types/profile';
import { getSubmissionDetail, QuestionResult, SubmissionDetail } from '@/actions/examSubmissions';
import {
  X, Trophy, BookOpen, CheckCircle2, XCircle, Loader2,
  ChevronDown, ChevronUp, Bot, Lightbulb, Volume2, AlignLeft,
  MoveRight,
} from 'lucide-react';

// ─── Label helpers ─────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: 'Trắc nghiệm',
  reading_mcq: 'Đọc hiểu – Trắc nghiệm',
  reading_open: 'Đọc hiểu – Tự luận',
  listening_mcq: 'Nghe – Trắc nghiệm',
  listening_fill: 'Nghe – Điền từ',
  listening_open: 'Nghe – Tự luận',
  word_arrangement: 'Sắp xếp câu',
  error_correction: 'Tìm và sửa lỗi sai',
  essay: 'Tự luận',
  fill_in_blank: 'Điền vào chỗ trống',
};

// ─── Score badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ passed }: { passed: boolean }) {
  return (
    <span className={`text-sm font-bold px-4 py-1.5 rounded-full mt-3 inline-block ${passed ? 'bg-green-500 text-white' : 'bg-red-400 text-white'}`}>
      {passed ? '🎉 ĐẠT' : '❌ CHƯA ĐẠT'}
    </span>
  );
}

function CorrectnessBadge({ isCorrect }: { isCorrect: boolean | null }) {
  if (isCorrect === null) return (
    <span className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
      <Bot size={11} /> AI chấm
    </span>
  );
  return isCorrect ? (
    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full whitespace-nowrap">
      <CheckCircle2 size={11} /> Đúng
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full whitespace-nowrap">
      <XCircle size={11} /> Sai
    </span>
  );
}

// ─── MCQ Options ──────────────────────────────────────────────────────────────

function McqOptions({ options, userIndexes, correctIndexes }: {
  options: string[];
  userIndexes: number[];
  correctIndexes: number[];
}) {
  return (
    <div className="grid gap-2 mt-2">
      {options.map((opt, i) => {
        const isUser = userIndexes.includes(i);
        const isCorrect = correctIndexes.includes(i);
        let cls = 'border-gray-200 bg-white text-gray-700';
        let icon = null;
        if (isCorrect && isUser) { cls = 'border-green-500 bg-green-50 text-green-800 font-semibold'; icon = <CheckCircle2 size={14} className="text-green-500 shrink-0" />; }
        else if (isCorrect) { cls = 'border-green-400 bg-green-50/60 text-green-700'; icon = <CheckCircle2 size={14} className="text-green-400 shrink-0" />; }
        else if (isUser) { cls = 'border-red-400 bg-red-50 text-red-700 font-semibold'; icon = <XCircle size={14} className="text-red-400 shrink-0" />; }
        return (
          <div key={i} className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm ${cls}`}>
            <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold opacity-60">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{opt}</span>
            {icon}
            {isUser && !isCorrect && (
              <span className="text-xs font-bold text-red-400 ml-1">← bạn chọn</span>
            )}
            {isCorrect && !isUser && (
              <span className="text-xs font-bold text-green-500 ml-1">← đáp án đúng</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Error Correction Display ─────────────────────────────────────────────────

function ErrorCorrectionDisplay({ q }: { q: QuestionResult }) {
  const opts = q.rawOptions;
  const sentence = opts?.sentence || '';
  let pairs: { wrong: string; correct: string }[] = [];
  try {
    const p = JSON.parse(q.userAnswer);
    pairs = Array.isArray(p) ? p : [];
  } catch { pairs = []; }
  const adminWrong = opts?.wrong_part || '';
  const adminCorrect = opts?.correct_part || '';

  return (
    <div className="space-y-3 mt-2">
      {sentence && (
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm italic text-gray-700 leading-relaxed">
          "{sentence}"
        </div>
      )}
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Câu trả lời của bạn:</p>
        {pairs.length > 0 ? pairs.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">"{p.wrong || '(trống)'}"</span>
            <MoveRight size={14} className="text-gray-400 shrink-0" />
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">"{p.correct || '(trống)'}"</span>
          </div>
        )) : <span className="text-gray-400 italic text-sm">Chưa trả lời</span>}
      </div>
      {(adminWrong || adminCorrect) && (
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Đáp án admin:</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">"{adminWrong}"</span>
            <MoveRight size={14} className="text-gray-400 shrink-0" />
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">"{adminCorrect}"</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Word Arrangement Display ─────────────────────────────────────────────────

function WordArrangementDisplay({ q }: { q: QuestionResult }) {
  const opts = q.rawOptions;
  const words: string[] = opts?.words || [];
  const correct = opts?.correct_sentence || q.correctAnswer;

  return (
    <div className="space-y-3 mt-2">
      {words.length > 0 && (
        <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-sm font-medium text-orange-800 text-center tracking-wide">
          {words.join('  |  ')}
        </div>
      )}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Câu trả lời của bạn:</p>
        <p className={`text-sm font-medium px-3 py-2 rounded-lg ${q.isCorrect ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {q.userAnswer || <span className="italic text-gray-400">Chưa trả lời</span>}
        </p>
      </div>
      {correct && !q.isCorrect && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Câu đúng:</p>
          <p className="text-sm font-medium px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200">{correct}</p>
        </div>
      )}
    </div>
  );
}

// ─── Text Answer Display (listening_fill, fill_in_blank, essay, open) ─────────

function TextAnswerDisplay({ q }: { q: QuestionResult }) {
  const isOpen = ['essay', 'reading_open', 'listening_open'].includes(q.type);
  return (
    <div className="space-y-3 mt-2">
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Câu trả lời của bạn:</p>
        <p className={`text-sm font-medium px-3 py-2 rounded-lg min-h-[40px] ${
          q.isCorrect === true ? 'bg-green-50 text-green-700 border border-green-200' :
          q.isCorrect === false ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {q.userAnswer || <span className="italic text-gray-400">Chưa trả lời</span>}
        </p>
      </div>
      {q.correctAnswer && !q.isCorrect && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
            {isOpen ? 'Đáp án mẫu:' : 'Đáp án đúng:'}
          </p>
          <p className="text-sm font-medium px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200">{q.correctAnswer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Question Item (accordion) ────────────────────────────────────────────────

function QuestionItem({ q, index }: { q: QuestionResult; index: number }) {
  const [open, setOpen] = useState(false);
  const opts = q.rawOptions || {};

  const borderColor = q.isCorrect === true ? 'border-green-200' : q.isCorrect === false ? 'border-red-200' : 'border-blue-200';
  const bgColor = q.isCorrect === true ? 'bg-green-50/30' : q.isCorrect === false ? 'bg-red-50/30' : 'bg-blue-50/30';

  // Rich context from rawOptions
  const passage: string = opts.passage || '';
  const audioUrl: string = opts.audio_url || opts.media_url || '';
  const mcqOptions: string[] = Array.isArray(opts.options) ? opts.options : [];
  const correctIndexes: number[] = Array.isArray(opts.correct_indexes) ? opts.correct_indexes.map(Number) : [];
  const isMcq = ['multiple_choice', 'reading_mcq', 'listening_mcq'].includes(q.type);

  // Parse user MCQ selections
  let userIndexes: number[] = [];
  if (isMcq && q.userAnswer) {
    try { const p = JSON.parse(q.userAnswer); userIndexes = Array.isArray(p) ? p.map(Number) : []; }
    catch { userIndexes = []; }
  }

  // Build question display text
  const displayText = (() => {
    if (q.type === 'word_arrangement') return opts.context || 'Sắp xếp các từ thành câu hoàn chỉnh';
    if (q.type === 'error_correction') return 'Tìm và sửa lỗi sai trong câu dưới đây';
    if (q.type === 'listening_fill') return opts.transcript_template || q.questionText;
    return q.questionText;
  })();

  const typeLabel = TYPE_LABELS[q.type] || q.type;

  return (
    <div className={`rounded-2xl border-2 ${borderColor} ${bgColor} overflow-hidden`}>
      {/* Collapsed header */}
      <button
        className="w-full flex items-start justify-between gap-3 p-4 text-left"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="shrink-0 w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{typeLabel}</p>
            <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2"
               dangerouslySetInnerHTML={{ __html: displayText || `Câu ${index + 1}` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <CorrectnessBadge isCorrect={q.isCorrect} />
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/60 pt-3">

          {/* Audio player */}
          {audioUrl && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={14} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Audio</span>
              </div>
              <audio controls className="w-full outline-none" controlsList="nodownload">
                <source src={audioUrl} />
              </audio>
            </div>
          )}

          {/* Reading passage */}
          {passage && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft size={14} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Đoạn văn</span>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed italic"
                   dangerouslySetInnerHTML={{ __html: passage }} />
            </div>
          )}

          {/* Full question text (if different from header) */}
          {q.type !== 'word_arrangement' && q.type !== 'error_correction' && (
            <div className="rounded-xl bg-white border border-gray-100 p-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Câu hỏi</p>
              <div className="text-sm font-semibold text-gray-800 leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: displayText || `Câu ${index + 1}` }} />
            </div>
          )}

          {/* Answer section — per type */}
          {isMcq && mcqOptions.length > 0 ? (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Các lựa chọn</p>
              <McqOptions options={mcqOptions} userIndexes={userIndexes} correctIndexes={correctIndexes} />
            </div>
          ) : q.type === 'error_correction' ? (
            <ErrorCorrectionDisplay q={q} />
          ) : q.type === 'word_arrangement' ? (
            <WordArrangementDisplay q={q} />
          ) : (
            <TextAnswerDisplay q={q} />
          )}

          {/* AI feedback */}
          {q.aiFeedback && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 flex gap-2">
              <Bot size={15} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-500 mb-1">Nhận xét AI</p>
                <p className="text-xs text-blue-700 leading-relaxed">{q.aiFeedback}</p>
              </div>
            </div>
          )}

          {/* Admin explanation */}
          {q.explanation && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex gap-2">
              <Lightbulb size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-500 mb-1">Giải thích đáp án</p>
                <p className="text-xs text-amber-700 leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Summary header ───────────────────────────────────────────────────────────

function SummaryHeader({ detail }: { detail: SubmissionDetail }) {
  const pct = Math.round((detail.score / detail.totalScore) * 100);
  return (
    <div className={`p-6 flex flex-col items-center text-center ${detail.passed ? 'bg-gradient-to-br from-green-50 to-emerald-100' : 'bg-gradient-to-br from-red-50 to-orange-100'}`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-lg ${detail.passed ? 'bg-green-500 shadow-green-500/30' : 'bg-red-400 shadow-red-400/30'}`}>
        {detail.passed ? <Trophy size={26} className="text-white" /> : <BookOpen size={26} className="text-white" />}
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1 mt-1">{detail.examTitle}</h3>
      <div className={`text-4xl font-black mb-0.5 ${detail.passed ? 'text-green-600' : 'text-red-500'}`}>
        {detail.score.toFixed(1)}
        <span className="text-xl font-bold opacity-50">/{detail.totalScore.toFixed(0)}</span>
      </div>
      <p className="text-xs text-gray-500 font-medium">{pct}% đúng</p>
      <ScoreBadge passed={detail.passed} />
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface ExamResultModalProps {
  record: TestRecord;
  onClose: () => void;
}

export function ExamResultModal({ record, onClose }: ExamResultModalProps) {
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = record.submissionId || record.id;
    if (!id) { setError('Không có dữ liệu bài làm.'); setLoading(false); return; }
    setLoading(true);
    getSubmissionDetail(id).then(res => {
      if (res.success) setDetail(res.data);
      else setError(res.error);
      setLoading(false);
    });
  }, [record.submissionId, record.id]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-800 shadow transition"
        >
          <X size={17} />
        </button>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="animate-spin text-[#7c3aed]" />
            <p className="text-gray-500 font-medium">Đang tải kết quả chi tiết...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 px-8 text-center">
            <XCircle size={40} className="text-red-400" />
            <p className="text-red-500 font-semibold">{error}</p>
            <button onClick={onClose} className="mt-2 px-6 py-2 bg-gray-100 rounded-xl font-bold text-gray-600 text-sm hover:bg-gray-200 transition">Đóng</button>
          </div>
        )}

        {!loading && detail && (
          <>
            {/* Fixed score header */}
            <SummaryHeader detail={detail} />

            {/* Scrollable question list */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-gray-700">Chi tiết từng câu ({detail.questions.length} câu)</h4>
                  <span className="text-xs text-gray-400">Nhấn vào câu để xem chi tiết</span>
                </div>
                {detail.questions.map((q, i) => <QuestionItem key={q.id || i} q={q} index={i} />)}
                {detail.questions.length === 0 && (
                  <p className="text-center text-gray-400 italic py-8 text-sm">Không có dữ liệu câu hỏi.</p>
                )}
              </div>
            </div>

            {/* Fixed footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full py-3.5 font-bold text-white bg-[#7c3aed] hover:bg-purple-700 rounded-xl transition shadow-md shadow-purple-500/20 text-sm"
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
