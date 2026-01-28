// components/lessons/lesson-form.tsx
'use client';

import { useState } from 'react';
import { LessonFormData } from '@/types/lesson';
import HeaderActions from './header-actions';
import GeneralInfo from './sections/general-info';
import LessonContent from './sections/lesson-content';
import AudioUpload from './sections/audio-upload';
import QuizBuilder from './sections/quiz-builder';
import { Button } from '@/components/ui/button'; // Giả sử bạn có UI components

interface LessonFormProps {
  initialData?: LessonFormData; // Dữ liệu nếu là trang Edit
  isEditing?: boolean;
}

const DEFAULT_DATA: LessonFormData = {
    title: '',
    description: '',
    type: 'text',
    file_url: '',
    audio_url: '',
    questions: [],
    category: '',
    status: false
};

export default function LessonForm({ initialData, isEditing = false }: LessonFormProps) {
  const [formData, setFormData] = useState<LessonFormData>(initialData || DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm update state chung
  const updateField = (field: keyof LessonFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setIsLoading(true);
    // TODO: Gọi Server Action để lưu dữ liệu vào Supabase
    console.log('Saving...', formData, status);
    // await upsertLesson(formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Sticky */}
      <HeaderActions 
        title={formData.title} 
        isEditing={isEditing} 
        onSave={() => handleSubmit('published')}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        
        {/* Section 1: Thông tin chung */}
        <GeneralInfo 
          title={formData.title}
          description={formData.description}
          onChange={updateField}
        />

        {/* Section 2: Nội dung bài học */}
        <LessonContent 
          contentType={formData.type}
          fileUrl={formData.file_url}
          onChange={updateField}
        />

        {/* Section 3: Audio */}
        <AudioUpload 
          audioUrl={formData.audio_url}
          onChange={(url) => updateField('audio_url', url)}
        />

        {/* Section 4: Trắc nghiệm */}
        <QuizBuilder 
          questions={formData.questions}
          onChange={(qs) => updateField('questions', qs)}
        />

      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 z-10">
        <Button variant="ghost" onClick={() => router.back()}>Hủy bỏ</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')}>Lưu bản nháp</Button>
      </div>
    </div>
  );
}