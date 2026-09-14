import { RussianLoader } from "@/components/common/RussianLoader";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50/90 backdrop-blur-sm">
      <RussianLoader size="lg" message="Đang tải dữ liệu..." subMessage="Загрузка..." />
    </div>
  );
}