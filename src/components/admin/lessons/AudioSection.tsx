// src/components/admin/lessons/AudioSection.tsx
'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button';
import { Headphones, CloudUpload, Play, Trash2, Pause, Loader2 } from 'lucide-react';
import { uploadFileToStorage } from '@/lib/upload';

interface Props {
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
}

export default function AudioSection({ audioUrl, setAudioUrl }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadFileToStorage(file, 'course_materials', 'audios');
    if (url) {
      setAudioUrl(url);
      setIsPlaying(false);
    }
    setIsUploading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
           <Headphones className="w-5 h-5 text-sky-500" /> Tài liệu nghe (Audio)
        </h3>
        {audioUrl && <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded">Có Audio</span>}
      </div>

      <div className="space-y-6">
         {!audioUrl ? (
            <div 
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl py-8 text-center hover:border-sky-300 transition-colors bg-slate-50/50 cursor-pointer relative"
            >
                <input type="file" className="hidden" ref={inputRef} accept="audio/*" onChange={handleUpload} />
                
                {isUploading ? (
                   <Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-500" />
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-3">
                        <CloudUpload className="w-5 h-5 text-sky-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Tải lên file âm thanh</p>
                  </>
                )}
            </div>
         ) : (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center gap-4">
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                
                <button 
                    onClick={handlePlayPause}
                    className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition shadow-md shadow-sky-200 flex-shrink-0"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 mb-1 truncate">{audioUrl.split('/').pop()}</p>
                    <div className="h-1 bg-slate-200 rounded-full w-full">
                       {/* Mock progress bar simple */}
                       <div className={`h-full bg-sky-500 rounded-full ${isPlaying ? 'w-1/2 animate-pulse' : 'w-0'}`}></div>
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => { setAudioUrl(null); setIsPlaying(false); }}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
         )}
      </div>
    </div>
  );
}