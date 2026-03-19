'use server';

import { createClient } from '@/lib/supabase/server';

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
    let feedbackNotes: string[] = [];

    for (const q of questions) {
      const weight = q.score || 1;
      totalWeight += weight;

      const userAnswer = payload.answers[q.id]?.trim();
      const correctAnswer = q.correct_answer?.trim();

      if (!userAnswer) {
        continue;
      }

      if (q.type === 'multiple_choice') {
        if (userAnswer === correctAnswer) {
          earnedWeight += weight;
        }
      } else if (q.type === 'fill_in_blank') {
        // Tích hợp case-insensitive
        if (userAnswer.toLowerCase() === correctAnswer?.toLowerCase()) {
          earnedWeight += weight;
        } else {
          feedbackNotes.push(`Câu hỏi "${q.content.substring(0, 30)}...": Đáp án đúng là "${correctAnswer}", nhưng bạn điền "${userAnswer}".`);
        }
      } else if (q.type === 'essay') {
        const apiKey = process.env.GROQ_API_KEY;
        let aiScoreRatio = 0.5;
        let aiFeedback = "Không thể chấm điểm tự động lúc này.";

        if (apiKey) {
          try {
            const prompt = `Bạn là giáo viên ngoại ngữ. Chấm bài học sinh theo thang điểm 10. Tôn trọng đáp án gợi ý. Trả về JSON thuần tuý: {"score": <điểm_số>, "feedback": "<nhận xét_ngắn_gọn>"}.
Câu hỏi: ${q.content}
Đáp án gợi ý: ${correctAnswer || 'Không có'}
Bài làm: ${userAnswer}`;

            // Gọi Groq API qua `fetch`
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: "llama3-8b-8192", // Dùng llama3 thay vì mix-ral
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.1
              })
            });

            if (response.ok) {
              const data = await response.json();
              const content = data.choices?.[0]?.message?.content;
              if (content) {
                const parsed = JSON.parse(content);
                const score10 = Number(parsed.score) || 0;
                aiScoreRatio = Math.max(0, Math.min(10, score10)) / 10;
                aiFeedback = parsed.feedback || "Đã chấm điểm.";
              }
            } else {
              const errText = await response.text();
              console.error("Groq AI Error response:", errText);
            }
          } catch (e) {
            console.error("Groq AI Ex:", e);
          }
        }

        earnedWeight += weight * aiScoreRatio;
        feedbackNotes.push(`[Trí tuệ Nhân tạo - Câu tự luận]: ${aiFeedback} (Score: ${(aiScoreRatio * 10).toFixed(1)}/10)`);
      }
    }

    // Quy đổi ra thang điểm 10
    const finalScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 10 : 0;
    const finalScoreFixed = parseFloat(finalScore.toFixed(2));

    // 3. Save to History
    const { error: insertError } = await supabase
      .from('exam_submissions')
      .insert({
        user_id: user.id,
        exam_id: payload.examId,
        score: finalScoreFixed,
        total_score: 10,
        answers: payload.answers,
        status: 'graded',
        teacher_feedback: feedbackNotes.join('\n\n'),
        // started_at: có thể truyền ở payload nếu track từ lúc mở trang
      });

    if (insertError) {
      console.error(insertError);
      return { success: false, error: 'Database Error: Cannot save submission' };
    }

    return {
      success: true,
      score: finalScoreFixed,
      aiFeedback: feedbackNotes.length > 0 ? feedbackNotes : undefined
    };

  } catch (err: any) {
    console.error("submitExam Error", err);
    return { success: false, error: err.message || 'Lỗi hệ thống' };
  }
}
