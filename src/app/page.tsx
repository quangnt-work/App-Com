import { Header } from '@/components/layout/Header'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Search, PlayCircle, Star, Users, CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main>
        {/* === HERO SECTION === */}
        <section className="container mx-auto px-4 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <Badge variant="secondary" className="bg-sky-100 text-sky-600 hover:bg-sky-100 px-4 py-1">
              🎓 Học trực tuyến
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Học tập không giới hạn cùng <span className="text-sky-500">E-Learning</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl">
              Nền tảng giáo dục trực tuyến hàng đầu với hàng ngàn bài giảng chất lượng từ các chuyên gia. Nâng cao kỹ năng mọi lúc, mọi nơi.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white px-8 rounded-lg shadow-lg shadow-sky-200">
                Bắt đầu ngay
              </Button>
              <Button variant="outline" size="lg" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                <PlayCircle className="mr-2 h-5 w-5" /> Tìm hiểu thêm
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-6">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" /> 
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center text-xs font-bold text-sky-600">+2k</div>
               </div>
               <p className="text-sm text-slate-600">Học viên đã tham gia</p>
            </div>
          </div>

          <div className="flex-1 relative">
             {/* Placeholder cho ảnh cô gái trong hình */}
             <div className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-tr from-sky-200 to-emerald-100 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Bạn sẽ thay thẻ Image thật vào đây */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">Image Placeholder</div>
                
                {/* Floating Card: Hoàn thành bài học */}
                <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Hoàn thành bài học</p>
                    <p className="text-xs text-slate-500">Chứng chỉ được cấp ngay</p>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* === FEATURES SECTION === */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-16">Chúng tôi cung cấp môi trường học tập tốt nhất, được thiết kế để giúp bạn phát triển kỹ năng nhanh chóng.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Lộ trình rõ ràng", desc: "Hệ thống bài giảng sắp xếp khoa học từ A-Z.", icon: "🗺️" },
                { title: "Giáo viên tận tâm", desc: "Đội ngũ giảng viên giàu kinh nghiệm hỗ trợ 24/7.", icon: "👨‍🏫" },
                { title: "Chứng chỉ uy tín", desc: "Cấp chứng chỉ có giá trị trên toàn quốc.", icon: "📜" }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-lg transition-shadow text-left">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}