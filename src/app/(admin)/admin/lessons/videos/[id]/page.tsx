// src/app/(admin)/admin/lessons/videos/[id]/page.tsx
import VideoForm from "@/components/admin/lessons/videos/VideoForm";
import { getGrammar } from "@/actions/GrammarActions";
import { notFound } from "next/navigation";

interface EditVideoPageProps {
    params: Promise<{ id: string }>;
}

export const metadata = {
    title: "Chỉnh sửa video | Admin Dashboard",
};

export default async function EditVideoPage({ params }: EditVideoPageProps) {
    const { id } = await params;
    const { data, error } = await getGrammar(id);

    if (error || !data || (data as unknown as import('@/types/grammar').Grammar).type !== "video") {
        notFound();
    }

    const lesson = data as unknown as import('@/types/grammar').Grammar;
    const initialData = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description ?? undefined,
        category: lesson.category ?? undefined,
        duration: lesson.duration ?? undefined,
        thumbnail: lesson.thumbnail ?? undefined,
        file_url: lesson.file_url ?? undefined,
        status: lesson.status === "published",
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            <VideoForm initialData={initialData} isEditing />
        </div>
    );
}
