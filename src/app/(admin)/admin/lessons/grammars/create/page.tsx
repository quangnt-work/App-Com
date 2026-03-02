// app/(admin)/lessons/create/page.tsx
import { Metadata } from 'next';
import GrammarForm from '@/components/admin/lessons/grammars/grammar-editor/GrammarForm';

export const metadata: Metadata = {
  title: 'Tạo bài học mới | Admin Dashboard',
  description: 'Thêm bài học mới vào hệ thống',
};

export default function CreateGrammarPage() {
  return (
    <main>
      <GrammarForm isEditing={false} />
    </main>
  );
}