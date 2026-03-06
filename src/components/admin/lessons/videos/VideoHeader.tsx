// src/components/admin/lessons/videos/VideoHeader.tsx
import Link from "next/link";
import { Plus, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideoHeader() {
    return (
        <div>
            {/* Banner */}
            <div className="bg-[#f97316] rounded-2xl p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-md">
                <div className="flex items-center gap-4">
                    <PlayCircle size={40} className="opacity-90" />
                    <h1 className="text-3xl font-bold tracking-wide">QUẢN LÝ VIDEO</h1>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0 text-orange-100 flex-col md:flex-row md:items-center">
                    <span className="text-sm font-medium">Danh sách bài học video</span>
                    <PlayCircle size={20} />
                </div>
            </div>

            {/* Nút Thêm mới */}
            <Link href="/admin/lessons/videos/create">
                <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white shadow-sm font-medium rounded-lg px-6 h-11">
                    <Plus className="w-5 h-5 mr-2" />
                    Thêm video mới
                </Button>
            </Link>
        </div>
    );
}
