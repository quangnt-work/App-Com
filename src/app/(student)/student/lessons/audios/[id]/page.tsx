// src/app/(student)/student/lessons/audios/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Headphones } from 'lucide-react';
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar';
import { AudioPlayer } from '@/components/student/lessons/audios/AudioPlayer';
import { NotesSection } from '@/components/student/lessons/audios/NotesSection';

interface AudioDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AudioDetailPageProps) {
    const { id } = await params;
    const { data } = await GrammarRepository.getById(id);
    return {
        title: data?.title ? `${data.title} | Bài nghe` : 'Chi tiết bài nghe',
    };
}

export default async function AudioDetailPage({ params }: AudioDetailPageProps) {
    const { id } = await params;
    const { data, error } = await GrammarRepository.getById(id);

    // Bài không tồn tại
    if (error || !data) notFound();

    const lesson = data as unknown as Grammar;

    // Nếu không phải type audio → 404
    if (lesson.type !== 'audio') notFound();

    // URL file audio (có thể lưu ở file_url hoặc audio_url)
    const audioSrc = lesson.file_url ?? lesson.audio_url ?? '';

    return (
        <div className="flex-1 container mx-auto px-4 py-8 max-w-[780px]">
            {/* Card chính */}
            <div className="bg-white rounded-2xl border-t-4 border-t-[#f07b32] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 space-y-6">

                    {/* Tiêu đề bài học */}
                    <div className="flex items-start gap-3">
                        <div className="mt-1 bg-orange-50 p-2 rounded-xl shrink-0">
                            <Headphones className="w-5 h-5 text-[#f07b32]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
                                {lesson.title}
                            </h1>
                            {lesson.description && (
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    {lesson.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Audio Player */}
                    {audioSrc ? (
                        <AudioPlayer src={audioSrc} title={lesson.title} />
                    ) : (
                        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                            <Headphones className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">File audio chưa được đính kèm.</p>
                            <p className="text-xs text-gray-400 mt-1">Quản trị viên chưa tải lên file cho bài học này.</p>
                        </div>
                    )}

                    {/* Notes Section */}
                    <NotesSection lessonId={id} />

                </div>
            </div>
        </div>
    );
}
