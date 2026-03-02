// src/components/student/lessons/lesson-detail/LessonAudioList.tsx
"use client";

import { Music, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Grammar } from "@/types/grammar";

export function GrammarAudioList({ grammar }: { grammar: Grammar }) {
  // Nếu không có audio, không render khối này
  if (!grammar.audio_url) return null;

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-blue-50 bg-blue-50/30 flex items-center gap-2">
        <Music size={18} className="text-blue-600" />
        <h3 className="font-bold text-blue-700 text-sm tracking-wide">AUDIO ĐÍNH KÈM</h3>
      </div>

      {/* Danh sách Audio (Hiện tại data mẫu của bạn chỉ có 1 file từ DB, 
          mình mock giao diện giống ảnh để bạn thấy cấu trúc) */}
      <div className="flex-1 p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-blue-50/50 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
             <Play size={14} className="ml-0.5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Phát âm danh từ số ít</p>
            <p className="text-xs text-gray-500">02:45</p>
          </div>
        </div>

        {/* Các mục mờ phía dưới (Ví dụ) */}
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors opacity-60">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
             <Play size={14} className="ml-0.5" />
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm">Ví dụ giống đực</p>
            <p className="text-xs text-gray-400">01:20</p>
          </div>
        </div>
      </div>

      {/* Trình phát Player Footer */}
      <div className="bg-[#1e293b] p-5 text-white mt-auto">
         <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
            <span>ĐANG PHÁT</span>
            <span>01:12 / 02:45</span>
         </div>
         {/* Thanh tiến trình giả lập */}
         <div className="w-full h-1 bg-gray-600 rounded-full mb-4">
            <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
         </div>
         {/* Nút điều khiển */}
         <div className="flex items-center justify-center gap-6">
            <button className="text-gray-300 hover:text-white"><SkipBack size={18} /></button>
            <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Pause size={18} fill="currentColor" />
            </button>
            <button className="text-gray-300 hover:text-white"><SkipForward size={18} /></button>
         </div>

         {/* Audio element thật (bị ẩn) để phát nhạc dựa theo src từ DB */}
         <audio src={grammar.audio_url} className="hidden" />
      </div>
    </div>
  );
}