"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; 
import { toast } from "sonner";
import { DbCourse, DbLesson } from "@/types"; // Import type chuẩn

interface CourseEditorProps {
  initialCourse?: DbCourse | null;
  initialLesson?: DbLesson | null;
}

export default function CourseEditor({ initialCourse, initialLesson }: CourseEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // State quản lý form
  const [formData, setFormData] = useState({
    // Course Fields
    title: initialCourse?.title || "",
    description: initialCourse?.description || "",
    category: initialCourse?.category || "TIENG_ANH",
    thumbnail: initialCourse?.thumbnail || "", // Mapping đúng cột 'thumbnail' trong DB
    
    // Lesson Fields (Logic 1-1)
    videoUrl: initialLesson?.video_url || "",
    content: initialLesson?.content || "",
  });

  const handleSave = async () => {
    if (!formData.title) return toast.error("Vui lòng nhập tên khóa học");

    try {
      setLoading(true);
      
      // 1. Prepare Course Data (Type Safe Insert/Update)
      const courseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        thumbnail: formData.thumbnail,
        // Nếu edit thì giữ ID, nếu tạo mới thì để undefined (DB tự sinh)
        ...(initialCourse?.id ? { id: initialCourse.id, updated_at: new Date().toISOString() } : {}), 
      };

      // Upsert Course
      const { data: savedCourse, error: courseError } = await supabase
        .from('courses')
        .upsert(courseData as any) // Cast any tạm để bypass strict check của upsert id optional
        .select()
        .single();

      if (courseError) throw courseError;
      
      const courseId = savedCourse.id;

      // 2. Prepare Lesson Data
      // Logic: Tìm lesson theo course_id. 
      const lessonData = {
        course_id: courseId,
        title: formData.title, // Tên bài học giống tên khóa học
        video_url: formData.videoUrl,
        content: formData.content,
        // Nếu đã có lesson cũ thì dùng ID cũ để update, nếu không thì tạo mới
        ...(initialLesson?.id ? { id: initialLesson.id } : {})
      };

      // Upsert Lesson (Yêu cầu DB: unique constraint on course_id hoặc dùng ID)
      const { error: lessonError } = await supabase
        .from('lessons')
        .upsert(lessonData as any)
        .select();

      if (lessonError) throw lessonError;

      toast.success("Lưu thành công!");
      router.push("/admin/courses");
      router.refresh();

    } catch (error: any) {
      console.error(error);
      toast.error("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <h2 className="text-xl font-bold border-b pb-2">
        {initialCourse ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
      </h2>

      {/* Form Fields */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên khóa học</label>
          <input 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea 
            rows={3}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
           <label className="block text-sm font-medium mb-1">Link Thumbnail</label>
           <input 
            className="w-full border p-2 rounded"
            value={formData.thumbnail}
            onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
            placeholder="https://..."
          />
        </div>

        {/* Lesson Section */}
        <div className="pt-4 border-t mt-4 bg-gray-50 p-4 rounded">
          <h3 className="text-md font-bold mb-3 text-blue-700">Nội dung bài giảng (Video/Content)</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Video URL (Youtube/Drive)</label>
            <input 
              className="w-full border p-2 rounded"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nội dung chi tiết (HTML/Text)</label>
            <textarea 
              rows={6}
              className="w-full border p-2 rounded"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          Hủy
        </button>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Đang lưu..." : "Lưu tất cả"}
        </button>
      </div>
    </div>
  );
}