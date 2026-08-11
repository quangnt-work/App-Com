'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mic2, Drama, ArrowLeft } from 'lucide-react';

export default function AIHubPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/admin/dashboard"
          className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 font-medium transition-colors"
        >
        </Link>
        
        <div className="bg-indigo-600 rounded-2xl p-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-md">
          <div className="flex items-center gap-4">
            <Sparkles size={40} className="opacity-90" />
            <h1 className="text-3xl font-bold tracking-wide uppercase">Hệ Sinh Thái AI</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-indigo-100">
            <span>Trung tâm quản lý AI</span>
            <Sparkles size={20} className="animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Shadowing */}
          <Link
            href="/admin/shadowing"
            className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-200 group"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-gray-600 font-semibold text-lg group-hover:text-blue-600 transition-colors">
                AI Shadowing
              </h3>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mic2 size={24} />
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-extrabold text-gray-800">
                Luyện Nhại Giọng
              </span>
            </div>
            
            <div className="text-gray-500 text-sm mb-6 line-clamp-3">
              Sinh tự động kịch bản hội thoại và âm thanh bản ngữ bằng công nghệ Edge TTS. Học viên luyện kỹ năng bắt chước với Blind Mode.
            </div>
            
            <div className="mt-auto pt-4 border-t border-dashed border-gray-100 text-blue-600 font-medium text-sm flex items-center justify-between">
              <span>Mở bộ công cụ</span>
              <span>&rarr;</span>
            </div>
          </Link>

          {/* Card 2: AI Roleplay */}
          <Link
            href="/admin/roleplay"
            className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[250px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-orange-200 group"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-gray-600 font-semibold text-lg group-hover:text-[#ea580c] transition-colors">
                AI Roleplay
              </h3>
              <div className="p-3 bg-orange-50 text-[#ea580c] rounded-xl group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                <Drama size={24} />
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-extrabold text-gray-800">
                Nhập Vai Tương Tác
              </span>
            </div>
            
            <div className="text-gray-500 text-sm mb-6 line-clamp-3">
              Sáng tạo bối cảnh giao tiếp tự do. AI đóng vai người bản ngữ để luyện khả năng phản xạ và xử lý tình huống thực tế cho học viên.
            </div>
            
            <div className="mt-auto pt-4 border-t border-dashed border-gray-100 text-[#ea580c] font-medium text-sm flex items-center justify-between">
              <span>Mở bộ công cụ</span>
              <span>&rarr;</span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
