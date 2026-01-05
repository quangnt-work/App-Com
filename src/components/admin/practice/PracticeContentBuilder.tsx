import React from 'react'
import { PracticeSkill, PracticeQuestion } from '@/types/practice-admin'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

// Import các sub-builders (Chúng ta sẽ viết ngay bên dưới)
import { ListeningReadingBuilder } from './builders/ListeningReadingBuilder'
import { SpeakingWritingBuilder } from './builders/SpeakingWritingBuilder'
import { GrammarVocabBuilder } from './builders/GrammarVocabBuilder'

interface Props {
  skill: PracticeSkill;
  questions: PracticeQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<PracticeQuestion[]>>;
}

export function PracticeContentBuilder({ skill, questions, setQuestions }: Props) {
  
  // Render sub-builder tương ứng
  const renderBuilder = () => {
    switch (skill) {
      case 'listening':
        return <ListeningReadingBuilder mode="listening" questions={questions} setQuestions={setQuestions} />
      
      case 'reading':
        return <ListeningReadingBuilder mode="reading" questions={questions} setQuestions={setQuestions} />
      
      case 'speaking':
        return <SpeakingWritingBuilder mode="speaking" questions={questions} setQuestions={setQuestions} />
      
      case 'writing':
        return <SpeakingWritingBuilder mode="writing" questions={questions} setQuestions={setQuestions} />
      
      case 'grammar':
        return <GrammarVocabBuilder mode="grammar" questions={questions} setQuestions={setQuestions} />
      
      case 'vocabulary':
        return <GrammarVocabBuilder mode="vocabulary" questions={questions} setQuestions={setQuestions} />
        
      default:
        return <div>Chưa hỗ trợ kỹ năng này</div>
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hướng dẫn nhanh */}
      <Alert className="bg-sky-50 border-sky-100 text-sky-800">
        <Info className="w-4 h-4" />
        <AlertTitle className="font-bold">Đang soạn thảo: {skill.toUpperCase()}</AlertTitle>
        <AlertDescription className="text-xs mt-1">
          {getInstruction(skill)}
        </AlertDescription>
      </Alert>

      {renderBuilder()}
    </div>
  )
}

function getInstruction(skill: string) {
    const map: any = {
        listening: 'Upload file âm thanh, sau đó thêm các câu hỏi trắc nghiệm/tự luận đi kèm.',
        reading: 'Nhập nội dung bài đọc hoặc upload file PDF, sau đó thêm câu hỏi đi kèm.',
        speaking: 'Tải lên chủ đề nói (ảnh/text) hoặc file audio mẫu.',
        writing: 'Nhập đề bài viết luận hoặc upload file đề bài.',
        grammar: 'Tạo các câu hỏi trắc nghiệm, tìm lỗi sai, sắp xếp câu, viết lại câu...',
        vocabulary: 'Tạo danh sách từ vựng kiểm tra (điền từ, trắc nghiệm nghĩa).'
    };
    return map[skill] || '';
}