'use client';

import React, { useState, useRef, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Send, Square, CheckCircle2, Circle, Loader2, Lightbulb, Timer, Star, RotateCcw } from 'lucide-react';
import roleplayData from '@/data/roleplay.json';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { RoleplayMessage } from '@/components/student/ai/chat/RoleplayMessage';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoleplayMessageData {
  role: 'user' | 'model';
  content: string;
  type: 'text' | 'audio';
  reply_vi?: string | null;
  correction?: string | null;
}

interface HintState {
  [objectiveId: string]: 'vi' | 'ru'; // Level of hint revealed
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function calculateStars(objectivesCompleted: number, totalObjectives: number, hintsUsed: number, timeSeconds: number): number {
  const completionRatio = objectivesCompleted / totalObjectives;
  if (completionRatio < 0.5) return 1;

  let stars = 3;
  // Penalty for hints
  if (hintsUsed > 3) stars -= 1;
  if (hintsUsed > 6) stars -= 1;
  // Penalty for incomplete
  if (completionRatio < 1) stars -= 1;
  // Bonus for speed (under 3 minutes for full completion)
  if (completionRatio === 1 && timeSeconds < 180 && hintsUsed === 0) stars = 3;

  return Math.max(1, Math.min(3, stars));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RoleplayRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicId = resolvedParams.id;
  const topic = roleplayData.find(t => t.id === topicId);

  // ─── State ──────────────────────────────────────────────────────────────────

  const [messages, setMessages] = useState<RoleplayMessageData[]>([]);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Hint system
  const [hints, setHints] = useState<HintState>({});
  const [hintsUsed, setHintsUsed] = useState(0);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Speech
  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
  } = useSpeechRecognition('ru-RU');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevRecordingRef = useRef(false);

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!topic) {
      router.push('/student/ai/immersive/roleplay');
    }
  }, [topic, router]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update input with transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Fix: Auto-send when recording stops (instead of setTimeout race condition)
  useEffect(() => {
    if (prevRecordingRef.current && !isRecording && transcript.trim()) {
      // Recording just stopped and we have a transcript → auto-send
      handleSend(transcript.trim());
    }
    prevRecordingRef.current = isRecording;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  // ─── Timer ──────────────────────────────────────────────────────────────────

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────

  if (!topic) return null;

  const playAudio = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    window.speechSynthesis.speak(utterance);
  };

  const startRoleplay = () => {
    setIsStarted(true);
    startTimer();
    const firstMsg: RoleplayMessageData = {
      role: 'model',
      content: topic.first_message,
      type: 'text',
      reply_vi: null,
      correction: null,
    };
    setMessages([firstMsg]);
    playAudio(topic.first_message);
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMsg: RoleplayMessageData = { role: 'user', content, type: 'text' };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    resetTranscript();
    setIsTyping(true);

    try {
      const res = await fetch('/api/roleplay-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content, type: m.type })),
          context: topic.context,
          ai_role: topic.ai_role,
          objectives: topic.objectives,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Add correction to the user message retroactively
      if (data.correction) {
        setMessages(prev => {
          const updated = [...prev];
          const lastUserIdx = updated.length - 1; // last message is the user msg we just added
          if (updated[lastUserIdx]?.role === 'user') {
            updated[lastUserIdx] = { ...updated[lastUserIdx], correction: data.correction };
          }
          return updated;
        });
      }

      // Add AI response
      const aiMsg: RoleplayMessageData = {
        role: 'model',
        content: data.reply,
        type: 'text',
        reply_vi: data.reply_vi || null,
        correction: null,
      };

      setMessages(prev => [...prev, aiMsg]);
      setCompletedObjectives(data.completed_objectives || []);
      playAudio(data.reply);

      // Check win condition
      if (data.completed_objectives?.length === topic.objectives.length) {
        toast.success("Chúc mừng! Bạn đã hoàn thành toàn bộ nhiệm vụ!", { duration: 3000 });
        stopTimer();
        setTimeout(() => setIsFinished(true), 2500);
      }
    } catch {
      toast.error('Lỗi khi gửi tin nhắn.');
    } finally {
      setIsTyping(false);
    }
  };

  const toggleRecording = () => {
    if (!isSupported) {
      toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.");
      return;
    }
    if (isRecording) {
      stopRecording();
      // Auto-send is handled by the useEffect watching isRecording
    } else {
      resetTranscript();
      setInput('');
      startRecording();
    }
  };

  const revealHint = (objectiveId: string) => {
    setHints(prev => {
      const current = prev[objectiveId];
      if (!current) {
        setHintsUsed(h => h + 1);
        return { ...prev, [objectiveId]: 'vi' };
      }
      if (current === 'vi') {
        setHintsUsed(h => h + 1);
        return { ...prev, [objectiveId]: 'ru' };
      }
      return prev; // Already at max
    });
  };

  const handleRestart = () => {
    setMessages([]);
    setCompletedObjectives([]);
    setIsFinished(false);
    setIsStarted(false);
    setHints({});
    setHintsUsed(0);
    setElapsedSeconds(0);
    stopTimer();
  };

  const isAllCompleted = completedObjectives.length === topic.objectives.length;

  // ─── Evaluation Screen ──────────────────────────────────────────────────────

  if (isFinished) {
    const stars = calculateStars(completedObjectives.length, topic.objectives.length, hintsUsed, elapsedSeconds);
    const percentage = Math.round((completedObjectives.length / topic.objectives.length) * 100);

    let title = '';
    let message = '';

    if (percentage < 50) {
      title = 'Khách du lịch bỡ ngỡ';
      message = 'Giao tiếp còn khá hạn chế. Đừng ngại dùng gợi ý và thử lại nhé!';
    } else if (percentage < 100) {
      title = 'Người giao tiếp tự tin';
      message = 'Rất tốt! Bạn đã giải quyết được phần lớn vấn đề. Chỉ chút nữa là hoàn hảo.';
    } else {
      title = 'Người bản xứ thực thụ';
      message = 'Xuất sắc! Bạn đã xử lý tình huống cực kỳ mượt mà.';
    }

    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
        <main className="flex-1 container mx-auto px-4 py-8 max-w-[800px]">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <Star
                  key={i}
                  size={48}
                  className={i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                  strokeWidth={1.5}
                />
              ))}
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-400 text-sm mb-6">{topic.title}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto">
              <div className="bg-orange-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-[#f07b32]">{completedObjectives.length}/{topic.objectives.length}</div>
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-1">Nhiệm vụ</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-blue-600">{formatTime(elapsedSeconds)}</div>
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mt-1">Thời gian</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-purple-600">{hintsUsed}</div>
                <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mt-1">Gợi ý</div>
              </div>
            </div>

            <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">{message}</p>

            {/* Hint penalty info */}
            {hintsUsed > 0 && (
              <p className="text-sm text-amber-600 mb-6">
                💡 Bạn đã dùng {hintsUsed} gợi ý. Thử lại không dùng gợi ý để đạt 3 ⭐!
              </p>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> Chơi lại
              </button>
              <button
                onClick={() => router.push('/student/ai/immersive/roleplay')}
                className="px-6 py-3 bg-[#f07b32] text-white font-bold rounded-xl hover:bg-[#e26a24] transition-colors"
              >
                Chọn kịch bản khác
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Practice UI ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="font-bold text-gray-800 text-xl">{topic.title}</div>
            {isStarted && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                <Timer size={14} /> {formatTime(elapsedSeconds)}
              </div>
            )}
          </div>
          {isStarted && (
            <button
              onClick={() => { stopTimer(); setIsFinished(true); }}
              disabled={isTyping}
              className="bg-red-50 text-red-500 font-bold px-4 py-2 rounded-xl border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              Kết thúc kịch bản
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">

          {/* QUEST BOARD */}
          <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <h3 className="font-extrabold text-gray-800 text-lg mb-4 border-b pb-4 flex items-center justify-between">
              Bảng Nhiệm Vụ
              <span className="text-sm bg-orange-100 text-[#f07b32] px-2 py-1 rounded-lg">
                {completedObjectives.length} / {topic.objectives.length}
              </span>
            </h3>
            <p className="text-sm text-gray-500 mb-6 italic">{topic.context}</p>

            <div className="flex-1 overflow-y-auto space-y-3">
              {topic.objectives.map((obj) => {
                const isDone = completedObjectives.includes(obj.id);
                const hintLevel = hints[obj.id];

                return (
                  <div key={obj.id} className={`p-3 rounded-2xl border transition-all ${
                    isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isDone
                          ? <CheckCircle2 className="text-green-500" size={18} />
                          : <Circle className="text-gray-300" size={18} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isDone ? 'text-green-800 line-through decoration-green-300' : 'text-gray-600'}`}>
                          {obj.description}
                        </div>

                        {/* Hints */}
                        {!isDone && hintLevel && (
                          <div className="mt-2 space-y-1 animate-in fade-in duration-200">
                            <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
                              🇻🇳 {obj.hint_vi}
                            </div>
                            {hintLevel === 'ru' && (
                              <div className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 font-medium">
                                🇷🇺 {obj.hint_ru}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Hint button */}
                      {!isDone && isStarted && (
                        <button
                          onClick={() => revealHint(obj.id)}
                          disabled={hintLevel === 'ru'}
                          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            hintLevel === 'ru'
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-amber-50 text-amber-500 hover:bg-amber-100 border border-amber-200'
                          }`}
                          title={!hintLevel ? 'Gợi ý tiếng Việt' : hintLevel === 'vi' ? 'Gợi ý tiếng Nga' : 'Đã hiện hết'}
                        >
                          <Lightbulb size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hints used counter */}
            {hintsUsed > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed text-xs text-amber-600 font-medium text-center">
                💡 Đã dùng {hintsUsed} gợi ý {hintsUsed > 3 && '(ảnh hưởng số ⭐)'}
              </div>
            )}

            {isAllCompleted && (
              <div className="mt-4 bg-green-500 text-white p-4 rounded-2xl text-center font-bold animate-bounce">
                🎉 Hoàn Thành Kịch Bản!
              </div>
            )}
          </div>

          {/* CHAT AREA */}
          <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 text-[#f07b32] rounded-full flex items-center justify-center font-bold shrink-0">
                AI
              </div>
              <div>
                <div className="font-bold text-gray-800">{topic.ai_role}</div>
                <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Sẵn sàng giao tiếp
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
              {!isStarted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-inner text-4xl">🎭</div>
                  <h3 className="text-2xl font-extrabold mb-3 text-gray-800">Sẵn sàng nhập vai?</h3>
                  <p className="text-gray-500 mb-4 max-w-sm">
                    Nói chuyện với <strong>{topic.ai_role}</strong> và hoàn thành các nhiệm vụ. Bấm 💡 nếu cần gợi ý!
                  </p>
                  <p className="text-xs text-gray-400 mb-8">⏱ Hoàn thành nhanh + ít gợi ý = nhiều ⭐</p>
                  <button
                    onClick={startRoleplay}
                    className="bg-[#f07b32] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#d46522] transition-colors"
                  >
                    🚀 Bắt đầu
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((m, i) => (
                    <RoleplayMessage
                      key={i}
                      role={m.role}
                      content={m.content}
                      replyVi={m.reply_vi}
                      correction={m.correction}
                    />
                  ))}
                  {isTyping && (
                    <div className="flex justify-start mb-6">
                      <div className="p-4 bg-white rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                        <span className="text-xs text-gray-400 mr-1">AI đang gõ...</span>
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            {isStarted && (
              <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    disabled={isTyping || isRecording}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                    placeholder={isRecording ? '🔴 Đang nghe...' : 'Gõ hoặc bấm Mic để nói...'}
                    className="w-full p-4 pr-14 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#f07b32] focus:ring-2 focus:ring-orange-100 transition-all outline-none text-gray-700"
                  />
                  <button
                    onClick={() => handleSend(input)}
                    disabled={isTyping || !input.trim() || isRecording}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f07b32] text-white rounded-xl flex items-center justify-center hover:bg-[#e26a24] disabled:opacity-50 transition-colors"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>

                <button
                  onClick={toggleRecording}
                  disabled={isTyping}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 ${
                    isRecording
                      ? 'bg-red-500 text-white shadow-lg animate-pulse'
                      : 'bg-gray-50 text-gray-500 border hover:text-[#f07b32] hover:bg-orange-50 hover:border-orange-200'
                  }`}
                >
                  {isRecording ? <Square size={22} fill="white" /> : <Mic size={24} />}
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
