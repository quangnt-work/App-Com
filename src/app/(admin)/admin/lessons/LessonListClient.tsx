// src/components/admin/lessons/LessonTableToolbar.tsx (Gợi ý tách ra)
'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // Cần cài: npm i use-debounce
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LessonTableToolbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Handle Search
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset về trang 1 khi search
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Handle Category Filter
  const handleCategoryChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (val && val !== 'ALL') {
      params.set('category', val);
    } else {
      params.delete('category');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-4 mb-6">
       <Input 
         placeholder="Tìm kiếm bài học..." 
         onChange={(e) => handleSearch(e.target.value)}
         defaultValue={searchParams.get('query')?.toString()}
         className="max-w-sm"
       />
       <Select onValueChange={handleCategoryChange} defaultValue={searchParams.get('category') || 'ALL'}>
         <SelectTrigger className="w-[180px]">
           <SelectValue placeholder="Danh mục" />
         </SelectTrigger>
         <SelectContent>
           <SelectItem value="ALL">Tất cả</SelectItem>
           <SelectItem value="TIẾNG ANH">Tiếng Anh</SelectItem>
           <SelectItem value="CNTT">CNTT</SelectItem>
           {/* Add more categories dynamically if needed */}
         </SelectContent>
       </Select>
    </div>
  )
}