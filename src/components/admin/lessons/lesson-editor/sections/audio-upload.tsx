// components/lessons/sections/audio-upload.tsx
import { Headphones, Upload, Trash2, Play, Music } from 'lucide-react';
import { useRef, useState } from 'react';
import FileDropzone from '../shared/file-dropzone';

interface AudioUploadProps {
  audioUrl: string | null;
  onChange: (url: string | null) => void;
}

export default function AudioUpload({ audioUrl, onChange }: AudioUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State giả lập tên file để hiển thị cho đẹp (Trong thực tế bạn lấy từ response upload)
  const [fileName, setFileName] = useState<string>("audio_lesson_final.mp3");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Logic Upload lên Server/Supabase Storage sẽ nằm ở đây
      // 2. Tạo URL tạm thời để preview ngay lập tức
      const objectUrl = URL.createObjectURL(file);
      setFileName(file.name);
      onChange(objectUrl);
    }
  };

  const handleDelete = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-lg text-gray-800">Tài liệu nghe (Audio)</h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Tải lên file âm thanh cho phần luyện nghe. Hỗ trợ định dạng MP3, WAV.
        </p>

        {!audioUrl ? (
          // --- EMPTY STATE: Chưa có file ---
          <FileDropzone
              accept="audio/*"
              label="Tải lên Audio"
              helperText="Hỗ trợ MP3, WAV"
              maxSizeMB={20}
              onFileSelect={(file) => {
                // Logic upload file ở đây
                const url = URL.createObjectURL(file); 
                onChange(url);
              }}
            />
        ) : (
          // --- FILLED STATE: Đã có file ---
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* File Info */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate max-w-[200px]">{fileName}</p>
                  <p className="text-xs text-blue-600 font-medium">Đã tải lên thành công</p>
                </div>
              </div>

              {/* Player & Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* HTML5 Audio Player Styling */}
                <audio controls className="h-8 w-full sm:w-48 max-w-[200px]">
                  <source src={audioUrl} type="audio/mpeg" />
                  Trình duyệt không hỗ trợ nghe.
                </audio>

                <div className="w-px h-8 bg-gray-300 mx-2 hidden sm:block"></div>

                <button 
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa file audio"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}