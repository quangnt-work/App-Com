// src/app/(admin)/admin/users/[id]/components/GradingForm.tsx
"use client"

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { gradeSubmission } from '../actions'; // Import action của bạn
import { toast } from 'sonner'; // Hoặc library toast bạn dùng

interface GradingFormProps {
  submissionId: string;
  userId: string;
  initialScore: number | null;
  initialFeedback: string | null;
  onSuccess: () => void;
}

export function GradingForm({ submissionId, userId, initialScore, initialFeedback, onSuccess }: GradingFormProps) {
  const [score, setScore] = useState(initialScore?.toString() || '');
  const [feedback, setFeedback] = useState(initialFeedback || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score) return;

    setIsSaving(true);
    try {
      // Gọi Server Action
      const result = await gradeSubmission(submissionId, parseFloat(score), feedback, userId);
      
      if (result.success) {
        toast.success("Đã cập nhật điểm số");
        onSuccess();
      } else {
        toast.error("Có lỗi xảy ra khi lưu");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">Đánh giá & Nhận xét</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Điểm số (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            required
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nhập điểm..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Nhận xét chi tiết</label>
          <textarea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Nhập nhận xét cho học viên..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-2.5 rounded-lg transition-all"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Đang lưu...' : 'Lưu kết quả'}
          </button>
        </div>
      </div>
    </form>
  );
}