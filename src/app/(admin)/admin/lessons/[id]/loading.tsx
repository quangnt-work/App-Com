// app/(admin)/lessons/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"; // Giả sử bạn dùng Shadcn UI hoặc tự style


export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fake Header */}
      <div className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-4 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
         </div>
         <Skeleton className="h-9 w-24 rounded-md" />
      </div>


      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Fake Section 1 */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>


        {/* Fake Section 2 */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}