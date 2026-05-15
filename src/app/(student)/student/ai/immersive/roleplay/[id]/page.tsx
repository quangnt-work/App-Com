'use client';

import React, { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mic, Send, Square, CheckCircle2, Circle, Loader2, Volume2 } from 'lucide-react';
import roleplayData from '@/data/roleplay.json';
import { ChatMessageType } from '@/types/ai-chat';
import { ChatMessage } from '@/components/student/ai/chat/ChatMessage';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

export default function RoleplayRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicId = resolvedParams.id;
  const topic = roleplayData.find(t => t.id === topicId);

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { isRecording, transcript, startRecording, stopRecording, resetTranscript, isSupported } = useSpeechRecognition('ru-RU');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!topic) {
      router.push('/student/ai/immersive/roleplay');
    }
  }, [topic, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!topic) return null;

  const startRoleplay = async () => {
    setIsStarted(true);
    setMessages([{ role: 'model', content: topic.first_message, type: 'text' }]);
    playAudio(topic.first_message);
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const newMessages: ChatMessageType[] = [...messages, { role: 'user', content, type: 'text' }];
    setMessages(newMessages);
    setInput('');
    resetTranscript();
    setIsTyping(true);

    try {
      const res = await fetch('/api/roleplay-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: topic.context,
          ai_role: topic.ai_role,
          objectives: topic.objectives
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages([...newMessages, { role: 'model', content: data.reply, type: 'text' }]);
      setCompletedObjectives(data.completed_objectives || []);
      playAudio(data.reply);

      // Check win condition
      if (data.completed_objectives?.length === topic.objectives.length) {
        toast.success("Chúc mừng! Bạn đã hoàn thành toàn bộ nhiệm vụ của kịch bản này!", { duration: 3000 });
        setTimeout(() => setIsFinished(true), 3000);
      }

    } catch (error) {
      toast.error('Lỗi khi gửi tin nhắn.');
    } finally {
      setIsTyping(false);
    }
  };

  const playAudio = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    window.speechSynthesis.speak(utterance);
  };

  // Cập nhật input bằng transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const toggleRecording = () => {
    if (!isSupported) {
      toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.");
      return;
    }
    if (isRecording) {
      stopRecording();
      // Đợi 1 chút cho transcript update lần cuối rồi tự gửi
      setTimeout(() => {
        if (input.trim()) handleSend(input);
      }, 500);
    } else {
      resetTranscript();
      setInput('');
      startRecording();
    }
  };

  const isAllCompleted = completedObjectives.length === topic.objectives.length;

  const renderEvaluation = () => {
    const percentage = Math.round((completedObjectives.length / topic.objectives.length) * 100);
    let title = '';
    let message = '';
    let icon = '';

    if (percentage < 50) {
      title = 'Khách du lịch bỡ ngỡ';
      message = 'Giao tiếp của bạn còn khá hạn chế khiến NPC chưa hiểu ý. Đừng ngại dùng từ điển hỗ trợ ở lần sau nhé!';
      icon = '🥉';
    } else if (percentage < 100) {
      title = 'Người giao tiếp tự tin';
      message = 'Rất tốt! Bạn đã giải quyết được phần lớn các vấn đề giao tiếp. Chỉ một chút nữa thôi là hoàn hảo.';
      icon = '🥈';
    } else {
      title = 'Người bản xứ thực thụ';
      message = 'Xuất sắc! Bạn đã xử lý tình huống cực kỳ mượt mà. Không kịch bản nào có thể làm khó được bạn.';
      icon = '👑';
    }

    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto mt-10">
        <div className="text-6xl mb-6">{icon}</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">{title}</h2>
        <div className="inline-block bg-orange-50 border border-orange-100 rounded-2xl px-6 py-4 mb-6">
          <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">Nhiệm vụ hoàn thành</p>
          <p className="text-4xl font-black text-[#f07b32]">{completedObjectives.length} <span className="text-xl text-orange-400">/ {topic.objectives.length}</span></p>
        </div>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">{message}</p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setMessages([]);
              setCompletedObjectives([]);
              setIsFinished(false);
              setIsStarted(false);
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Chơi lại kịch bản này
          </button>
          <button
            onClick={() => {
              if (window.history.length > 2) {
                router.back();
              } else {
                router.push('/student/ai/immersive/roleplay');
              }
            }}
            className="px-6 py-3 bg-[#f07b32] text-white font-bold rounded-xl hover:bg-[#e26a24] transition-colors"
          >
            Chọn kịch bản khác
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">
        {isFinished ? renderEvaluation() : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="font-bold text-gray-800 text-xl">{topic.title}</div>
              {isStarted && (
                <button
                  onClick={() => setIsFinished(true)}
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

            <div className="flex-1 overflow-y-auto space-y-4">
              {topic.objectives.map((obj) => {
                const isDone = completedObjectives.includes(obj.id);
                return (
                  <div key={obj.id} className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 opacity-70'
                    }`}>
                    <div className="mt-0.5 shrink-0">
                      {isDone ? <CheckCircle2 className="text-green-500" size={20} /> : <Circle className="text-gray-300" size={20} />}
                    </div>
                    <div className={`text-sm font-medium ${isDone ? 'text-green-800 line-through decoration-green-300' : 'text-gray-600'}`}>
                      {obj.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {isAllCompleted && (
              <div className="mt-6 bg-green-500 text-white p-4 rounded-2xl text-center font-bold animate-bounce">
                🎉 Hoàn Thành Kịch Bản!
              </div>
            )}
          </div>

          {/* CHAT AREA */}
          <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
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

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
              {!isStarted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-inner text-4xl">🎭</div>
                  <h3 className="text-2xl font-extrabold mb-3 text-gray-800">Sẵn sàng nhập vai?</h3>
                  <p className="text-gray-500 mb-8 max-w-sm">
                    Hãy bấm mic để nói chuyện với <strong>{topic.ai_role}</strong>. Cố gắng hoàn thành tất cả nhiệm vụ bên trái nhé!
                  </p>
                  <button
                    onClick={startRoleplay}
                    disabled={isTyping}
                    className="bg-[#f07b32] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#d46522] transition-colors disabled:opacity-50"
                  >
                    {isTyping ? <Loader2 size={20} className="animate-spin inline" /> : '🚀 Bắt đầu'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((m, i) => (
                    <ChatMessage key={i} message={m} />
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
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 ${isRecording
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
          </>
        )}
      </main>
    </div>
  );
}
