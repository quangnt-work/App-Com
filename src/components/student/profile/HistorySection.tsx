import { Card } from '../../ui/card'
import Link from 'next/link'

// 1. Định nghĩa kiểu dữ liệu cho từng Item
interface HistoryItemProps {
  title: string;
  date: string;
  score?: string; // Dấu ? nghĩa là có thể không có điểm (null/undefined)
  status: string;
  statusColor: string;
}

export function HistorySection() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Test History */}
      <Card className="p-6 bg-white shadow-sm border-slate-200 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
            📚 Lịch sử bài thi
          </h3>
          <Link href="#" className="text-sky-500 text-sm font-medium hover:underline">Xem tất cả</Link>
        </div>
        <div className="space-y-5">
          <HistoryItem 
            title="Kiểm tra giữa kỳ - Unit 5" 
            date="20/11/2023" 
            status="Chờ chấm" 
            statusColor="bg-yellow-100 text-yellow-700" 
          />
          <HistoryItem 
            title="Speaking Test - Part 1" 
            date="15/11/2023" 
            score="7.5" 
            status="Đã chấm chéo" 
            statusColor="bg-indigo-100 text-indigo-700" 
          />
          <HistoryItem 
            title="Reading Practice - Test 03" 
            date="10/11/2023" 
            score="8.5" 
            status="Đã chấm" 
            statusColor="bg-green-100 text-green-700" 
          />
        </div>
      </Card>

      {/* Practice History */}
      <Card className="p-6 bg-white shadow-sm border-slate-200 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
            📝 Bài luyện tập
          </h3>
          <Link href="#" className="text-sky-500 text-sm font-medium hover:underline">Xem tất cả</Link>
        </div>
        <div className="space-y-5">
          <HistoryItem 
            title="Daily Conversation" 
            date="Hôm nay, 10:30" 
            status="Chờ nhận xét" 
            statusColor="bg-orange-100 text-orange-600" 
          />
          <HistoryItem 
            title="Vocabulary: Environment" 
            date="18/11/2023" 
            status="Đã nhận xét" 
            statusColor="bg-emerald-100 text-emerald-600" 
          />
          <HistoryItem 
            title="Grammar: Past Perfect" 
            date="12/11/2023" 
            status="Đã nhận xét" 
            statusColor="bg-emerald-100 text-emerald-600" 
          />
        </div>
      </Card>
    </div>
  )
}

// 2. Sử dụng Interface thay vì 'any'
function HistoryItem({ title, date, score, status, statusColor }: HistoryItemProps) {
  return (
    <div className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <div>
        <p className="font-bold text-sm text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{date}</p>
      </div>
      <div className="text-right">
        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${statusColor}`}>
          {status}
        </span>
        {/* Chỉ hiển thị điểm nếu có props score */}
        {score && <p className="font-extrabold text-lg text-slate-900 mt-1">{score}</p>}
      </div>
    </div>
  )
}