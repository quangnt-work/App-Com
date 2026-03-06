// src/app/(admin)/admin/lessons/videos/create/page.tsx
import VideoForm from "@/components/admin/lessons/videos/VideoForm";

export const metadata = {
    title: "Thêm video | Admin Dashboard",
};

export default function CreateVideoPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            <VideoForm />
        </div>
    );
}
