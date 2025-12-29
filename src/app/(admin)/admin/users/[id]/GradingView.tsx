// src/app/(admin)/admin/users/[id]/GradingView.tsx
'use client'

import React, { useState } from 'react'
import { 
  ChevronLeft, Mail, Clock, FileText, Image as ImageIcon, 
  CheckCircle, Download, Save, RotateCcw, Monitor 
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { gradeSubmission } from './actions'

// -- Types --
export interface Submission {
  id: string;
  title: string;
  type: string;
  submitted_at: string;
  content_text: string;
  status: 'pending' | 'graded' | 'late';
  score: number | null;
  feedback: string | null;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  class_name: string;
  gpa: number;
}

interface Props {
  student: StudentProfile;
  submissions: Submission[];
}

export default function GradingView({ student, submissions }: Props) {
  const router = useRouter();
  // State quản lý bài tập đang chọn
  const [selectedSub, setSelectedSub] = useState<Submission>(submissions[0] || null);
  
  // State form chấm điểm
  const [score, setScore] = useState<string>(selectedSub?.score?.toString() || '');
  const [feedback, setFeedback] = useState<string>(selectedSub?.feedback || '');
  const [isSaving, setIsSaving] = useState(false);

  // Update state khi chọn bài khác
  const handleSelectSubmission = (sub: Submission) => {
    setSelectedSub(sub);
    setScore(sub.score?.toString() || '');
    setFeedback(sub.feedback || '');
  };

  // Xử lý lưu điểm
  const handleSave = async () => {
    if (!selectedSub) return;
    setIsSaving(true);
    
    const result = await gradeSubmission(
      selectedSub.id, 
      parseFloat(score), 
      feedback,
      student.id
    );

    setIsSaving(false);
    if (result.success) {
      alert('Đã lưu kết quả chấm!');
      router.refresh(); // Refresh lại data server
    } else {
      alert('Lỗi khi lưu: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      
      {/* 1. Header & Navigation */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-slate-500 hover:text-sky-600 transition-colors gap-2 text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại danh sách học viên
      </button>

      {/* 2. Student Profile Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={student.avatar} 
            alt={student.name} 
            className="w-16 h-16 rounded-full border-2 border-slate-100 object-cover"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-600">ID: {student.id.substring(0,6).toUpperCase()}</span>
              <span>Lớp: {student.class_name}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
               <span className="text-sm font-medium text-slate-700">Điểm trung bình:</span>
               <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-sm">{student.gpa} / 10</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            <Mail className="w-4 h-4" /> Gửi email
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            <Clock className="w-4 h-4" /> Lịch sử
          </button>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR: Assignment List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
             {['Tất cả', 'Bài học', 'Luyện tập', 'Kiểm tra'].map((tab) => (
               <button key={tab} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === 'Tất cả' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}>
                 {tab}
               </button>
             ))}
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div 
                key={sub.id}
                onClick={() => handleSelectSubmission(sub)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  selectedSub?.id === sub.id 
                    ? 'bg-white border-sky-500 ring-1 ring-sky-500 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    sub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    sub.status === 'graded' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {sub.status === 'pending' ? 'Chờ chấm' : sub.status === 'graded' ? `${sub.score} điểm` : 'Trễ hạn'}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(sub.submitted_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{sub.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Monitor className="w-3 h-3" />
                  <span>{sub.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT: Detail & Grading */}
        {selectedSub ? (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Submission Detail Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedSub.title}</h2>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Nộp lúc: {new Date(selectedSub.submitted_at).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Đang chờ chấm
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase mb-3">Nội dung bài làm</h4>
                  <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm leading-relaxed border border-slate-200">
                    {selectedSub.content_text}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase mb-3">Tệp đính kèm (2)</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors w-fit">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-slate-900">source_code.zip</p>
                         <p className="text-xs text-slate-500">2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors w-fit">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-slate-900">screenshot.png</p>
                         <p className="text-xs text-slate-500">850 KB</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Grading Form Section */}
                <div className="bg-slate-900 rounded-xl p-6 text-white mt-8">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="text-emerald-400" />
                    Đánh giá & Chấm điểm
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Score Input */}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Điểm số (Thang điểm 10)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          max={10} min={0}
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-2xl font-bold text-center text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                          placeholder="0.0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">/ 10</span>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium text-slate-300">Tiêu chí đạt được</p>
                        <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer hover:text-white">
                          <input type="checkbox" className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-sky-500" defaultChecked />
                          Đúng cấu trúc HTML5
                        </label>
                        <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer hover:text-white">
                          <input type="checkbox" className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-sky-500" defaultChecked />
                          Sử dụng Flexbox hợp lý
                        </label>
                         <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer hover:text-white">
                          <input type="checkbox" className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-sky-500" />
                          Responsive tốt trên Mobile
                        </label>
                      </div>
                    </div>

                    {/* Feedback Input */}
                    <div className="flex flex-col h-full">
                       <label className="block text-sm font-medium text-slate-400 mb-2">Nhận xét chi tiết</label>
                       <textarea 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                        placeholder="Nhập nhận xét cho học viên..."
                        rows={5}
                       ></textarea>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-800">
                    <button className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2 font-medium">
                      <RotateCcw className="w-4 h-4" /> Yêu cầu làm lại
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? 'Đang lưu...' : <><Save className="w-4 h-4" /> Lưu kết quả</>}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-slate-200 text-slate-400">
            <p>Chọn một bài tập để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  )
}