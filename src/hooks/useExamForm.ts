// src/hooks/useExamForm.ts
import { useState, useEffect, useCallback } from 'react';
import { ExamData, Question } from '@/types/exam-editor';
import { toast } from 'sonner';

// Helper: Build Tree từ Flat Data
const buildQuestionTree = (flatQuestions: Question[]): Question[] => {
  if (!flatQuestions || flatQuestions.length === 0) return [];
  
  try {
    const roots: Question[] = [];
    const map: Record<string, Question> = {};

    // 1. Init Map & Clone objects để tránh mutate reference gốc
    flatQuestions.forEach(q => {
      map[q.id] = { ...q, sub_questions: [] };
    });

    // 2. Gom nhóm
    flatQuestions.forEach(q => {
      const node = map[q.id];
      if (q.parent_id && map[q.parent_id]) {
        map[q.parent_id].sub_questions?.push(node);
      } else {
        roots.push(node);
      }
    });

    // 3. Sort by order_index
    const sortByOrder = (a: Question, b: Question) => a.order_index - b.order_index;
    roots.sort(sortByOrder);
    roots.forEach(root => root.sub_questions?.sort(sortByOrder));

    return roots;
  } catch (error) {
    console.error("Build tree error:", error);
    return [];
  }
};

export function useExamForm(initialExam?: ExamData, initialQuestions?: Question[]) {
  // Default State
  const defaultExam: ExamData = {
    title: '',
    subject: 'Toán học',
    level: 'medium',
    duration: 60,
    status: 'draft',
    description: '',
    total_score: 100,
    code: '',
    ...initialExam
  };

  const [exam, setExam] = useState<ExamData>(defaultExam);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Init Data
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setQuestions(buildQuestionTree(initialQuestions));
    }
  }, [initialQuestions]);

  // Handlers
  const addOrUpdateQuestion = useCallback((qData: Question, index: number | null) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      // Nếu là thêm mới (index === -1 hoặc null logic cũ) -> Thường logic UI sẽ truyền index
      // Ở đây ta giả định index === -1 là thêm mới
      if (index === null || index === -1) {
        return [...newQuestions, qData];
      }
      
      // Update
      if (index >= 0 && index < newQuestions.length) {
        newQuestions[index] = qData;
      }
      return newQuestions;
    });
  }, []);

  const deleteQuestion = useCallback((index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    exam,
    setExam,
    questions,
    setQuestions, // Expose để reorder nếu cần
    addOrUpdateQuestion,
    deleteQuestion
  };
}