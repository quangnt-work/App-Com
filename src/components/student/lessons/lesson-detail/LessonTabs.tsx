"use client";

interface LessonTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function LessonTabs({ activeTab, onTabChange }: LessonTabsProps) {
  const tabs = [
    { id: "content", label: "Nội dung bài học" },
    { id: "documents", label: "Tài liệu đính kèm" },
    { id: "practice", label: "Bài tập thực hành" },
  ]; // Đã bỏ tab Hỏi đáp & Thảo luận

  return (
    <div className="border-b border-slate-200">
      <div className="flex gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}