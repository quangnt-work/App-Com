// src/app/(admin)/admin/lessons/audios/create/page.tsx
import AudioForm from "@/components/admin/lessons/audios/AudioForm";

export const metadata = {
    title: "Thêm bài nghe | Admin Dashboard",
};

export default function CreateAudioPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            <AudioForm />
        </div>
    );
}
