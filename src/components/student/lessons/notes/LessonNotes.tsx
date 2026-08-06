"use client";

import React, { useRef, useState, useEffect } from "react";
import { PenTool, Keyboard, Eraser, Trash2, Minimize2, Maximize2 } from "lucide-react";

interface LessonNotesProps {
  isFullscreen: boolean;
  lessonId: string;
}

export function LessonNotes({ isFullscreen, lessonId }: LessonNotesProps) {
  const [mode, setMode] = useState<"type" | "draw">("type");
  const [textNote, setTextNote] = useState("");
  const [isExpanded, setIsExpanded] = useState(!isFullscreen);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Sync isExpanded with fullscreen state
  useEffect(() => {
    if (isFullscreen) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }, [isFullscreen]);

  // Load saved notes from local storage
  useEffect(() => {
    const savedText = localStorage.getItem(`notes_text_${lessonId}`);
    if (savedText) setTextNote(savedText);

    const savedDraw = localStorage.getItem(`notes_draw_${lessonId}`);
    if (savedDraw && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        if (ctx) ctx.drawImage(img, 0, 0);
      };
      img.src = savedDraw;
    }
  }, [lessonId]);

  // Save text note
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextNote(e.target.value);
    localStorage.setItem(`notes_text_${lessonId}`, e.target.value);
  };

  // Drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate scaling ratio since internal resolution (800x1000) might differ from CSS size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = ("touches" in e) ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = ("touches" in e) ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = ("touches" in e) ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = ("touches" in e) ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      localStorage.setItem(`notes_draw_${lessonId}`, canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.removeItem(`notes_draw_${lessonId}`);
      }
    }
  };

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#F28422";
      }
    }
  }, [isExpanded, mode]);

  if (!isExpanded && isFullscreen) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="absolute bottom-6 right-6 z-[100] bg-[#F28422] text-white p-4 rounded-full shadow-2xl hover:bg-[#d9731b] transition-all hover:scale-110 border-2 border-white"
        title="Mở ghi chú"
      >
        <PenTool size={24} />
      </button>
    );
  }

  return (
    <div className={`flex flex-col bg-white border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${isFullscreen ? 'absolute bottom-6 right-6 w-[400px] h-[500px] z-[100] shadow-2xl rounded-2xl' : 'w-full h-full rounded-3xl'}`}>
      
      {/* Header */}
      <div className="bg-[#5B4A82] text-white p-4 flex items-center justify-between">
        <h3 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
          <PenTool size={16} /> Ghi chú bài học
        </h3>
        <div className="flex gap-2">
          {isFullscreen && (
            <button onClick={() => setIsExpanded(false)} className="hover:text-orange-300 transition-colors bg-white/20 p-1 rounded-md">
              <Minimize2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex border-b border-gray-100 bg-gray-50 p-2 gap-2">
        <button
          onClick={() => setMode("type")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === "type" ? "bg-white text-[#5B4A82] shadow-sm" : "text-gray-500 hover:bg-gray-200"}`}
        >
          <Keyboard size={16} /> Bàn phím
        </button>
        <button
          onClick={() => setMode("draw")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === "draw" ? "bg-white text-[#F28422] shadow-sm" : "text-gray-500 hover:bg-gray-200"}`}
        >
          <PenTool size={16} /> Vẽ tay
        </button>
        {mode === "draw" && (
          <button onClick={clearCanvas} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Xóa bản vẽ">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white p-4">
        {/* Chế độ nhập text */}
        <textarea
          value={textNote}
          onChange={handleTextChange}
          placeholder="Nhập ghi chú của bạn vào đây..."
          className={`w-full h-full resize-none outline-none text-gray-700 leading-relaxed bg-transparent ${mode === 'type' ? 'block' : 'hidden'}`}
        />

        {/* Chế độ vẽ tay */}
        <div className={`w-full h-full border-2 border-dashed border-gray-100 rounded-xl relative overflow-hidden bg-[#fafafa] ${mode === 'draw' ? 'block' : 'hidden'}`}>
          <canvas
            ref={canvasRef}
            width={800} 
            height={1000}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute top-0 left-0 w-full h-full touch-none cursor-crosshair"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
