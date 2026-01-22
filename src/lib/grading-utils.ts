// src/lib/grading-utils.ts

import { QuestionItem } from '@/types/exam-custom'

interface UserAnswer {
  question_id: string;
  is_correct: boolean; // True nếu trả lời đúng
}

export function calculateUserCEFRLevel(questions: QuestionItem[], answers: UserAnswer[]): string {
  // 1. Gom nhóm câu hỏi theo Level
  const stats = {
    A1: { total: 0, correct: 0 },
    A2: { total: 0, correct: 0 },
    B1: { total: 0, correct: 0 },
    B2: { total: 0, correct: 0 },
    C1: { total: 0, correct: 0 },
    C2: { total: 0, correct: 0 },
  };

  // 2. Tính toán thống kê
  questions.forEach(q => {
    const level = q.cefr_level || 'B1'; // Mặc định B1 nếu không có tag
    if (stats[level]) {
      stats[level].total++;
      
      const userAnswer = answers.find(a => a.question_id === q.id);
      if (userAnswer && userAnswer.is_correct) {
        stats[level].correct++;
      }
    }
  });

  // 3. Logic xếp hạng (Waterfall)
  // Quy tắc: Phải đạt > 70% level hiện tại mới được xét level tiếp theo
  const PASS_THRESHOLD = 0.7; // 70%
  let finalLevel = 'A0'; // Dưới A1

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  for (const level of levels) {
    const { total, correct } = stats[level as keyof typeof stats];
    
    // Nếu đề thi không có câu hỏi level này, ta có thể bỏ qua hoặc coi như đạt (tùy logic)
    // Ở đây giả sử: Nếu không có câu hỏi level này -> Không thể đánh giá cao hơn -> Dừng.
    if (total === 0) break; 

    const ratio = correct / total;
    if (ratio >= PASS_THRESHOLD) {
      finalLevel = level;
    } else {
      // Nếu trượt level này, dừng lại, lấy level cao nhất trước đó
      break; 
    }
  }

  return finalLevel;
}