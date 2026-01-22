import { Button } from '../../ui/button'
import Image from 'next/image'

export function LessonHero() {
  return (
    <div className="bg-white border-b border-slate-100 py-12 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 bg-slate-50 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
           {/* Text Content */}
           <div className="flex-1 space-y-6 relative z-10">
             <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider">
               🔥 Bài học mới nhất
             </span>
             <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
               Nâng cao kỹ năng ngoại ngữ <br className="hidden lg:block"/> mỗi ngày
             </h1>
             <p className="text-slate-500 text-lg max-w-xl">
               Khám phá kho tàng bài học tiếng Anh và tiếng Nga chất lượng cao. Học mọi lúc, mọi nơi với lộ trình rõ ràng.
             </p>
             <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-8 shadow-lg shadow-sky-200">
               Bắt đầu học ngay
             </Button>
           </div>

           {/* Image Content */}
           <div className="flex-1 relative w-full h-64 md:h-96">
             {/* Bạn nhớ thay ảnh thật vào đây */}
             <Image 
               src="/hero-lesson.png" 
               alt="Learning Banner" 
               fill 
               className="object-cover rounded-2xl object-center md:object-right"
             />
           </div>
        </div>
      </div>
    </div>
  )
}