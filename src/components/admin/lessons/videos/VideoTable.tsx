// src/components/admin/lessons/videos/VideoTable.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, PlayCircle, Link2 } from "lucide-react";
import DeleteVideoButton from "./DeleteVideoButton";
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

interface VideoTableProps {
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
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
        >
            {isPublished ? "Công khai" : "Nháp"}
        </span>
    );
}

function VideoSourceBadge({ fileUrl }: { fileUrl?: string | null }) {
    if (!fileUrl) return <span className="text-gray-400 text-xs">—</span>;
    const isYoutube = fileUrl.includes("youtube") || fileUrl.includes("youtu.be");
    return (
        <div className="flex items-center justify-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-medium text-rose-600">
                {isYoutube ? "YouTube" : "File"}
            </span>
        </div>
    );
}

export default function VideoTable({ data }: VideoTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table className="w-full text-sm text-left">
                <TableHeader className="bg-white border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
                    <TableRow className="hover:bg-white">
                        <TableHead className="py-5 px-6 font-bold w-[40%]">TÊN VIDEO</TableHead>
                        <TableHead className="py-5 px-6 font-bold text-center">NGUỒN</TableHead>
                        <TableHead className="py-5 px-6 font-bold text-center">TRẠNG THÁI</TableHead>
                        <TableHead className="py-5 px-6 font-bold text-center">NGÀY TẠO</TableHead>
                        <TableHead className="py-5 px-6 font-bold text-center">THAO TÁC</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-50">
                    {data.map((lesson) => (
                        <TableRow key={lesson.id} className="hover:bg-gray-50/50 transition-colors">
                            {/* Thumbnail + Tên */}
                            <TableCell className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    {lesson.thumbnail ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={lesson.thumbnail}
                                            alt={lesson.title}
                                            className="w-14 h-9 object-cover rounded-lg shrink-0 border border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-14 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                                            <PlayCircle className="w-5 h-5 text-rose-400" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-800 line-clamp-1">{lesson.title}</p>
                                        {lesson.description && (
                                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{lesson.description}</p>
                                        )}
                                    </div>
                                </div>
                            </TableCell>

                            {/* Nguồn video */}
                            <TableCell className="py-4 px-6 text-center">
                                <VideoSourceBadge fileUrl={lesson.file_url} />
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
                                        <Link href={`/admin/lessons/videos/${lesson.id}`}>
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <DeleteVideoButton id={lesson.id} title={lesson.title} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {data.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    <PlayCircle className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="font-medium">Chưa có video nào.</p>
                    <p className="text-sm text-gray-400 mt-1">Bấm "Thêm video mới" để bắt đầu.</p>
                </div>
            )}
        </div>
    );
}
