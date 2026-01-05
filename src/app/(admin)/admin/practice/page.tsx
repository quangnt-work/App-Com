// src/app/(admin)/admin/practice/page.tsx
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { PracticeStats } from '@/components/admin/practice/PracticeStats'
import { PracticeList } from '@/components/admin/practice/PracticeList'
import { PracticeSet } from '@/types/practice-admin'

// Hàm lấy thống kê nhanh
async function getStats(supabase: any) {
  // Vì Supabase không hỗ trợ count nhiều điều kiện trong 1 query đơn giản, ta gọi song song
  const [totalRes, publishedRes, draftRes] = await Promise.all([
    supabase.from('practice_sets').select('*', { count: 'exact', head: true }),
    supabase.from('practice_sets').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('practice_sets').select('*', { count: 'exact', head: true }).eq('is_published', false),
  ])

  return {
    total: totalRes.count || 0,
    published: publishedRes.count || 0,
    draft: draftRes.count || 0,
    participants: 0 // Tạm thời để 0 hoặc cần join bảng user_progress để đếm
  }
}

export default async function PracticeManagementPage() {
  const supabase = await createClient()

  // 1. Lấy danh sách bài tập (Sắp xếp mới nhất lên đầu)
  const { data: practiceSets, error } = await supabase
    .from('practice_sets')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. Lấy thống kê
  const stats = await getStats(supabase)

  if (error) {
    console.error("Error fetching practice sets:", error);
    return <div>Lỗi tải dữ liệu. Vui lòng thử lại sau.</div>
  }

  // 3. Map dữ liệu DB sang Type UI (nếu cần xử lý thêm)
  const formattedData: PracticeSet[] = (practiceSets || []).map((item) => ({
    ...item,
    // Đảm bảo các trường null từ DB không gây lỗi UI
    description: item.description || '',
    thumbnail_url: item.thumbnail_url || null,
    stats: { participants: 0, avg_score: 0 } // Mock stats vì chưa có bảng progress thực tế
  }))

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Luyện tập</h1>
        <p className="text-slate-500 text-sm">Tạo, chỉnh sửa và quản lý các bộ đề luyện tập cho học viên.</p>
      </div>

      {/* Stats Overview (Truyền số liệu thật) */}
      <PracticeStats stats={stats} />

      {/* Main List */}
      <PracticeList initialData={formattedData} />
    </div>
  )
}