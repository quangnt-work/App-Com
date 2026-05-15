'use client';

import React, { useState, useRef, use, useEffect } from 'react';
import { Mic, Send, Users, Plane, ShoppingBag, HeartPulse, Briefcase, Loader2, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatMessageType, ChatAssessment } from '@/types/ai-chat';
import { ChatMessage } from '@/components/student/ai/chat/ChatMessage';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

const TOPICS_DATA = [
  { id: 'social', title: 'Xã giao & Đời sống', icon: <Users size={24} /> },
  { id: 'travel', title: 'Du lịch & Di chuyển', icon: <Plane size={24} /> },
  { id: 'service', title: 'Dịch vụ & Mua sắm', icon: <ShoppingBag size={24} /> },
  { id: 'health', title: 'Sức khỏe & Khẩn cấp', icon: <HeartPulse size={24} /> },
  { id: 'work', title: 'Học tập & Công việc', icon: <Briefcase size={24} /> },
];

// Helper: chuyển Blob thành base64 string
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Tách phần base64 sau dấu ","
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function AIChatInterfacePage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicSlug = resolvedParams.topicSlug;
  const topic = TOPICS_DATA.find(t => t.id === topicSlug);

  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [assessment, setAssessment] = useState<ChatAssessment | null>(null);
  const [assessmentMode, setAssessmentMode] = useState<'audio' | 'text' | null>(null);

  // === GHI ÂM STATE ===
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Lưu tối đa 3 audio blobs gần nhất để đánh giá ngữ điệu
  const audioSamplesRef = useRef<Blob[]>([]);

  const { isRecording, transcript, startRecording, stopRecording, resetTranscript, isSupported } = useSpeechRecognition('ru-RU');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Chủ đề này không tồn tại</h1>
        <button onClick={() => router.push('/student/ai/chat')} className="text-white bg-[#f07b32] px-6 py-2 rounded-xl">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // === HELPER: gọi API chat thường ===
  const callChatAPI = async (msgs: ChatMessageType[]) => {
    const res = await fetch('/api/chat-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs, topic: topic.title, isAssessment: false }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi HTTP ${res.status}`);
    }
    return res.json();
  };

  // === BẮT ĐẦU CHAT ===
  const startChat = async () => {
    setIsStarted(true);
    setIsTyping(true);
    try {
      const data = await callChatAPI([]);
      setMessages([{ role: 'model', content: data.data, type: 'text' }]);
    } catch (error) {
      console.error(error);
      toast.error(`Lỗi kết nối AI: ${error instanceof Error ? error.message : 'Không xác định'}`);
      setIsStarted(false);
    } finally {
      setIsTyping(false);
    }
  };

  // === GỬI TIN NHẮN VĂN BẢN ===
  const handleSend = async (content: string) => {
    if (!content.trim() || isTyping) return;
    const newMessages: ChatMessageType[] = [...messages, { role: 'user', content, type: 'text' }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    try {
      const data = await callChatAPI(newMessages);
      setMessages([...newMessages, { role: 'model', content: data.data, type: 'text' }]);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi kết nối AI khi gửi tin nhắn.');
    } finally {
      setIsTyping(false);
    }
  };

  // === KẾT THÚC & ĐÁNH GIÁ ===
  const endChat = async () => {
    if (messages.length === 0) {
      toast.error('Hãy trò chuyện trước khi kết thúc!');
      return;
    }
    setIsTyping(true);
    try {
      // Encode tối đa 3 audio blobs gần nhất sang base64
      const samples = audioSamplesRef.current.slice(-3);
      const audioSamples = await Promise.all(
        samples.map(async (blob) => ({
          data: await blobToBase64(blob),
          mimeType: blob.type || 'audio/webm',
        }))
      );

      const res = await fetch('/api/assess-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          topic: topic.title,
          // Chỉ gửi audio nếu user có ghi âm trong buổi chat
          ...(audioSamples.length > 0 && { audioSamples }),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Lỗi HTTP ${res.status}`);
      }

      const data = await res.json();
      setAssessment(data.data);
      setAssessmentMode(data.mode); // 'audio' | 'text'
    } catch (error) {
      console.error(error);
      toast.error('Đã xảy ra lỗi khi AI đang đánh giá.');
    } finally {
      setIsTyping(false);
    }
  };

  // Lắng nghe khi kết thúc ghi âm từ Web Speech API
  // Để tránh duplicate, ta dùng một ref để lưu transcript cuối cùng
  const transcriptRef = useRef('');
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const handleStopRecording = async () => {
    stopRecording();
    mediaRecorderRef.current?.stop();
    
    // Đợi một chút để state cập nhật transcript cuối cùng
    setTimeout(async () => {
      const finalTranscript = transcriptRef.current.trim();
      if (!finalTranscript) {
        toast.error('Không nhận diện được giọng nói. Vui lòng thử lại.');
        audioSamplesRef.current.pop(); // Xoá blob vừa lưu vì vô dụng
        return;
      }
      await handleSend(finalTranscript);
      resetTranscript();
    }, 500);
  };

  // === GHI ÂM: TOGGLE MIC ===
  const toggleRecording = async () => {
    if (!isSupported) {
      toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.");
      return;
    }

    if (isRecording) {
      handleStopRecording();
    } else {
      try {
        resetTranscript();
        transcriptRef.current = '';
        
        // Ghi âm Blob song song để dùng cho lúc kết thúc (đánh giá ngữ điệu)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioSamplesRef.current.push(audioBlob);
        };

        recorder.start();
        
        // Bắt đầu Web Speech API để nhận text
        startRecording();
        toast.info('Đang ghi âm... Bấm nút đỏ để dừng.');
      } catch {
        toast.error('Vui lòng cấp quyền sử dụng Micro.');
      }
    }
  };

  // === GIAO DIỆN KẾT QUẢ ĐÁNH GIÁ ===
  if (assessment) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border mt-10 animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Kết quả đánh giá giao tiếp</h2>
        {assessmentMode === 'audio' && (
          <p className="text-center text-sm text-emerald-600 font-medium mb-6">
            ✅ Đánh giá bằng AI nghe audio — bao gồm ngữ điệu thật sự
          </p>
        )}
        {assessmentMode === 'text' && (
          <p className="text-center text-sm text-gray-400 mb-6">
            📝 Đánh giá dựa trên văn bản (không có audio ghi âm)
          </p>
        )}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="font-bold text-blue-700 text-lg">Trình độ ước tính: {assessment.overall_level}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <p><strong className="text-gray-700">📚 Từ vựng:</strong> {assessment.vocabulary}</p>
            <p><strong className="text-gray-700">🎙️ Ngữ điệu / Ngữ pháp:</strong> {assessment.intonation}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <p className="italic text-gray-700">{assessment.general_feedback}</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/student/ai/chat')}
          className="w-full mt-8 bg-[#f07b32] hover:bg-[#d46522] transition-colors text-white py-4 rounded-2xl font-bold text-lg"
        >
          Hoàn thành luyện tập
        </button>
      </div>
    );
  }

  // === GIAO DIỆN CHAT CHÍNH ===
  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white rounded-3xl shadow-sm border mt-6 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 text-green-600 rounded-xl">{topic.icon}</div>
          <span className="font-bold text-lg text-gray-800">{topic.title}</span>
        </div>
        {isStarted && (
          <button
            onClick={endChat}
            disabled={isTyping || isTranscribing}
            className="text-red-500 font-semibold px-4 py-2 hover:bg-red-50 rounded-xl transition-colors text-sm border border-red-200 disabled:opacity-50"
          >
            {isTyping ? <Loader2 size={16} className="animate-spin inline mr-1" /> : null}
            Kết thúc & Đánh giá
          </button>
        )}
      </div>

      {/* Body / Lịch sử Chat */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
        {!isStarted ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-28 h-28 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="text-5xl">🤖</span>
            </div>
            <h3 className="text-2xl font-extrabold mb-3 text-gray-800">Xin chào!</h3>
            <p className="text-gray-500 mb-8 max-w-sm">
              Sẵn sàng luyện tập phản xạ tiếng Nga về chủ đề <strong>{topic.title}</strong> chưa?
            </p>
            <p className="text-xs text-gray-400 mb-6 max-w-xs">
              💡 Sử dụng nút <strong>Mic</strong> để ghi âm — AI sẽ đánh giá cả ngữ điệu khi kết thúc
            </p>
            <button
              onClick={startChat}
              disabled={isTyping}
              className="bg-[#f07b32] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:bg-[#e26a24] transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isTyping ? (
                <><Loader2 size={20} className="animate-spin" /> Đang kết nối...</>
              ) : '🚀 Bắt đầu giao tiếp'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m, i) => {
              // Auto-play audio chỉ cho tin nhắn AI cuối cùng (mới nhất)
              const isLastModelMsg = m.role === 'model' && i === messages.map(msg => msg.role).lastIndexOf('model');
              return <ChatMessage key={i} message={m} autoPlay={isLastModelMsg} />;
            })}
            {(isTyping || isTranscribing) && (
              <div className="flex justify-start mb-6">
                <div className="p-4 bg-white rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                  <span className="text-xs text-gray-400 mr-1">
                    {isTranscribing ? 'Đang nhận diện giọng nói...' : 'AI đang soạn...'}
                  </span>
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
        <div className="p-4 bg-white border-t flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              disabled={isTyping || isRecording || isTranscribing}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder={
                isRecording ? '🔴 Đang ghi âm...'
                  : isTranscribing ? 'Đang nhận diện...'
                    : 'Nhập tin nhắn tiếng Nga...'
              }
              className="w-full p-4 pr-14 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#f07b32] focus:ring-2 focus:ring-orange-100 transition-all outline-none text-gray-700"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isTyping || !input.trim() || isRecording || isTranscribing}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f07b32] text-white rounded-xl flex items-center justify-center hover:bg-[#e26a24] disabled:opacity-50 disabled:bg-gray-300 transition-colors"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>

          {/* Nút Mic */}
          <button
            onClick={toggleRecording}
            disabled={isTyping || isTranscribing}
            title={isRecording ? 'Bấm để dừng ghi âm' : 'Bấm để ghi âm giọng nói'}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50
              ${isRecording
                ? 'bg-red-500 text-white border-2 border-red-300 shadow-lg shadow-red-200 animate-pulse'
                : 'bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#f07b32] hover:bg-orange-50 hover:border-orange-200'
              }`}
          >
            {isRecording ? <Square size={22} fill="white" /> : <Mic size={24} />}
          </button>
        </div>
      )}
    </div>
  );
}