import { useState, useMemo, useCallback, useEffect } from 'react';
import { User } from '@/types/user';
// Import Server Action (Đảm bảo đường dẫn đúng với file actions.ts ở trên)
import { deleteUser } from '@/app/(admin)/admin/users/action'; 
import { toast } from 'sonner';

export function useUserManagement(initialUsers: User[]) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tất cả vai trò');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      const matchRole = roleFilter === 'Tất cả vai trò' || user.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredUsers.map((u) => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [filteredUsers]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    setIsDeleting(true);
    try {
      const result = await deleteUser(id); // Gọi Server Action
      if (result.success) {
        toast.success('Đã xóa người dùng thành công!');
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setSelectedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        toast.error(result.message || 'Lỗi khi xóa.');
      }
    } catch (err) {
      toast.error('Lỗi kết nối.');
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    users: filteredUsers,
    searchTerm, roleFilter, selectedIds, isDeleting,
    setSearchTerm, setRoleFilter,
    handleDelete, handleSelectAll, handleSelectOne
  };
}