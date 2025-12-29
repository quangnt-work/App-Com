export function DashboardHeader() {
  // Lấy ngày hiện tại format tiếng Việt
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tổng quan hệ thống</h1>
        <p className="text-slate-500">Chào mừng trở lại, đây là tình hình hoạt động hôm nay.</p>
      </div>
      <div className="flex items-center gap-4">
         <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 shadow-sm capitalize">
           📅 {today}
         </span>
      </div>
    </div>
  )
}