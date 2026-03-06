import { notFound } from 'next/navigation';
import { Video } from 'lucide-react';
import { GrammarRepository } from '@/repositories/GrammarRepository';
import { type Grammar } from '@/types/grammar';
import { VideoPlayer } from '@/components/student/lessons/videos/VideoPlayer';
import { DocNotesSection } from '@/components/student/lessons/videos/DocNotesSection';

interface VideoDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VideoDetailPageProps) {
    const { id } = await params;
    const { data } = await GrammarRepository.getById(id);
    return {
        title: data?.title ? `${data.title} | Bài giảng Video` : 'Chi tiết Video',
    };
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
    const { id } = await params;
    const { data, error } = await GrammarRepository.getById(id);

    if (error || !data) notFound();

    const lesson = data as unknown as Grammar;

    if (lesson.type !== 'video') notFound();

    const videoSrc = lesson.file_url ?? '';

    return (
        <div className="flex-1 container mx-auto px-4 py-8 max-w-[850px] font-sans">
            <div className="bg-white rounded-2xl border-t-4 border-t-[#f07b32] border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="p-8 pb-10">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
                            {lesson.title}
                        </h1>
                        {lesson.description && (
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                {lesson.description}
                            </p>
                        )}
                    </div>

                    {/* Video Player Area */}
                    <VideoPlayer
                        src={videoSrc}
                        title={lesson.title}
                        thumbnail={lesson.thumbnail ?? undefined}
                    />

                </div>
            </div>

            {/* Notes Area */}
            <DocNotesSection lessonTitle={lesson.title} />

        </div>
    );
}
