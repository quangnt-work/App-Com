'use client';

import { PlayCircle } from 'lucide-react';
import { useMemo } from 'react';

interface VideoPlayerProps {
    src: string;
    title?: string;
    thumbnail?: string;
}

export function VideoPlayer({ src, title, thumbnail }: VideoPlayerProps) {
    // Hàm lấy ID Youtube từ URL
    const youtubeId = useMemo(() => {
        if (!src) return null;
        const match = src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        return match ? match[1] : null;
    }, [src]);

    return (
        <div className="w-full bg-[#0f172a] rounded-xl overflow-hidden shadow-md relative aspect-video flex items-center justify-center">
            {youtubeId ? (
                <iframe
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&showinfo=0&autoplay=0`}
                    title={title ?? 'Trình phát video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : src ? (
                <video
                    className="w-full h-full absolute inset-0"
                    src={src}
                    poster={thumbnail ?? undefined}
                    controls
                    controlsList="nodownload"
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                    <PlayCircle className="w-12 h-12 opacity-50" />
                    <p className="font-medium">Chưa có đường dẫn video</p>
                </div>
            )}
        </div>
    );
}
