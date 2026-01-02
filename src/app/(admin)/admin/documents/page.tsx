// src/app/(admin)/admin/documents/page.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Folder, Cloud, CheckCircle, Upload, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/common/BackButton'
import { StatCard } from './components/StatCard'
import { DocumentFilters } from './components/DocumentFilters'
import { DocumentTable } from './components/DocumentTable'
import UploadDocumentModal from './components/UploadDocumentModal'
import { DocumentItem } from '@/types/document'
import { toast } from 'sonner'

// --- HELPER FUNCTIONS (Xử lý đơn vị dung lượng) ---

// 1. Chuyển đổi chuỗi (VD: "2.4 MB") thành số Bytes để tính tổng
const parseSizeToBytes = (sizeStr: string | null) => {
  if (!sizeStr) return 0;
  const units: { [key: string]: number } = { 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 };
  const match = sizeStr.match(/([\d.]+)\s*(KB|MB|GB)/i);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  return value * (units[unit] || 0);
};

// 2. Format số Bytes ngược lại thành chuỗi hiển thị (GB, MB)
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 GB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function DocumentsManagementPage() {
  const supabase = createClient()
  
  // --- STATE ---
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // --- FETCH DATA ---
  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const { data: rawDocs, error } = await supabase
        .from('documents')
        .select(`
          *,
          profiles:uploaded_by(full_name),
          courses:course_id(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map dữ liệu từ Supabase sang Type UI chuẩn
      const mappedDocs: DocumentItem[] = (rawDocs || []).map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        file_url: doc.file_url,
        file_type: doc.file_type,
        file_size: doc.file_size || '0 KB',
        created_at: new Date(doc.created_at).toLocaleDateString('vi-VN', { 
            year: 'numeric', month: '2-digit', day: '2-digit' 
        }),
        original_date: new Date(doc.created_at), // Giữ date gốc để tính toán
        uploader_name: doc.profiles?.full_name || 'Admin',
        course_name: doc.courses?.title || 'Chung'
      }));

      setDocuments(mappedDocs)
    } catch (error: any) {
      console.error("Fetch error:", error)
      toast.error("Không thể tải danh sách tài liệu")
    } finally {
      setIsLoading(false)
    }
  }

  // Load dữ liệu khi vào trang
  useEffect(() => {
    fetchDocuments()
  }, [])

  // --- STATS CALCULATION (Sử dụng useMemo để tối ưu hiệu năng) ---
  const stats = useMemo(() => {
    // 1. Tổng số file
    const totalDocs = documents.length;

    // 2. Tổng dung lượng
    const totalBytes = documents.reduce((acc, doc) => acc + parseSizeToBytes(doc.file_size), 0);
    const totalStorageDisplay = formatBytes(totalBytes);
    
    // Giả định Quota là 5GB (Bạn có thể lấy số này từ DB config nếu có)
    const STORAGE_QUOTA = 5 * 1024 * 1024 * 1024; 
    const storagePercentage = Math.min((totalBytes / STORAGE_QUOTA) * 100, 100);

    // 3. File mới trong tháng này
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Lưu ý: Cần dùng object date gốc (original_date) để so sánh chính xác
    const newDocsCount = documents.filter((doc: any) => {
      const docDate = doc.original_date;
      return docDate && docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear;
    }).length;

    return { totalDocs, totalStorageDisplay, storagePercentage, newDocsCount };
  }, [documents]);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8 font-sans text-slate-900">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <BackButton />
             <span className="text-slate-300">/</span>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quản lý tài liệu</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Thư viện tài liệu</h1>
          <p className="text-slate-500 mt-1 max-w-2xl text-sm">
            Quản lý tập trung tất cả tài liệu học tập, bài giảng và tài nguyên.
          </p>
        </div>
        
        <Button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-500/20 transition-all hover:scale-105"
        >
          <Upload className="w-4 h-4 mr-2" /> Tải lên tài liệu mới
        </Button>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={Folder} 
          iconColor="text-blue-600" 
          iconBg="bg-blue-50"
          label="Tổng số tài liệu"
          value={stats.totalDocs.toLocaleString()}
          subValue={<span className="text-emerald-500 font-bold text-xs">Dữ liệu thực tế</span>}
        />
        
        <StatCard 
          icon={Cloud} 
          iconColor="text-orange-600" 
          iconBg="bg-orange-50"
          label="Dung lượng sử dụng"
          value={stats.totalStorageDisplay}
          progress={stats.storagePercentage}
        />
        
        <StatCard 
          icon={CheckCircle} 
          iconColor="text-emerald-600" 
          iconBg="bg-emerald-50"
          label="Tài liệu mới (tháng này)"
          value={stats.newDocsCount.toString()}
          subValue={<span className="text-slate-400 text-xs">Cập nhật realtime</span>}
        />
      </div>

      {/* 3. MAIN CONTENT (Filter & Table) */}
      <div className="space-y-6">
        <DocumentFilters />
        
        {isLoading ? (
          // Skeleton Loading UI
          <div className="bg-white rounded-xl border border-slate-100 p-12 flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Đang đồng bộ dữ liệu...</p>
          </div>
        ) : (
          <DocumentTable documents={documents} />
        )}
      </div>

      {/* 4. MODAL UPLOAD */}
      <UploadDocumentModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchDocuments} // Gọi lại hàm fetch để refresh list sau khi upload
      />

    </div>
  )
}