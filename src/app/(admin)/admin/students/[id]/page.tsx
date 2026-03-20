// src/app/(admin)/admin/students/[id]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentDetailHeader } from "@/components/admin/students/StudentDetailHeader";
import { StudentStats } from "@/components/admin/students/StudentStats";
import { StudentExamHistory, ExamHistoryRecord } from "@/components/admin/students/StudentExamHistory";

export const metadata = {
  title: "Chi tiết học viên | Admin Dashboard",
};

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const resolvedParams = await params;
  const studentId = resolvedParams.id;
  const supabase = await createClient();

  // 1. Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, created_at")
    .eq("id", studentId)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // 2. Fetch exam submissions
  // Use casting to match expected types with inner join
  const { data: submissionsData } = await supabase
    .from("exam_submissions")
    .select(`
      id,
      score,
      total_score,
      status,
      created_at,
      exams!inner (
        title,
        exam_type,
        pass_score
      )
    `)
    .eq("user_id", studentId)
    .order("created_at", { ascending: false });
    
  // Since exact inferring in nested selected relations can be tricky, cast exactly.
  const submissions = (submissionsData || []) as unknown as ExamHistoryRecord[];

  // 3. Compute stats
  let totalScore = 0;
  let gradedCount = 0;

  submissions.forEach((sub) => {
    if (sub.status === "completed" || sub.status === "graded") {
      if (sub.score !== null) {
        totalScore += sub.score;
        gradedCount += 1;
      }
    }
  });

  const averageScore = gradedCount > 0 ? totalScore / gradedCount : 0;
  // Currently level is not in the db profile table
  const level = null; 

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <StudentDetailHeader profile={profile} />
        <StudentStats 
          level={level} 
          averageScore={averageScore} 
          examCount={submissions.length} 
        />
        <StudentExamHistory submissions={submissions} />
      </div>
    </div>
  );
}
