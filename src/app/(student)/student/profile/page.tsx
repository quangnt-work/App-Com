// src/app/(student)/student/profile/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileClient } from '@/components/student/profile/ProfileClient';
import { UserProfile, TestRecord, ChartDataPoint, TestCategory } from '@/types/profile';
import roleplayJson from '@/data/roleplay.json';
import shadowingJson from '@/data/shadowing.json';

export const metadata = {
  title: "Hồ sơ cá nhân | Hệ thống học tập",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  // Fetch real profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();


  // Fetch real history
  const { data: submissions } = await supabase
    .from('exam_submissions')
    .select(`
      id,
      created_at,
      score,
      total_score,
      exam_id,
      exams (
        title,
        exam_type,
        level,
        duration
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Map to TestRecord and find highest passed level
  const LEVEL_ORDER: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6, all: 0 };
  let highestLevelRank = -1;
  let highestLevel = '-';

  const history: TestRecord[] = (submissions || []).map((sub: any) => {
    const examType = sub.exams?.exam_type;
    const examLevel = sub.exams?.level || '-';
    const examDuration = sub.exams?.duration || 60;
    let typeLabel: TestCategory = 'Tổng hợp';
    if (examType === 'grammar') typeLabel = 'Ngữ pháp';
    if (examType === 'reading') typeLabel = 'Đọc hiểu';
    if (examType === 'listening') typeLabel = 'Nghe hiểu';

    // Only assign level from passed submissions (>= 70% of total_score)
    const totalScore = sub.total_score || 10;
    const isPassed = sub.score && (sub.score / totalScore) >= 0.7;
    if (isPassed && examLevel in LEVEL_ORDER) {
      const rank = LEVEL_ORDER[examLevel];
      if (rank > highestLevelRank) {
        highestLevelRank = rank;
        highestLevel = examLevel;
      }
    }

    return {
      id: sub.id,
      submissionId: sub.id,
      examId: sub.exam_id,
      date: new Date(sub.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }),
      name: sub.exams?.title || 'Bài kiểm tra',
      type: typeLabel,
      score: sub.score || 0,
      totalScore: totalScore,
      passed: !!isPassed,
      examLevel,
      examDuration,
    };
  });

  const profile: UserProfile = {
    id: user.id,
    name: profileData?.full_name || user.user_metadata?.full_name || 'Học viên',
    username: profileData?.username || user.user_metadata?.username || 'HV',
    level: highestLevel,
    email: user.email || '',
    joinDate: new Date(profileData?.created_at || user.created_at).toLocaleDateString('vi-VN'),
  };

  // Generate chart data: each type has its own sequential x-axis T1, T2... 
  // We collect scores per type in chronological order (ascending) then build
  // chart points where each slot has only the relevant type filled in.
  const subsByType = { grammar: [] as number[], reading: [] as number[], listening: [] as number[], mixed: [] as number[] };
  const chronoHistory = [...history].reverse(); // earliest first

  chronoHistory.forEach((sub) => {
    if (sub.type === 'Ngữ pháp') subsByType.grammar.push(sub.score);
    if (sub.type === 'Đọc hiểu') subsByType.reading.push(sub.score);
    if (sub.type === 'Nghe hiểu') subsByType.listening.push(sub.score);
    if (sub.type === 'Tổng hợp') subsByType.mixed.push(sub.score);
  });

  // Max number of attempts across types (up to 10)
  const maxLen = Math.min(10, Math.max(
    subsByType.grammar.length, subsByType.reading.length,
    subsByType.listening.length, subsByType.mixed.length, 0
  ));

  const chartData: ChartDataPoint[] = [];
  for (let i = 0; i < Math.max(maxLen, 1); i++) {
    const cp: ChartDataPoint = { name: `T${i + 1}` };
    if (subsByType.grammar[i] !== undefined) cp.grammar = subsByType.grammar[i];
    if (subsByType.reading[i] !== undefined) cp.reading = subsByType.reading[i];
    if (subsByType.listening[i] !== undefined) cp.listening = subsByType.listening[i];
    if (subsByType.mixed[i] !== undefined) cp.mixed = subsByType.mixed[i];
    chartData.push(cp);
  }

  // Fetch roleplay history
  const { data: roleplayData } = await supabase
    .from('roleplay_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch db scenarios to get levels
  const { data: dbScenarios } = await supabase
    .from('roleplay_scenarios')
    .select('id, level');

  const getLevelString = (level: number | string) => {
    if (typeof level === 'string') return level;
    switch(level) {
      case 1: return 'A1';
      case 2: return 'A2';
      case 3: return 'B1';
      case 4: return 'B2';
      default: return 'C1';
    }
  };

  const roleplayHistory = (roleplayData || []).map((r: any) => {
    // Find level in DB first
    let level = dbScenarios?.find(s => s.id === r.scenario_id)?.level;
    // Fallback to JSON
    if (!level) {
      const jsonTopic = roleplayJson.find((t: any) => t.id === r.scenario_id);
      if (jsonTopic) level = getLevelString(jsonTopic.level);
    }
    return {
      id: r.id,
      scenarioId: r.scenario_id,
      topicTitle: r.topic_title,
      level: level || 'A1',
      date: new Date(r.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      completedObjectives: (r.completed_objectives || []).length,
      totalObjectives: r.total_objectives,
      hintsUsed: r.hints_used,
      elapsedSeconds: r.elapsed_seconds,
      messages: r.messages || []
    };
  });

  // Fetch shadowing history
  const { data: shadowingData } = await supabase
    .from('shadowing_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch db topics to get levels
  const { data: dbTopics } = await supabase
    .from('shadowing_topics')
    .select('id, level');

  const shadowingHistory = (shadowingData || []).map((s: any) => {
    // Find level in DB first
    let level = dbTopics?.find(t => t.id === s.topic_id)?.level;
    // Fallback to JSON
    if (!level) {
      const jsonTopic = shadowingJson.find((t: any) => t.id === s.topic_id);
      if (jsonTopic) level = getLevelString(jsonTopic.level);
    }
    return {
      id: s.id,
      topicId: s.topic_id,
      topicTitle: s.topic_title,
      level: level || 'A1',
      date: new Date(s.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      score: s.score,
      totalSentences: s.total_sentences,
      completedSentences: s.completed_sentences
    };
  });

  return <ProfileClient profile={profile} history={history} chartData={chartData} roleplayHistory={roleplayHistory} shadowingHistory={shadowingHistory} />;
}