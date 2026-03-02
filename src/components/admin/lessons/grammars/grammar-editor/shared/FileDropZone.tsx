// components/lessons/shared/file-dropzone.tsx
'use client';


import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';


interface FileDropzoneProps {
  accept?: string; // Ví dụ: ".pdf,.docx" hoặc "image/*"
  maxSizeMB?: number; // Ví dụ: 10 (MB)
  label?: string;
  helperText?: string;
  onFileSelect: (file: File) => void;
  className?: string;
}


export default function FileDropZone({
  accept = '*',
  maxSizeMB = 50,
  label = 'Tải lên tập tin',
  helperText = 'Kéo thả hoặc nhấn để chọn file',
  onFileSelect,
  className
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Xử lý khi user chọn file qua dialog
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
  };


  // Các sự kiện Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };


  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);


    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  };


  // Hàm validate kích thước file
  const validateAndSelect = (file: File) => {
    setError(null);
    const fileSizeMB = file.size / 1024 / 1024;
   
    if (fileSizeMB > maxSizeMB) {
      setError(`File quá lớn (${fileSizeMB.toFixed(1)}MB). Tối đa ${maxSizeMB}MB.`);
      return;
    }


    onFileSelect(file);
    // Reset input để cho phép chọn lại cùng 1 file nếu cần
    if (inputRef.current) inputRef.current.value = '';
  };


  return (
    <div className={cn("w-full", className)}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group",
          // Style thay đổi theo trạng thái Drag/Error
          error ? "border-red-300 bg-red-50" :
          isDragActive
            ? "border-blue-500 bg-blue-50 scale-[0.99]"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
        />


        {/* Icon */}
        <div className={cn(
          "p-3 rounded-full mb-3 transition-transform duration-200 group-hover:scale-110",
          error ? "bg-red-100" : "bg-blue-100"
        )}>
          {error ? (
            <X className="w-6 h-6 text-red-600" />
          ) : (
            <Upload className="w-6 h-6 text-blue-600" />
          )}
        </div>


        {/* Text nội dung */}
        <h4 className={cn("font-semibold", error ? "text-red-700" : "text-gray-700")}>
          {error ? 'Lỗi tải lên' : label}
        </h4>
       
        <p className={cn("text-xs mt-1", error ? "text-red-500" : "text-gray-500")}>
          {error || `${helperText} (Tối đa ${maxSizeMB}MB)`}
        </p>
      </div>
    </div>
  );
}