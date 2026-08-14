// src/app/(student)/student/exams/page.tsx
import React from 'react';
import { FileText, BookOpen, Headphones, ListChecks, Activity, Component } from 'lucide-react';
import { ExamCard, type ExamItem } from '@/components/student/exams/ExamCard';
import { HeroBanner } from '@/components/common/HeroBanner';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ExamsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  // Fetch real exams
  const { data: examsData, error } = await supabase
    .from('exams')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching exams:", error.message);
  }

  // Lấy danh sách các bài đã làm
  const { data: submissions } = await supabase
    .from('exam_submissions')
    .select('exam_id')
    .eq('user_id', user.id);

  const completedExamIds = new Set((submissions || []).map(s => s.exam_id));

  const exams: ExamItem[] = (examsData || []).map(exam => {
    let icon = <FileText size={24} />;
    let categoryName = 'TỔNG HỢP';
    
    if (exam.exam_type === 'grammar') {
      icon = <ListChecks size={24} />;
      categoryName = 'NGỮ PHÁP';
    } else if (exam.exam_type === 'reading') {
      icon = <BookOpen size={24} />;
      categoryName = 'ĐỌC HIỂU';
    } else if (exam.exam_type === 'listening') {
      icon = <Headphones size={24} />;
      categoryName = 'NGHE HIỂU';
    }

    return {
      id: exam.id,
      title: exam.title,
      category: `${categoryName} ${exam.level}`.toUpperCase(),
      duration: `${exam.duration || 0} phút`,
      questionsCount: `${exam.question_count || 0} câu hỏi`,
      icon,
      href: `/student/exams/${exam.id}`, // Placeholder until detail page is built
      isCompleted: completedExamIds.has(exam.id),
    };
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1200px]">
        
        {/* Banner KIỂM TRA */}
        <HeroBanner 
          title="KIỂM TRA"
          description="Đánh giá năng lực tiếng Nga của bạn thông qua các bài kiểm tra đa dạng."
          icon={FileText}
        />

        {/* Lưới Thẻ Bài Kiểm Tra (3 cột theo thiết kế) */}
        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            Hiện tại chưa có bài kiểm tra nào được phát hành.
          </div>
        )}

        {/* Phân trang (Mockup theo ảnh) */}
        {exams.length > 0 && (
          <div className="mt-16 flex justify-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white">
              <span className="sr-only">Trang trước</span>
              &lt;
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#f07b32] text-white font-bold shadow-sm">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white">
              <span className="sr-only">Trang sau</span>
              &gt;
            </button>
          </div>
        )}

      </main>
    </div>
  );
}