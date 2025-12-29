import { Button } from '@/components/ui/button'
import { PlayCircle, History } from 'lucide-react'

export function ExamHero() {
  return (
    <div className="relative bg-slate-900 py-16 mb-10 overflow-hidden rounded-b-[3rem]">
      {/* Background Overlay & Image */}
      <div className="absolute inset-0 opacity-20 bg-[url('/hero-exam-bg.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Thử Thách Bản Thân
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 font-light">
          Hệ thống bài kiểm tra đa dạng giúp bạn đánh giá năng lực và chuẩn bị tốt nhất cho các kỳ thi quan trọng.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-sky-500/30">
            <PlayCircle className="mr-2 h-5 w-5" /> Kiểm tra ngay
          </Button>
          <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full px-8 h-12 text-base bg-transparent/20 backdrop-blur-sm">
            <History className="mr-2 h-5 w-5" /> Lịch sử thi
          </Button>
        </div>
      </div>
    </div>
  )
}