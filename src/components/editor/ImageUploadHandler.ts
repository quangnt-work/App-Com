// src/components/editor/ImageUploadHandler.ts
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client'; // Client-side supabase

export const handleImageUpload = async (file: File): Promise<string> => {
  const supabase = createClient();

  // 1. Cấu hình nén ảnh
  const options = {
    maxSizeMB: 1,          // Giới hạn dung lượng tối đa 1MB
    maxWidthOrHeight: 1920, // Resize nếu ảnh quá to
    useWebWorker: true,
  };

  try {
    // 2. Nén ảnh
    const compressedFile = await imageCompression(file, options);

    // 3. Upload ảnh đã nén lên Supabase
    const fileName = `${Date.now()}-${compressedFile.name}`;
    const { data, error } = await supabase.storage
      .from('course-assets') // Tên bucket của bạn
      .upload(fileName, compressedFile);

    if (error) throw error;

    // 4. Lấy Public URL để hiển thị trong Editor
    const { data: { publicUrl } } = supabase.storage
      .from('course-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};