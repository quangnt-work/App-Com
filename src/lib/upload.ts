// src/lib/upload.ts
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export const uploadFileToStorage = async (
  file: File, 
  bucket: string, 
  folder: string
): Promise<string | null> => {
  const supabase = createClient();
  
  // Tạo tên file duy nhất để tránh trùng
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    toast.error(`Upload thất bại: ${error.message}`);
    return null;
  }

  // Lấy Public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};