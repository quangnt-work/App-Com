import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CourseEditForm from './CourseEditForm'
import { Course, Lesson } from '@/types/course'

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const supabase = await createClient()

  // 1. Fetch Course + Lessons trực tiếp + Attachments
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      attachments:course_attachments(*),
      lessons(*) 
    `)
    .eq('id', courseId)
    .single()

  if (error || !data) {
    console.error("Error fetching course:", error)
    return notFound()
  }

  // 2. Ép kiểu an toàn
  // Do Supabase trả về JSON, ta cần khẳng định kiểu
  const courseData = data as unknown as Course;

  // 3. Sắp xếp bài học theo thứ tự (order_index hoặc created_at)
  const sortedLessons = courseData.lessons 
    ? [...courseData.lessons].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    : [];

  const formattedCourse: Course = {
    ...courseData,
    level: courseData.level || 'basic',
    lessons: sortedLessons
  }

  return <CourseEditForm course={formattedCourse} />
}