export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side: Image/Banner (Ẩn trên mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 text-white flex-col justify-end p-12">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('/auth-bg.jpg')] bg-cover bg-center opacity-50" />
        
        <div className="relative z-20 space-y-4 max-w-lg">
          <div className="h-12 w-12 bg-sky-500 rounded-lg flex items-center justify-center mb-4">
             <span className="text-2xl">🎓</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight">Học mọi lúc, mọi nơi</h2>
          <p className="text-slate-300 text-lg">
            Tham gia cộng đồng học tập trực tuyến lớn nhất với hàng ngàn khóa học chất lượng cao.
          </p>
          {/* Testimonial avatars */}
          <div className="flex items-center gap-4 pt-4">
             <div className="flex -space-x-4">
                 {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-500 border-2 border-slate-900" />)}
             </div>
             <div className="flex gap-1 text-yellow-400">
               {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
}