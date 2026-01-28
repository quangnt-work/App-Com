// app/(admin)/lessons/create/page.tsx
import { Metadata } from 'next';
import LessonForm from '@/components/admin/lessons/lesson-editor/lesson-form';

export const metadata: Metadata = {
  title: 'Tạo bài học mới | Admin Dashboard',
  description: 'Thêm bài học mới vào hệ thống',
};

export default function CreateLessonPage() {
  return (
    <main>
      <LessonForm isEditing={false} />
    </main>
  );
}