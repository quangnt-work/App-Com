// components/lessons/lesson-form.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { LessonFormData } from '@/types/lesson';
import HeaderActions from './header-actions';
import GeneralInfo from './sections/general-info';
import LessonContent from './sections/lesson-content';
import AudioUpload from './sections/audio-upload';
import QuizBuilder from './sections/quiz-builder';
import { Button } from '@/components/ui/button';

interface LessonFormProps {
  initialData?: LessonFormData; // Dữ liệu nếu là trang Edit
  isEditing?: boolean;
}

const DEFAULT_DATA: LessonFormData = {
  title: '',
  description: '',
  type: 'file',
    file_url: '',
    audio_url: '',
    questions: [],
    category: '',
    status: false
};

export default function LessonForm({ initialData, isEditing = false }: LessonFormProps) {

  // 1. State cho Form Data (Bản nháp đang sửa)
  const [formData, setFormData] = useState<LessonFormData>(initialData || DEFAULT_DATA);
  const [savedTitle, setSavedTitle] = useState(initialData?.title || '');
  const [isLoading, setIsLoading] = useState(false);

  // Hàm update state chung
  const updateField = (field: keyof LessonFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài học");
      return;
    }

    setIsLoading(true);
    try {
      // GIẢ LẬP GỌI API (Thay bằng Server Action của bạn)
      console.log('Đang lưu...', formData, status);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay giả 1.5s để test loading

      // SAU KHI LƯU THÀNH CÔNG:
      setSavedTitle(formData.title); // Cập nhật tiêu đề Header
      toast.success(status === 'published' ? "Đã thêm mới bài học thành công!" : "Đã lưu bản nháp!");
      
      // Nếu cần redirect hoặc refresh router:
      // router.refresh();
      
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeaderActions 
        title={formData.title} 
        isEditing={isEditing} 
        onSave={() => handleSubmit('published')}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        
        <GeneralInfo 
          title={formData.title}
          description={formData.description}
          onChange={updateField}
        />

        <LessonContent 
          contentType={formData.type}
          fileUrl={formData.file_url}
          onChange={updateField}
        />

        <AudioUpload 
          audioUrl={formData.audio_url}
          onChange={(url) => updateField('audio_url', url)}
        />

        <QuizBuilder 
          questions={formData.questions}
          onChange={(qs) => updateField('questions', qs)}
        />

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 z-10">
        <Button variant="ghost" onClick={() => router.back()}>Hủy bỏ</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')}>Lưu bản nháp</Button>
      </div>
    </div>
  );
}