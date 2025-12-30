import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-sm text-slate-500 font-medium">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}