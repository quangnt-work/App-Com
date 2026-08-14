// src/app/(student)/student/exams/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExamAttemptClient } from '@/components/student/exams/attempt/ExamAttemptClient';

export default async function ExamAttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Lấy thông tin bài kiểm tra
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single();

  if (examError || !exam) {
    redirect('/student/exams');
  }

  // Use service role to completely bypass RLS to verify if questions exist
  // We'll create a dedicated admin client just for this fetch.
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Lấy danh sách câu hỏi
  const { data: rawQuestions, error: fetchError } = await supabaseAdmin
    .from('exam_questions')
    .select('*')
    .eq('exam_id', id)
    .order('order_index', { ascending: true });

  console.log("FETCHED QUESTIONS ERROR WITH ADMIN:", fetchError);
  console.log("RAW QUESTIONS DB LENGTH:", rawQuestions?.length);

  // Admin saves the full question object inside `q.options` as JSON. 
  // We need to unwrap it so ExamAttemptClient receives the expected format.
  const questions = (rawQuestions || []).map((q) => {
    const qData = q.options as any;
    if (qData && typeof qData === 'object' && !Array.isArray(qData)) {
      return {
        ...q,
        ...qData,
        id: q.id, // Preserve the database ID for form mapping
      };
    }
    return q;
  });

  return (
    <ExamAttemptClient exam={exam} questions={questions} user={user} />
  );
}
