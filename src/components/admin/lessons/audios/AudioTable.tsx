// src/components/admin/lessons/audios/AudioTable.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Headphones, Music } from "lucide-react";
import DeleteAudioButton from "./DeleteAudioButton";
import { format, isValid, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Grammar } from "@/types/grammar";

interface AudioTableProps {
    data: Grammar[];
}

function safeFormatDate(dateString?: string | null): string {
    if (!dateString) return "-";
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, "dd/MM/yyyy", { locale: vi }) : "-";
}

function StatusBadge({ status }: { status?: string | boolean | null }) {
    const isPublished = status === "published" || status === true;
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isPublished
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
        >
            {isPublished ? "Công khai" : "Nháp"}
        </span>
    );
}

export default function AudioTable({ data }: AudioTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table className="w-full text-sm text-left">
                <TableHeader className="bg-white border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
                    <TableRow className="hover:bg-white">
                        <TableHead className="py-5 px-6 font-bold w-[40%]">TÊN BÀI NGHE</TableHead>
                        <TableHead className="py-5 px-6 font-bold text-center">ĐỊNH DẠNG</TableHead>
                        <TableHead className="py-5 px-6 font-bold text-center">TRẠNG THÁI</TableHead>
                        <TableHead className="py-5 px-6 font-bold text-center">NGÀY TẠO</TableHead>
                        <TableHead className="py-5 px-6 font-bold text-center">THAO TÁC</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-50">
                    {data.map((lesson) => (
                        <TableRow key={lesson.id} className="hover:bg-gray-50/50 transition-colors">
                            {/* Tên bài */}
                            <TableCell className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                                        <Headphones className="w-4 h-4 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 line-clamp-1">{lesson.title}</p>
                                        {lesson.description && (
                                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{lesson.description}</p>
                                        )}
                                    </div>
                                </div>
                            </TableCell>

                            {/* Định dạng */}
                            <TableCell className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-1.5 text-sky-600">
                                    <Music className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase">
                                        {lesson.audio_url ? lesson.audio_url.split(".").pop()?.toUpperCase() : "Audio"}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Trạng thái */}
                            <TableCell className="py-4 px-6 text-center">
                                <StatusBadge status={lesson.status} />
                            </TableCell>

                            {/* Ngày tạo */}
                            <TableCell className="py-4 px-6 text-center text-gray-500">
                                {safeFormatDate(lesson.created_at)}
                            </TableCell>

                            {/* Thao tác */}
                            <TableCell className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                                    >
                                        <Link href={`/admin/lessons/audios/${lesson.id}`}>
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <DeleteAudioButton id={lesson.id} title={lesson.title} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {data.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    <Headphones className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="font-medium">Chưa có bài nghe nào.</p>
                    <p className="text-sm text-gray-400 mt-1">Bấm "Thêm bài nghe mới" để bắt đầu.</p>
                </div>
            )}
        </div>
    );
}
