'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
    src: string;
    title?: string;
}

const PLAYBACK_RATES = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x (Chuẩn)', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2 },
];

function formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const rateMenuRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showRateMenu, setShowRateMenu] = useState(false);

    // Sync audio state on mount
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
        audio.playbackRate = playbackRate;
    }, []);

    // Đóng menu tốc độ khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rateMenuRef.current && !rateMenuRef.current.contains(event.target as Node)) {
                setShowRateMenu(false);
            }
        };

        if (showRateMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRateMenu]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleTimeUpdate = useCallback(() => {
        setCurrentTime(audioRef.current?.currentTime ?? 0);
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        setDuration(audioRef.current?.duration ?? 0);
    }, []);

    const handleEnded = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
    }, []);

    const handleProgressClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const audio = audioRef.current;
            if (!audio || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            audio.currentTime = ratio * duration;
        },
        [duration]
    );

    const handleVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = Number(e.target.value);
            setVolume(val);
            if (audioRef.current) audioRef.current.volume = val;
            setIsMuted(val === 0);
        },
        []
    );

    const toggleMute = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const newMuted = !isMuted;
        audio.muted = newMuted;
        setIsMuted(newMuted);
    }, [isMuted]);

    const handleRateChange = useCallback((rate: number) => {
        if (audioRef.current) audioRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        setShowRateMenu(false);
    }, []);

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const currentRateLabel =
        PLAYBACK_RATES.find((r) => r.value === playbackRate)?.label ?? '1x (Chuẩn)';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                preload="metadata"
            />

            {/* Row 1: Play button + Progress */}
            <div className="flex items-center gap-4">
                {/* Play / Pause */}
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-[#f07b32] text-white flex items-center justify-center shrink-0 hover:bg-[#e06c25] transition-colors shadow-md shadow-orange-200"
                    aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
                >
                    {isPlaying ? <Pause className="w-5 h-5" fill="white" /> : <Play className="w-5 h-5 ml-0.5" fill="white" />}
                </button>

                {/* Progress bar */}
                <div className="flex-1">
                    <div
                        className="h-2 bg-gray-200 rounded-full cursor-pointer relative group"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-2 bg-[#f07b32] rounded-full transition-all relative"
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Thumb */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#f07b32] border-2 border-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    {/* Times */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1.5 font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            {/* Row 2: Volume + Playback rate */}
            <div className="flex items-center justify-between mt-4">
                {/* Volume */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleMute} 
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={isMuted || volume === 0 ? "Bật âm thanh" : "Tắt âm thanh"}
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1.5 accent-[#f07b32] cursor-pointer"
                        aria-label="Âm lượng"
                    />
                </div>

                {/* Playback rate */}
                <div className="relative" ref={rateMenuRef}>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-xs text-gray-500">Tốc độ phát:</span>
                        <button
                            onClick={() => setShowRateMenu((v) => !v)}
                            className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium hover:border-[#f07b32] hover:text-[#f07b32] transition-colors bg-white"
                            aria-label="Mở menu chọn tốc độ phát"
                            aria-expanded={showRateMenu}
                        >
                            {currentRateLabel}
                            <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {showRateMenu && (
                        <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[130px] overflow-hidden">
                            {PLAYBACK_RATES.map((r) => (
                                <button
                                    key={r.value}
                                    onClick={() => handleRateChange(r.value)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-[#f07b32] transition-colors ${r.value === playbackRate ? 'text-[#f07b32] font-semibold bg-orange-50' : 'text-gray-700'
                                        }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
