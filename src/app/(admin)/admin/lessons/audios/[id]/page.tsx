// src/app/(admin)/admin/lessons/audios/[id]/page.tsx
import AudioForm from "@/components/admin/lessons/audios/AudioForm";
import { getGrammar } from "@/actions/GrammarActions";
import { notFound } from "next/navigation";

interface EditAudioPageProps {
    params: Promise<{ id: string }>;
}

export const metadata = {
    title: "Chỉnh sửa bài nghe | Admin Dashboard",
};

export default async function EditAudioPage({ params }: EditAudioPageProps) {
    const { id } = await params;
    const { data, error } = await getGrammar(id);

    if (error || !data || (data as unknown as import('@/types/grammar').Grammar).type !== "audio") {
        notFound();
    }

    const lesson = data as unknown as import('@/types/grammar').Grammar;
    const initialData = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description ?? undefined,
        category: lesson.category ?? undefined,
        duration: lesson.duration ?? undefined,
        audio_url: lesson.audio_url ?? undefined,
        status: lesson.status === "published",
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            <AudioForm initialData={initialData} isEditing />
        </div>
    );
}
