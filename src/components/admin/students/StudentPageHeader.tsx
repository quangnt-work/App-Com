// src/components/admin/students/StudentPageHeader.tsx
import { Users, Settings } from "lucide-react";

export function StudentPageHeader() {
  return (
    <div className="bg-[#f97316] rounded-2xl p-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-md">
      <div className="flex items-center gap-4">
        <Users size={40} className="opacity-90" />
        <h1 className="text-3xl font-bold tracking-wide">QUẢN LÝ HỌC VIÊN</h1>
      </div>
      <div className="flex items-center gap-2 mt-4 md:mt-0 text-orange-100">
        <span>Trang quản trị học viên</span>
        <Settings size={20} className="animate-spin-slow" />
      </div>
    </div>
  );
}
