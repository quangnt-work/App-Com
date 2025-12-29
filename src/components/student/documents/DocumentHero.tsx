import { Search } from 'lucide-react'

export function DocumentHero() {
  return (
    <div className="bg-white border-b border-slate-100 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          Kho Tài Liệu Học Tập
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto mb-8">
          Truy cập hàng ngàn tài liệu, bài giảng và đề thi miễn phí giúp bạn chinh phục mọi kỳ thi.
        </p>

        {/* Search Bar Center */}
        <div className="relative max-w-xl mx-auto">
          <input 
            type="text" 
            placeholder="Tìm kiếm tài liệu, ebook, đề thi..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        </div>
      </div>
    </div>
  )
}