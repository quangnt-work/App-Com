'use server';

import { createClient } from '@/lib/supabase/server';
import { generateContentWithFallback, parseAIResponse } from '@/lib/gemini';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QuestionResult {
  id: string;
  orderIndex: number;
  type: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean | null;
  score: number | null;
  explanation: string;
  aiFeedback: string;
  // Rich rendering context (from options JSONB)
  rawOptions: Record<string, any>;
}

export interface SubmissionDetail {
  submissionId: string;
  examTitle: string;
  score: number;
  totalScore: number;
  passed: boolean;
  teacherFeedback: string;
  questions: QuestionResult[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
import { parseOptions, evaluateQuestionAnswer } from '@/lib/graders';

// ─── getSubmissionDetail ─────────────────────────────────────────────────────

export async function getSubmissionDetail(
  submissionId: string
): Promise<{ success: true; data: SubmissionDetail } | { success: false; error: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // 1. Fetch submission header
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    let query = supabase
      .from('exam_submissions')
      .select('id, score, total_score, answers, teacher_feedback, exam_id, exams(title)')
      .eq('id', submissionId);

    if (profile?.role !== 'admin') {
      query = query.eq('user_id', user.id);
    }

    const { data: sub, error: subErr } = await query.single();

    if (subErr || !sub) return { success: false, error: 'Không tìm thấy bài làm.' };

    const totalScore = sub.total_score || 10;
    const subScore = sub.score ?? 0;
    const passed = (subScore / totalScore) >= 0.7;

    // 2. Try new table first
    const { data: qrRows } = await supabase
      .from('submission_question_results')
      .select('*')
      .eq('submission_id', submissionId)
      .order('order_index', { ascending: true });

    let questions: QuestionResult[];

    if (qrRows && qrRows.length > 0) {
      const qIds = qrRows.map((r) => r.question_id).filter(Boolean);
      const { data: qDetails } = qIds.length > 0
        ? await supabase.from('exam_questions').select('id, options').in('id', qIds)
        : { data: [] };
      const qDetailsMap: Record<string, any> = {};
      (qDetails || []).forEach((q: any) => { qDetailsMap[q.id] = parseOptions(q); });

      questions = qrRows.map((r) => ({
        id: r.question_id,
        orderIndex: r.order_index ?? 0,
        type: r.question_type,
        questionText: r.question_text,
        userAnswer: r.user_answer || '',
        correctAnswer: r.correct_answer || '',
        isCorrect: r.is_correct,
        score: r.earned_score,
        explanation: r.admin_explanation || '',
        aiFeedback: r.ai_feedback || '',
        rawOptions: qDetailsMap[r.question_id] || {},
      }));
    } else {
      const { data: rawQuestions } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('exam_id', sub.exam_id ?? '')
        .order('order_index', { ascending: true });

      const studentAnswers: Record<string, string> = (sub.answers as Record<string, string>) || {};
      const teacherFeedback: string = sub.teacher_feedback || '';
      const feedbackLines = teacherFeedback.split('\n\n').filter(Boolean);

      questions = (rawQuestions || []).map((q: any) => {
        const opts = parseOptions(q);
        const qType = q.type || '';
        const userAnswer = studentAnswers[q.id] || '';

        let questionText = '';
        try {
          const cp = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
          questionText = cp?.question || cp?.sentence || q.content || '';
          if (typeof questionText !== 'string') questionText = q.content || '';
        } catch { questionText = q.content || ''; }
        if (!questionText || questionText.startsWith('{')) questionText = opts?.question || q.id;

        let correctAnswer = '';
        if (opts?.correct_indexes && Array.isArray(opts.correct_indexes) && Array.isArray(opts.options)) {
          correctAnswer = opts.correct_indexes.map((i: number) => opts.options[i]).filter(Boolean).join(', ');
        } else if (opts?.correct_sentence) correctAnswer = opts.correct_sentence;
        else if (opts?.correct_part) correctAnswer = `"${opts.wrong_part}" → "${opts.correct_part}"`;
        else if (opts?.correct_answers && Array.isArray(opts.correct_answers)) correctAnswer = opts.correct_answers.join(', ');
        else if (opts?.correct_answer) correctAnswer = opts.correct_answer;
        else if (q.correct_answer) correctAnswer = q.correct_answer;

        const titleSnippet = questionText.substring(0, 30).toLowerCase();
        const aiFeedback = feedbackLines.find(l => l.toLowerCase().includes(titleSnippet)) || '';

        let isCorrect: boolean | null = null;
        const isOpen = ['essay', 'reading_open', 'listening_open'].includes(qType);
        if (!isOpen && correctAnswer && userAnswer) {
          if (opts?.correct_indexes) {
            try {
              const ui = JSON.parse(userAnswer);
              isCorrect = Array.isArray(ui) &&
                [...opts.correct_indexes].sort().join() === [...ui].map(Number).sort().join();
            } catch { isCorrect = false; }
          } else {
            isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
          }
        }

        return {
          id: q.id,
          orderIndex: q.order_index || 0,
          type: qType,
          questionText,
          userAnswer,
          correctAnswer,
          isCorrect,
          score: isCorrect === true ? (q.score ?? 1) : isCorrect === false ? 0 : null,
          explanation: opts?.explanation || q.explanation || '',
          aiFeedback,
          rawOptions: opts,
        };
      });
    }

    return {
      success: true,
      data: {
        submissionId: sub.id,
        examTitle: (sub.exams as { title?: string })?.title || 'Bài kiểm tra',
        score: subScore,
        totalScore,
        passed,
        teacherFeedback: sub.teacher_feedback || '',
        questions,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi hệ thống' };
  }
}

// ─── submitExam ───────────────────────────────────────────────────────────────

interface SubmitExamPayload {
  examId: string;
  answers: Record<string, string>;
  timeSpent: number; // in seconds
}

export async function submitExam(payload: SubmitExamPayload) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // 1. Fetch exam details and questions
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('*')
      .eq('id', payload.examId)
      .single();

    if (examError || !exam) {
      return { success: false, error: 'Bản ghi không tồn tại.' };
    }

    const { data: questions } = await supabase
      .from('exam_questions')
      .select('*')
      .eq('exam_id', payload.examId);

    if (!questions) {
      return { success: false, error: 'Bài kiểm tra không có câu hỏi.' };
    }

    // 2. Auto-grading process
    let totalWeight = 0;
    let earnedWeight = 0;

    interface QResult {
      question_id: string;
      order_index: number;
      question_text: string;
      question_type: string;
      correct_answer: string;
      user_answer: string;
      is_correct: boolean | null;
      earned_score: number;
      max_score: number;
      ai_feedback: string;
      admin_explanation: string;
    }
    const questionResults: QResult[] = [];

    for (const q of questions) {
      const parsedQ = q.options as any;
      if (!parsedQ || typeof parsedQ !== 'object') continue;

      const weight = parsedQ.score || 1;
      totalWeight += weight;

      const userAnswer = payload.answers[q.id]?.trim() ?? '';
      const qType = parsedQ.question_type || q.type;
      const questionText = parsedQ.question || parsedQ.content || 'Câu hỏi';
      const adminExplanation = parsedQ.explanation || q.explanation || '';

      if (!userAnswer) {
        questionResults.push({
          question_id: q.id,
          order_index: q.order_index ?? 0,
          question_text: questionText,
          question_type: qType,
          correct_answer: '',
          user_answer: '',
          is_correct: false,
          earned_score: 0,
          max_score: weight,
          ai_feedback: 'Học viên bỏ câu này.',
          admin_explanation: adminExplanation,
        });
        continue;
      }

      // Delegate grading to the dedicated helper function
      const { qCorrectAnswer, qIsCorrect, qEarned, qAiFeedback } = await evaluateQuestionAnswer(
        qType, parsedQ, questionText, userAnswer, weight
      );

      earnedWeight += qEarned;

      questionResults.push({
        question_id: q.id,
        order_index: q.order_index ?? 0,
        question_text: questionText,
        question_type: qType,
        correct_answer: qCorrectAnswer,
        user_answer: userAnswer,
        is_correct: qIsCorrect,
        earned_score: parseFloat(qEarned.toFixed(4)),
        max_score: weight,
        ai_feedback: qAiFeedback || (qIsCorrect === true ? 'Đúng.' : qIsCorrect === false ? `Sai. Đáp án đúng: "${qCorrectAnswer}".` : ''),
        admin_explanation: adminExplanation,
      });
    }

    // Quy đổi ra thang điểm 10
    const finalScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 10 : 0;
    const finalScoreFixed = parseFloat(finalScore.toFixed(2));

    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter(q => payload.answers[q.id]).length;
    const correctRatio = totalWeight > 0 ? earnedWeight / totalWeight : 0;
    const correctCount = Math.round(correctRatio * totalQuestions);
    const wrongCount = totalQuestions - correctCount;
    const passed = correctRatio >= 0.7;

    // 3. Save main submission
    const { data: insertedSub, error: insertError } = await supabase
      .from('exam_submissions')
      .insert({
        user_id: user.id,
        exam_id: payload.examId,
        score: finalScoreFixed,
        total_score: 10,
        answers: payload.answers,
        status: 'graded',
        time_spent: payload.timeSpent,
        teacher_feedback: questionResults
          .filter(r => r.ai_feedback)
          .map(r => `[${r.question_text.substring(0, 30)}]: ${r.ai_feedback}`)
          .join('\n\n'),
      } as any)
      .select('id')
      .single();

    if (insertError || !insertedSub) {
      console.error(insertError);
      return { success: false, error: 'Database Error: Cannot save submission' };
    }

    // 4. Save per-question results to submission_question_results
    if (questionResults.length > 0) {
      const { error: qrError } = await supabase
        .from('submission_question_results')
        .insert(questionResults.map(r => ({
          ...r,
          submission_id: insertedSub.id,
        })));

      if (qrError) {
        console.error('Failed to save question results:', qrError);
      }
    }

    return {
      success: true,
      score: finalScoreFixed,
      totalQuestions,
      correctCount,
      wrongCount,
      answeredCount: answeredQuestions,
      passed,
    };

  } catch (err: any) {
    console.error("submitExam Error", err);
    return { success: false, error: err.message || 'Lỗi hệ thống' };
  }
}
