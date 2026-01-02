import { createClient } from '@/lib/supabase/server'
import { Plus, FileQuestion, BarChart3, CalendarRange } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/common/BackButton'
import { ExamFilters } from './components/ExamFilters'
import { ExamTable } from './components/ExamTable'
import { StatCard } from './components/StatCard' // Đảm bảo đường dẫn đúng
import { ExamItem } from '@/types/exam-admin'
import Link from 'next/link'

export default async function ExamManagementPage() {
  const supabase = await createClient()

  // 1. Fetch dữ liệu từ DB
  const { data: rawExams, error } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Lỗi tải đề thi:', error)
  }

  // 2. Map dữ liệu & Xử lý Type
  const exams: ExamItem[] = (rawExams || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    code: item.code,
    subject: item.subject,
    level: item.level,
    duration: item.duration,
    question_count: item.question_count,
    status: item.status,
    created_at: item.created_at
  }))

  // --- 3. TÍNH TOÁN THỐNG KÊ (LOGIC MỚI) ---
  
  // A. Tổng số đề thi
  const totalExams = exams.length

  // B. Thống kê theo cấp độ (Dễ - TB - Khó)
  const levelCounts = exams.reduce((acc, curr) => {
    acc[curr.level] = (acc[curr.level] || 0) + 1;
    return acc;
  }, { easy: 0, medium: 0, hard: 0 } as Record<string, number>);

  // Tìm cấp độ phổ biến nhất để hiển thị text chính
  const maxLevelVal = Math.max(levelCounts.easy, levelCounts.medium, levelCounts.hard);
  let dominantLevel = 'Đang cập nhật';
  if (totalExams > 0) {
      if (maxLevelVal === levelCounts.easy) dominantLevel = 'Cơ bản (Dễ)';
      if (maxLevelVal === levelCounts.medium) dominantLevel = 'Trung bình';
      if (maxLevelVal === levelCounts.hard) dominantLevel = 'Nâng cao (Khó)';
  }

  // C. Đề thi mới trong tháng này
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const newExamsCount = exams.filter(exam => {
    const d = new Date(exam.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;


  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8 font-sans text-slate-900">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <BackButton />
             <span className="text-slate-300">/</span>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quản lý đề thi</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Ngân hàng đề thi</h1>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm">
            Tạo và quản lý các bài kiểm tra, đề thi thử và bài tập về nhà.
          </p>
        </div>
        <Link href="/admin/exams/new">
          <Button className="bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-500/20 transition-all hover:scale-105">
          <Plus className="w-4 h-4 mr-2" /> Tạo Đề Thi Mới
        </Button>
        </Link>
      </div>

      {/* 2. STATS CARDS (MỚI BỔ SUNG) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Tổng số */}
        <StatCard 
          icon={FileQuestion} 
          iconColor="text-blue-600" 
          iconBg="bg-blue-50"
          label="Tổng số đề thi"
          value={totalExams.toLocaleString()}
          subValue={<span className="text-emerald-500 font-bold text-xs">↗ Đang hoạt động</span>}
        />

        {/* Card 2: Cấp độ (Hiển thị chi tiết Dễ/TB/Khó) */}
        <StatCard 
          icon={BarChart3} 
          iconColor="text-purple-600" 
          iconBg="bg-purple-50"
          label="Phân bổ cấp độ"
          value={dominantLevel} // Hiển thị cấp độ chiếm đa số
          subValue={
             <div className="flex gap-3 text-[10px] font-bold mt-1">
                <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    Dễ: {levelCounts.easy}
                </span>
                <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                    TB: {levelCounts.medium}
                </span>
                <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                    Khó: {levelCounts.hard}
                </span>
             </div>
          }
        />

        {/* Card 3: Mới tháng này */}
        <StatCard 
          icon={CalendarRange} 
          iconColor="text-orange-600" 
          iconBg="bg-orange-50"
          label="Đề thi mới (tháng này)"
          value={newExamsCount.toString()}
          subValue={<span className="text-slate-400 text-xs">Cập nhật realtime</span>}
        />
      </div>

      {/* 3. FILTERS */}
      <ExamFilters />

      {/* 4. TABLE */}
      <ExamTable exams={exams} />

    </div>
  )
}