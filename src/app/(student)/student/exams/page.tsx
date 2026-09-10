// src/app/(student)/student/exams/page.tsx
import React from 'react';
import { FileText, BookOpen, Headphones, ListChecks } from 'lucide-react';
import { ExamCard, type ExamItem } from '@/components/student/exams/ExamCard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ExamsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  // Chạy song song cả 2 truy vấn và chỉ lấy các trường cần thiết cho Card
  const [
    { data: examsData, error },
    { data: submissions }
  ] = await Promise.all([
    supabase
      .from('exams')
      .select('id, title, exam_type, level, duration, question_count')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('exam_submissions')
      .select('exam_id')
      .eq('user_id', user.id)
  ]);

  if (error) {
    console.error("Error fetching exams:", error.message);
  }

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
    <div className="container mx-auto px-4 py-2 max-w-6xl font-sans">
      {/* Compact Header KIỂM TRA */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-2.5 rounded-xl shadow-xs shadow-amber-500/20">
            <FileText size={20} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                Kiểm tra đánh giá năng lực
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                Тесты
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {exams.length > 0 ? `Tổng hợp ${exams.length} bài kiểm tra ngữ pháp, đọc hiểu và nghe hiểu` : 'Đánh giá năng lực tiếng Nga của bạn'}
            </p>
          </div>
        </div>
      </div>

      {/* Lưới Thẻ Bài Kiểm Tra (3 cột) */}
      {exams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-500 bg-white rounded-2xl shadow-xs border border-slate-200/80 text-xs">
          Hiện tại chưa có bài kiểm tra nào được phát hành.
        </div>
      )}

      {/* Phân trang */}
      {exams.length > 0 && (
        <div className="mt-6 flex justify-center gap-1.5">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 bg-white text-xs">
            <span className="sr-only">Trang trước</span>
            &lt;
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-xs shadow-orange-500/20">1</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 bg-white text-xs">
            <span className="sr-only">Trang sau</span>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}