// src/app/(admin)/admin/students/page.tsx
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { StudentPageHeader } from "@/components/admin/students/StudentPageHeader";
import { StudentGrid } from "@/components/admin/students/StudentGrid";
import { StudentSearchBar } from "@/components/admin/students/StudentSearchBar";
import { StudentPagination } from "@/components/admin/students/StudentPagination";
import { StudentWithStats } from "@/types/admin";

export const metadata = {
  title: "Quản lý học viên | Admin Dashboard",
};

interface StudentsPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 12;
  const search = params.q ?? "";

  const supabase = await createClient();

  // 1. Get profiles directly
  let query = supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, created_at", { count: "exact" })
    .eq("role", "student");

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%`);
  }

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data: profiles, count, error: profilesError } = await query
    .range(start, end)
    .order("created_at", { ascending: false });

  if (profilesError) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
        <div className="max-w-7xl mx-auto">
          <StudentPageHeader />
          <div className="mt-6 p-6 text-center text-red-500 bg-red-50 rounded-2xl border border-red-200">
            <h3 className="font-bold text-lg">Đã xảy ra lỗi</h3>
            <p className="text-sm mt-1">Không thể tải dữ liệu: {profilesError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = count ?? 0;
  let students: StudentWithStats[] = [];

  if (profiles && profiles.length > 0) {
    const profileIds = profiles.map((p) => p.id);

    // 2. Fetch exam stats
    const { data: submissions } = await supabase
      .from("exam_submissions")
      .select("user_id, score")
      .in("user_id", profileIds)
      .in("status", ["completed", "graded"]);

    const statsMap = new Map<string, { examCount: number; highestScore: number | null }>();

    for (const sub of submissions ?? []) {
      if (!sub.user_id) continue;
      const current = statsMap.get(sub.user_id) ?? {
        examCount: 0,
        highestScore: null,
      };

      current.examCount += 1;
      if (sub.score !== null) {
        current.highestScore =
          current.highestScore === null ? sub.score : Math.max(current.highestScore, sub.score);
      }

      statsMap.set(sub.user_id, current);
    }

    students = profiles.map((profile) => {
      const stats = statsMap.get(profile.id) ?? {
        examCount: 0,
        highestScore: null,
      };

      return {
        id: profile.id,
        full_name: profile.full_name,
        username: profile.username,
        email: "", // User requested removing email field, and we don't display it anymore
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        level: null,
        examCount: stats.examCount,
        highestScore: stats.highestScore,
      };
    });
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <StudentPageHeader />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Suspense fallback={<div className="h-10 w-80 bg-gray-100 rounded-xl animate-pulse" />}>
            <StudentSearchBar />
          </Suspense>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            Tổng cộng:{" "}
            <span className="font-semibold text-gray-700">{totalItems}</span> học viên
          </p>
        </div>

        <StudentGrid students={students} />

        {totalItems > pageSize && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <Suspense fallback={null}>
              <StudentPagination
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={pageSize}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
