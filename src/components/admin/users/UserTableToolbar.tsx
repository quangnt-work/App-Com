// src/components/admin/users/UserTableToolbar.tsx
'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; 
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UserTableToolbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Xử lý tìm kiếm (Debounce 300ms để tránh spam request)
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

  // Xử lý lọc Role
  const handleRoleChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (val && val !== 'ALL') {
      params.set('role', val);
    } else {
      params.delete('role');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
      <div className="flex gap-4 w-full sm:w-auto">
        <Input
          placeholder="Tìm tên, email, username..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
          className="w-full sm:w-[300px]"
        />
        <Select onValueChange={handleRoleChange} defaultValue={searchParams.get('role') || 'ALL'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả vai trò</SelectItem>
            <SelectItem value="student">Học viên</SelectItem>
            <SelectItem value="admin">Quản trị viên</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}