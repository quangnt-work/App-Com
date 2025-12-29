export function CurrentLevelCard() {
  return (
    <div className="bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-sky-200 mt-6">
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat" />
      <h3 className="text-xs opacity-90 uppercase tracking-wider mb-2 relative z-10">Trình độ hiện tại</h3>
      <div className="text-4xl font-extrabold mb-1 relative z-10">Intermediate</div>
      <div className="text-3xl font-bold mb-6 relative z-10">(B1)</div>

      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-sm font-medium">
          <span>Tiến độ lên hạng B2</span>
          <span>75%</span>
        </div>
        <div className="h-2.5 bg-sky-800/50 rounded-full overflow-hidden">
          <div className="h-full bg-white w-[75%] rounded-full"></div>
        </div>
        <p className="text-xs mt-3 flex items-center gap-1">
          ℹ️ Hoàn thành <strong>3 bài kiểm tra</strong> nữa để thăng hạng.
        </p>
      </div>
    </div>
  )
}