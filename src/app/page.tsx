// src/app/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { BookOpen, Bot, FileText, ClipboardCheck } from "lucide-react";

// Component con cho từng thẻ chức năng
interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  buttonLabel: string;
}

const FeatureBox = ({ icon, title, href, buttonLabel }: FeatureBoxProps) => (
  <div className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h2 className="text-xl font-extrabold text-slate-800 mb-8 uppercase tracking-tight">
      {title}
    </h2>
    <Link 
      href={href}
      className="w-full bg-[#f4a261] hover:bg-[#e76f51] text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-100 uppercase tracking-widest text-sm"
    >
      {buttonLabel}
    </Link>
  </div>
);

export default function HomePage() {
  // Giả sử lấy từ session (Trong Next.js 15 bạn có thể dùng cookies() hoặc headers() tại đây)
  const mockUser = null; 

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfe]">
      <Header user={mockUser} />

      <main className="flex-grow container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureBox 
            icon={<BookOpen size={40} />} 
            title="Bài học" 
            href="/lesson" 
            buttonLabel="Khám phá" 
          />
          <FeatureBox 
            icon={<Bot size={40} />} 
            title="Luyện tập cùng AI" 
            href="/ai" 
            buttonLabel="Bắt đầu" 
          />
          <FeatureBox 
            icon={<ClipboardCheck size={40} />} 
            title="Kiểm tra" 
            href="/exams" 
            buttonLabel="Vào thi" 
          />
          <FeatureBox 
            icon={<FileText size={40} />} 
            title="Tài liệu" 
            href="/documents" 
            buttonLabel="Tải xuống" 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}