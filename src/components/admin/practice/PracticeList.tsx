'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PracticeSet } from '@/types/practice-admin'
import { deletePracticeSet } from '@/lib/actions/practice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, Plus, ChevronLeft, ChevronRight, FilterX, 
  Eye, Edit, Trash2 // Import các icon cần thiết
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface PracticeListProps {
  initialData: PracticeSet[];
}

const ITEMS_PER_PAGE = 10;

export function PracticeList({ initialData }: PracticeListProps) {
    const router = useRouter(); 
    const [data, setData] = useState<PracticeSet[]>(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const [search, setSearch] = useState('');
    const [skillFilter, setSkillFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);

  // --- FILTERING ---
    const filteredData = data.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchSkill = skillFilter === 'all' || item.skill === skillFilter;
        return matchSearch && matchSkill;
    });

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- HANDLERS ---
    const handleDelete = async (id: string) => {
        if(!confirm('Bạn có chắc chắn muốn xóa bộ đề này? Hành động này không thể hoàn tác.')) return;

        setIsDeleting(true);
        try {
        // Gọi Server Action
            const result = await deletePracticeSet(id);
        
            if (result.success) {
                toast.success('Đã xóa bộ đề thành công');
                // Optimistic Update: Xóa ngay trên UI cho mượt
                setData(prev => prev.filter(item => item.id !== id));
            } else {
            toast.error('Có lỗi xảy ra khi xóa');
            }
        } catch (error) {
            toast.error('Lỗi kết nối');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/practice/${id}/edit`);
    };

    const handleView = (id: string) => {
        // router.push(`/admin/practice/${id}`);
        toast.info("Tính năng xem chi tiết đang phát triển");
    };    

  // Helper: Màu sắc cho Badge Kỹ năng
  const getSkillBadge = (skill: string) => {
    const styles: Record<string, string> = {
      reading: 'bg-blue-100 text-blue-700 border-blue-200',
      listening: 'bg-purple-100 text-purple-700 border-purple-200',
      writing: 'bg-orange-100 text-orange-700 border-orange-200',
      speaking: 'bg-pink-100 text-pink-700 border-pink-200',
      grammar: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      vocabulary: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
        <Badge variant="outline" className={`${styles[skill] || styles.vocabulary} font-bold px-2.5 py-0.5 uppercase text-[10px] border`}>
            {skill}
        </Badge>
    );
  };

  // Helper: Màu sắc cho Badge Trạng thái
  const getStatusBadge = (isPublished: boolean) => {
      return isPublished 
        ? <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 border">Công khai</Badge>
        : <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-slate-200 border">Bản nháp</Badge>;
  };

  return (
    <div className="space-y-4">
      
      {/* 1. TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
         <div className="flex flex-1 gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Tìm kiếm bộ đề..." 
                    className="pl-9 h-10"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
            </div>
            
            <Select value={skillFilter} onValueChange={(v) => { setSkillFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Lọc theo kỹ năng" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả kỹ năng</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                </SelectContent>
            </Select>

            {(search || skillFilter !== 'all') && (
                <Button variant="ghost" size="icon" onClick={() => { setSearch(''); setSkillFilter('all'); }} title="Xóa bộ lọc">
                    <FilterX className="w-4 h-4 text-slate-500" />
                </Button>
            )}
         </div>

         <Link href="/admin/practice/create">
            <Button className="w-full md:w-auto bg-sky-600 hover:bg-sky-700 text-white shadow-sm h-10">
                <Plus className="w-4 h-4 mr-2" /> Tạo bộ đề mới
            </Button>
         </Link>
      </div>

      {/* 2. TABLE DATA */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
            <TableHeader className="bg-slate-50/50">
                <TableRow>
                    <TableHead className="w-[50px] text-center">#</TableHead>
                    <TableHead className="min-w-[300px]">Thông tin bộ đề</TableHead>
                    <TableHead>Kỹ năng</TableHead>
                    <TableHead>Trình độ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right pr-6">Hành động</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {currentItems.length > 0 ? (
                    currentItems.map((item, idx) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="text-center font-medium text-slate-500">
                                {startIndex + idx + 1}
                            </TableCell>
                            
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                                        {item.thumbnail_url ? (
                                            <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg">📝</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="font-semibold text-slate-900 line-clamp-1 text-sm">{item.title}</div>
                                        <div className="text-xs text-slate-500">{item.total_questions} câu hỏi</div>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>{getSkillBadge(item.skill)}</TableCell>

                            <TableCell>
                                <Badge variant="outline" className="font-medium border-slate-300 text-slate-600 bg-white px-2">
                                    {item.level}
                                </Badge>
                            </TableCell>

                            <TableCell>{getStatusBadge(item.is_published)}</TableCell>

                            <TableCell className="text-sm text-slate-500">
                                {new Date(item.created_at).toLocaleDateString('vi-VN')}
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button 
                                        variant="ghost" size="icon" 
                                        onClick={() => handleView(item.id)}
                                        className="h-8 w-8 text-slate-500 hover:text-sky-600 hover:bg-sky-50"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    
                                    <Button 
                                        variant="ghost" size="icon" 
                                        onClick={() => handleEdit(item.id)}
                                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>

                                    <Button 
                                        variant="ghost" size="icon" 
                                        disabled={isDeleting}
                                        onClick={() => handleDelete(item.id)}
                                        className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                            Không có dữ liệu. Hãy tạo bộ đề mới!
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </div>

      {/* 3. PAGINATION */}
      {filteredData.length > 10 && (
        <div className="flex items-center justify-between pt-2 px-1">
            <div className="text-sm text-slate-500">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} trong {filteredData.length} kết quả
            </div>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="h-8 w-8 p-0"
                >
                    <ChevronLeft className="w-4 h-4"/>
                </Button>
                
                <div className="flex items-center gap-1">
                     {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                        const page = i + 1;
                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-sky-600 border-sky-600' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        )
                     })}
                </div>

                <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="h-8 w-8 p-0"
                >
                    <ChevronRight className="w-4 h-4"/>
                </Button>
            </div>
        </div>
      )}
    </div>
  )
}