import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, BookOpen, Star } from 'lucide-react'
import { type Course } from '@/types/course'

export function CourseCard({ course }: { course: Course }) {
  const getBadgeColor = (category: string) => {
    if (category === 'TIẾNG ANH') return 'bg-blue-100 text-blue-600';
    if (category === 'TIẾNG NGA') return 'bg-rose-100 text-rose-600';
    if (category === 'CNTT') return 'bg-purple-100 text-purple-600';
    return 'bg-slate-100 text-slate-600';
  }

  return (
    <Card className="group overflow-hidden border-slate-200 bg-white hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col h-full">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
        {/* Xử lý ảnh fallback nếu không có thumbnail */}
        <Image 
          src={course.thumbnail || '/placeholder-course.jpg'} 
          alt={course.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex gap-2">
           <Badge className="bg-black/60 text-white border-none flex items-center gap-1 text-[10px] px-2">
             <Clock className="w-3 h-3" /> {course.duration}
           </Badge>
           <Badge className="bg-black/60 text-white border-none flex items-center gap-1 text-[10px] px-2">
             <BookOpen className="w-3 h-3" /> {course.lessons_count} bài
           </Badge>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-3">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide ${getBadgeColor(course.category)}`}>
            {course.category}
          </span>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <span>{course.rating}</span>
            <Star className="w-3 h-3 fill-current" />
          </div>
        </div>

        <Link href={`/student/courses/${course.id}`} className="block flex-1">
          <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 group-hover:text-sky-500 transition-colors">
            {course.title}
          </h3>
        </Link>

        <div className="h-px w-full bg-slate-100 my-4" />

        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-100 bg-slate-100">
            {course.instructor_avatar ? (
                <Image src={course.instructor_avatar} alt="Ins" fill className="object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">GV</div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Giảng viên</span>
            <span className="text-xs font-bold text-slate-700">{course.instructor_name}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}