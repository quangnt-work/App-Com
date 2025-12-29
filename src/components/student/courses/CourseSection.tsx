import Link from 'next/link'
import { CourseCard } from './CourseCard'
import { type Course } from '@/types/course'
import { Globe, Book, Monitor, Layout } from 'lucide-react'

interface CourseSectionProps {
  title: string;
  icon?: 'english' | 'russian' | 'it' | 'other';
  courses: Course[];
}

export function CourseSection({ title, icon, courses }: CourseSectionProps) {
  // === LOGIC QUAN TRỌNG: Nếu không có bài nào -> Không hiển thị gì ===
  if (!courses || courses.length === 0) {
    return null; 
  }

  return (
    <section className="container mx-auto px-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-8">
        <div className="flex items-center gap-3">
          {icon === 'english' && <Globe className="w-6 h-6 text-blue-500" />}
          {icon === 'russian' && <Book className="w-6 h-6 text-rose-500" />}
          {icon === 'it' && <Monitor className="w-6 h-6 text-purple-500" />}
          {icon === 'other' && <Layout className="w-6 h-6 text-slate-500" />}
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        <Link href="#" className="text-sm font-bold text-sky-500 hover:text-sky-600 hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  )
}