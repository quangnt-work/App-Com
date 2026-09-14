// src/app/(student)/student/exams/page.tsx
import React from 'react';
import { FileText, BookOpen, Headphones, ListChecks } from 'lucide-react';
import { ExamCard, type ExamItem } from '@/components/student/exams/ExamCard';
import { Pagination } from '@/components/common/Pagination';
import { HeroBanner } from '@/components/common/HeroBanner';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface ExamsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ExamsPage({ searchParams }: ExamsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const pageSize = 8;

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

  const allExams: ExamItem[] = (examsData || []).map(exam => {
    let icon = <FileText size={22} />;
    let categoryName = 'TỔNG HỢP';
    
    if (exam.exam_type === 'grammar') {
      icon = <ListChecks size={22} />;
      categoryName = 'NGỮ PHÁP';
    } else if (exam.exam_type === 'reading') {
      icon = <BookOpen size={22} />;
      categoryName = 'ĐỌC HIỂU';
    } else if (exam.exam_type === 'listening') {
      icon = <Headphones size={22} />;
      categoryName = 'NGHE HIỂU';
    }

    return {
      id: exam.id,
      title: exam.title,
      category: `${categoryName} ${exam.level}`.toUpperCase(),
      duration: `${exam.duration || 0} phút`,
      questionsCount: `${exam.question_count || 0} câu hỏi`,
      icon,
      href: `/student/exams/${exam.id}`,
      isCompleted: completedExamIds.has(exam.id),
    };
  });

  const totalPages = Math.ceil(allExams.length / pageSize);
  const currentExams = allExams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto px-4 py-1.5 max-w-6xl font-sans flex-1 flex flex-col justify-between">
      <div>
        {/* Banner KIỂM TRA - Đồng bộ thiết kế & kích thước */}
        <HeroBanner
          title="KIỂM TRA ĐÁNH GIÁ NĂNG LỰC"
          ruTitle="ТЕСТЫ"
          description={allExams.length > 0 ? `Tổng hợp ${allExams.length} bài kiểm tra ngữ pháp, đọc hiểu và nghe hiểu` : 'Đánh giá năng lực tiếng Nga của bạn'}
          icon={FileText}
          gradient="from-amber-600 via-orange-500 to-amber-600"
        />

        {/* Lưới Thẻ Bài Kiểm Tra (4 cột x 2 hàng = 8 thẻ) */}
        {currentExams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {currentExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 bg-white/95 backdrop-blur-md rounded-2xl shadow-xs border border-slate-200/80 text-xs">
            Hiện tại chưa có bài kiểm tra nào được phát hành.
          </div>
        )}
      </div>

      {/* Phân trang cố định sát Footer */}
      {totalPages > 1 && (
        <div className="mt-auto pt-3 pb-1 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}