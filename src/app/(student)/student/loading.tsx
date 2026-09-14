import { RussianLoader } from "@/components/common/RussianLoader";

export default function Loading() {
  return (
    <div className="w-full flex-1 flex items-center justify-center min-h-[60vh]">
      <RussianLoader size="lg" message="Đang tải bài học..." subMessage="Загрузка материалов..." />
    </div>
  );
}

