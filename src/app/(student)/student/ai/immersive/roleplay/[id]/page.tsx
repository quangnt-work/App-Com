'use client';

import React, { useState, useRef, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Send, Square, Loader2, Timer } from 'lucide-react';
import roleplayData from '@/data/roleplay.json';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { RoleplayMessage } from '@/components/student/ai/chat/RoleplayMessage';
import { RoleplayEvaluation } from '@/components/student/ai/chat/RoleplayEvaluation';
import { QuestBoard, HintState } from '@/components/student/ai/chat/QuestBoard';
import { speakRussian, cancelSpeech } from '@/lib/tts';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { RoleplayScenario } from '@/types/ai-chat';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoleplayMessageData {
  role: 'user' | 'model';
  content: string;
  type: 'text' | 'audio';
  reply_vi?: string | null;
  correction?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RoleplayRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicId = resolvedParams.id;
  const [topic, setTopic] = useState<RoleplayScenario | null>(null);
  const [isTopicLoaded, setIsTopicLoaded] = useState(false);

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
    const loadTopic = async () => {
      // 1. Tìm trong file tĩnh trước
      const staticTopic = roleplayData.find(t => t.id === topicId);
      if (staticTopic) {
        setTopic(staticTopic as unknown as RoleplayScenario);
        setIsTopicLoaded(true);
        return;
      }

      // 2. Nếu không có, tìm trong Supabase
      const supabase = createClient();
      const { data, error } = await supabase
        .from('roleplay_scenarios')
        .select('*')
        .eq('id', topicId)
        .single();

      if (data && !error) {
        setTopic(data as unknown as RoleplayScenario);
      } else {
        router.push('/student/ai/immersive/roleplay');
      }
      setIsTopicLoaded(true);
    };

    loadTopic();
  }, [topicId, router]);

  useEffect(() => {
    return () => {
      cancelSpeech();
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

  if (!isTopicLoaded || !topic) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;

  const saveHistory = async (finalMessages: RoleplayMessageData[], finalCompletedIds: string[]) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('roleplay_history').insert({
        user_id: user.id,
        scenario_id: topic.id,
        topic_title: topic.title,
        messages: finalMessages,
        completed_objectives: finalCompletedIds,
        total_objectives: topic.objectives.length,
        hints_used: hintsUsed,
        elapsed_seconds: elapsedSeconds
      });
    } catch (err) {
      console.error("Lỗi khi lưu lịch sử Roleplay:", err);
    }
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
          const lastUserIdx = updated.length - 1;
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

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);

      // Merge completed objectives instead of overwriting (P2 fix)
      const newObjectives: string[] = data.completed_objectives || [];
      const allCompleted = [...new Set([...completedObjectives, ...newObjectives])];
      setCompletedObjectives(allCompleted);

      // Check win condition
      if (allCompleted.length === topic.objectives.length) {
        toast.success("Chúc mừng! Bạn đã hoàn thành toàn bộ nhiệm vụ!", { duration: 3000 });
        stopTimer();
        saveHistory(finalMessages, allCompleted);
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
      return prev;
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
    return (
      <RoleplayEvaluation
        topicTitle={topic.title}
        objectives={topic.objectives}
        completedObjectives={completedObjectives}
        hintsUsed={hintsUsed}
        elapsedSeconds={elapsedSeconds}
        onRestart={handleRestart}
      />
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
              aria-label="Kết thúc kịch bản"
              onClick={() => { 
                stopTimer(); 
                saveHistory(messages, completedObjectives);
                setIsFinished(true); 
              }}
              disabled={isTyping}
              className="bg-red-50 text-red-500 font-bold px-4 py-2 rounded-xl border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              Kết thúc kịch bản
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">

          {/* QUEST BOARD */}
          <QuestBoard
            context={topic.context}
            objectives={topic.objectives}
            completedObjectives={completedObjectives}
            hints={hints}
            hintsUsed={hintsUsed}
            isStarted={isStarted}
            isAllCompleted={isAllCompleted}
            onRevealHint={revealHint}
          />

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
                      autoPlayAudio={i === messages.length - 1 && m.role === 'model'}
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
                    aria-label="Gửi tin nhắn"
                    onClick={() => handleSend(input)}
                    disabled={isTyping || !input.trim() || isRecording}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f07b32] text-white rounded-xl flex items-center justify-center hover:bg-[#e26a24] disabled:opacity-50 transition-colors"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>

                <button
                  aria-label={isRecording ? 'Dừng thu âm' : 'Bắt đầu thu âm'}
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
