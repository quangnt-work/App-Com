'use client';

import React, { useState, use } from 'react';
import { Mic, Send, ChevronLeft, Users, Plane, ShoppingBag, HeartPulse, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
// Đổi tên type import để không trùng với tên Component
import { ChatMessageType, ChatAssessment } from '@/types/ai-chat';
// Import Component ChatMessage chúng ta vừa tạo
import { ChatMessage } from '@/components/student/ai/chat/ChatMessage';
import { toast } from 'sonner';

// 1. Khai báo data danh sách chủ đề ngay tại đây để tra cứu
const TOPICS_DATA = [
  { id: 'social', title: 'Xã giao & Đời sống', icon: <Users size={24} /> },
  { id: 'travel', title: 'Du lịch & Di chuyển', icon: <Plane size={24} /> },
  { id: 'service', title: 'Dịch vụ & Mua sắm', icon: <ShoppingBag size={24} /> },
  { id: 'health', title: 'Sức khỏe & Khẩn cấp', icon: <HeartPulse size={24} /> },
  { id: 'work', title: 'Học tập & Công việc', icon: <Briefcase size={24} /> }
];

export default function AIChatInterfacePage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const router = useRouter();

  // 2. Lấy topicSlug từ URL (Sử dụng React.use để unwrap Promise theo chuẩn Next.js mới)
  const resolvedParams = use(params);
  const topicSlug = resolvedParams.topicSlug;

  // 3. Tìm chủ đề tương ứng trong mảng TOPICS_DATA
  const topic = TOPICS_DATA.find(t => t.id === topicSlug);

  // Khởi tạo các State quản lý hội thoại
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [assessment, setAssessment] = useState<ChatAssessment | null>(null);

  // Xử lý lỗi nếu người dùng gõ bậy URL không có chủ đề
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

  // Logic Bắt đầu chat
  const startChat = async () => {
    setIsStarted(true);
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat-ai', {
        method: 'POST',
        body: JSON.stringify({ messages: [], topic: topic.title, isAssessment: false }),
      });
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const data = await res.json();
      setMessages([{ role: 'model', content: data.content, type: 'text' }]);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối AI. Vui lòng thử lại.");
    } finally {
      setIsTyping(false);
    }
  };

  // Logic Gửi tin nhắn
  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    const newMessages: ChatMessageType[] = [...messages, { role: 'user', content, type: 'text' }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat-ai', {
        method: 'POST',
        body: JSON.stringify({ messages: newMessages, topic: topic.title, isAssessment: false }),
      });
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const data = await res.json();
      setMessages([...newMessages, { role: 'model', content: data.content, type: 'text' }]);
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối AI khi gửi tin nhắn.");
    } finally {
      setIsTyping(false);
    }
  };

  // Logic Kết thúc và Đánh giá
  const endChat = async () => {
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat-ai', {
        method: 'POST',
        body: JSON.stringify({ messages, topic: topic.title, isAssessment: true }),
      });
      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
      const data = await res.json();
      setAssessment(data);
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi AI đang đánh giá.");
    } finally {
      setIsTyping(false);
    }
  };

  // Giao diện khi AI trả về kết quả Đánh giá
  if (assessment) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border mt-10 animate-in fade-in duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Kết quả đánh giá giao tiếp</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="font-bold text-blue-700 text-lg">Trình độ ước tính: {assessment.overall_level}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="mb-2"><strong className="text-gray-700">📚 Từ vựng:</strong> {assessment.vocabulary}</p>
            <p className="mb-2"><strong className="text-gray-700">🗣️ Ngữ điệu/Ngữ pháp:</strong> {assessment.intonation}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <p className="italic text-gray-700">`{assessment.general_feedback}`</p>
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

  // Giao diện Chat chính
  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white rounded-3xl shadow-sm border mt-6 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 text-green-600 rounded-xl">{topic.icon}</div>
          <span className="font-bold text-lg text-gray-800">{topic.title}</span>
        </div>
        <div className="w-24"></div> {/* Spacer để căn giữa tiêu đề */}
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
            <button 
              onClick={startChat}
              disabled={isTyping}
              className="bg-[#f07b32] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:bg-[#e26a24] transition-all flex items-center gap-2"
            >
              {isTyping ? 'Đang kết nối...' : '🚀 Bắt đầu giao tiếp'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Gọi Component ChatMessage ở đây */}
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}

            {isTyping && (
              <div className="flex justify-start mb-6">
                <div className="p-4 bg-white rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      {isStarted && (
        <div className="p-4 bg-white border-t flex items-center gap-3">
          <button 
            onClick={endChat} 
            disabled={isTyping}
            className="text-red-500 font-semibold px-4 py-3 hover:bg-red-50 rounded-xl transition-colors whitespace-nowrap"
          >
            Kết thúc
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              disabled={isTyping}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Nhập tin nhắn tiếng Nga..."
              className="w-full p-4 pr-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#f07b32] focus:ring-2 focus:ring-orange-100 transition-all outline-none text-gray-700"
            />
            <button 
              onClick={() => handleSend(input)} 
              disabled={isTyping || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f07b32] text-white rounded-xl flex items-center justify-center hover:bg-[#e26a24] disabled:opacity-50 disabled:bg-gray-300 transition-colors"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
          <button className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 hover:text-[#f07b32] hover:bg-orange-50 hover:border-orange-200 transition-all flex items-center justify-center">
            <Mic size={24} />
          </button>
        </div>
      )}
    </div>
  );
}