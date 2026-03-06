// src/app/(admin)/admin/lessons/audios/page.tsx
import AudioHeader from "@/components/admin/lessons/audios/AudioHeader";
import AudioTable from "@/components/admin/lessons/audios/AudioTable";
import { GrammarPagination } from "@/components/admin/lessons/grammars/GrammarPagination";
import { getGrammars } from "@/actions/GrammarActions";
import { Grammar } from "@/types/grammar";

interface AudiosPageProps {
    searchParams: Promise<{ page?: string }>;
}

export const metadata = {
    title: "Quản lý bài nghe | Admin Dashboard",
};

export default async function AdminAudiosPage({ searchParams }: AudiosPageProps) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const pageSize = 5;

    // Filter đúng từ DB theo type='audio'
    const { data, count, error } = await getGrammars(currentPage, pageSize, "", "", "audio");
    const audios = (data as unknown as Grammar[]) ?? [];

    if (error) {
        return (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-md m-6 border border-red-200">
                <h3 className="font-bold">Đã xảy ra lỗi</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fc] p-6 lg:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <AudioHeader />
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
                    <AudioTable data={audios} />
                    <div className="p-6 border-t border-gray-100 bg-white">
                        <GrammarPagination
                            currentPage={currentPage}
                            totalItems={count ?? 0}
                            pageSize={pageSize}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
