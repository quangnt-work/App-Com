import { createClient } from '@/lib/supabase/server'
import { DocumentHero } from '@/components/student/documents/DocumentHero'
import { DocumentFilter } from '@/components/student/documents/DocumentFilter'
import { DocumentList } from '@/components/student/documents/DocumentList'
import { Pagination } from '@/components/student/documents/Pagination'
import { Inbox } from 'lucide-react'

export default async function DocumentsPage() {
  const supabase = await createClient()

  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  const docs = documents || []
  const isEmpty = docs.length === 0

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <DocumentHero />

      <div className="container mx-auto px-4 mt-8">
        {!isEmpty ? (
          <>
            <DocumentFilter />
            {/* Truyền dữ liệu thật vào List */}
            <DocumentList documents={docs} />
            <Pagination />
          </>
        ) : (
           <div className="py-20 text-center">
             <div className="flex justify-center mb-4">
               <div className="bg-white p-6 rounded-full shadow-sm">
                  <Inbox className="h-12 w-12 text-slate-300" />
               </div>
             </div>
             <h3 className="text-xl font-bold text-slate-900">Kho tài liệu trống</h3>
             <p className="text-slate-500 mt-2">Hiện chưa có tài liệu nào được tải lên.</p>
           </div>
        )}
      </div>

      <footer className="mt-20 border-t pt-8 pb-8 bg-white text-center text-xs text-slate-400">
         © 2024 E-Learning Hub. All rights reserved.
      </footer>
    </div>
  )
}