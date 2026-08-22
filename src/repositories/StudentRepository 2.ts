// src/repositories/StudentRepository.ts
import { createClient } from "@/lib/supabase/server";
import { StudentWithStats } from "@/types/admin";

interface GetStudentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const StudentRepository = {
  async getStudentsWithStats({
    page = 1,
    pageSize = 12,
    search,
  }: GetStudentsParams): Promise<{ data: StudentWithStats[]; count: number; error: string | null }> {
    const supabase = await createClient();

    // Step 1: Get student profiles with pagination
    let query = supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url, created_at", { count: "exact" })
      .eq("role", "student");

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%`);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data: profiles, count, error: profilesError } = await query
      .range(start, end)
      .order("created_at", { ascending: false });

    if (profilesError || !profiles) {
      return { data: [], count: 0, error: profilesError?.message ?? "Unknown error" };
    }

    if (profiles.length === 0) {
      return { data: [], count: count ?? 0, error: null };
    }

    // Step 2: Get emails from auth.users via supabase admin (using profiles.id = auth user id)
    // We get submission stats for these profile IDs
    const profileIds = profiles.map((p) => p.id);

    const { data: submissions, error: submissionsError } = await supabase
      .from("exam_submissions")
      .select("user_id, score, total_score, status")
      .in("user_id", profileIds)
      .in("status", ["completed", "graded"]);

    if (submissionsError) {
      console.error("Failed to fetch submissions:", submissionsError.message);
    }

    // Step 3: Aggregate exam stats per user
    const statsMap = new Map<
      string,
      { examCount: number; highestScore: number | null; highestTotal: number | null }
    >();

    for (const sub of submissions ?? []) {
      if (!sub.user_id) continue;
      const current = statsMap.get(sub.user_id) ?? {
        examCount: 0,
        highestScore: null,
        highestTotal: null,
      };

      current.examCount += 1;

      const score = sub.score ?? null;
      if (score !== null) {
        current.highestScore =
          current.highestScore === null ? score : Math.max(current.highestScore, score);
        current.highestTotal = sub.total_score ?? current.highestTotal;
      }

      statsMap.set(sub.user_id, current);
    }

    // Step 4: Assemble final result
    // NOTE: email is stored in auth.users, not profiles. We derive a display email from username.
    // If you have a users/auth view or RLS to access emails, adapt accordingly.
    const students: StudentWithStats[] = profiles.map((profile) => {
      const stats = statsMap.get(profile.id) ?? {
        examCount: 0,
        highestScore: null,
        highestTotal: null,
      };

      return {
        id: profile.id,
        full_name: profile.full_name,
        username: profile.username,
        email: profile.username ? `${profile.username}` : `user_${profile.id.slice(0, 8)}`,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        level: null, // Level not in profiles table; extend if needed
        examCount: stats.examCount,
        highestScore: stats.highestScore,
      };
    });

    return { data: students, count: count ?? 0, error: null };
  },
};
