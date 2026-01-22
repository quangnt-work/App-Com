import React, { useState, useEffect } from 'react'
import { Question, QuestionType } from '@/types/exam-custom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, CheckSquare, AlignLeft, Layers, ChevronLeft, ChevronRight, 
  UploadCloud, Flag, BookOpen 
} from 'lucide-react'
import { toast } from 'sonner'

// Components imports
import { QuestionForm } from './QuestionForm'
import { QuestionItem } from './QuestionItem'
import { FileImportDialog } from './FileImportDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

interface QuestionListProps {
  questions: Question[];
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
  onSave: (question: Question) => void;
  onDelete: (index: number) => void;
}

const ITEMS_PER_PAGE = 20; // Tăng lên 20 để xem được nhiều section hơn trong 1 trang

export function QuestionList({ questions, editingIndex, setEditingIndex, onSave, onDelete }: QuestionListProps) {
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Pagination Logic
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [questions.length, totalPages, currentPage]);

  // Handlers
  const handleStartAdd = (type: QuestionType) => {
      setNewQuestionType(type);
      setEditingIndex(-1); 
  };

  const handleCancel = () => {
      setEditingIndex(null);
      setNewQuestionType(null);
  };

  const handleSaveWrapper = (q: Question) => {
      onSave(q);
      handleCancel();
      if (editingIndex === -1) {
          const newTotal = questions.length + 1;
          setCurrentPage(Math.ceil(newTotal / ITEMS_PER_PAGE));
      }
  };

  const handleDeleteWrapper = (indexInPage: number) => {
      const realIndex = startIndex + indexInPage;
      onDelete(realIndex);
  };

  const handleImportSuccess = (importedQuestions: Question[]) => {
      importedQuestions.forEach(q => onSave(q));
      toast.success(`Đã thêm thành công ${importedQuestions.length} câu hỏi!`);
      const newTotal = questions.length + importedQuestions.length;
      setCurrentPage(Math.ceil(newTotal / ITEMS_PER_PAGE));
  };

  const isAddingOrEditing = editingIndex !== null;

  return (
    <div className="space-y-6">
      
      {/* 1. TOOLBAR (Ẩn khi đang Edit) */}
      {!isAddingOrEditing && (
         <div className="flex flex-col sm:flex-row gap-3 py-4 border-b border-slate-200">
             
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white shadow-sm gap-2">
                        <Plus className="w-4 h-4" /> Thêm thủ công
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Chọn loại câu hỏi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStartAdd('multiple_choice')}>
                        <CheckSquare className="w-4 h-4 mr-2 text-green-600"/> Trắc nghiệm
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStartAdd('essay')}>
                        <AlignLeft className="w-4 h-4 mr-2 text-orange-600"/> Tự luận / Điền từ
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStartAdd('group')}>
                        <Layers className="w-4 h-4 mr-2 text-purple-600"/> Câu hỏi Nhóm
                    </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>

             <Button 
                variant="outline"
                className="gap-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50 text-slate-600"
                onClick={() => setIsImportOpen(true)}
             >
                <UploadCloud className="w-4 h-4"/> Import File Word
             </Button>

             <div className="ml-auto flex items-center text-sm text-slate-500">
                Tổng: <strong className="ml-1 text-slate-900">{questions.length}</strong> câu
             </div>
         </div>
      )}

      {/* 2. EDITOR FORM */}
      {isAddingOrEditing && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mb-8">
            <div className="bg-sky-50 border border-sky-100 p-2 rounded-t-lg text-sky-700 font-bold text-sm px-4">
                {editingIndex === -1 ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
            </div>
            <QuestionForm 
                initialData={editingIndex !== -1 ? questions[editingIndex] : undefined}
                initialType={editingIndex !== -1 ? questions[editingIndex].type : newQuestionType!}
                onSave={handleSaveWrapper}
                onCancel={handleCancel}
            />
        </div>
      )}

      {/* 3. QUESTION LIST (Grouped by Section) */}
      <div className="space-y-4">
        {questions.length === 0 && !isAddingOrEditing && (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <p className="text-slate-500">Chưa có dữ liệu.</p>
                <Button variant="link" onClick={() => setIsImportOpen(true)}>Import ngay</Button>
            </div>
        )}

        {currentQuestions.map((q, idx) => {
            const realIndex = startIndex + idx;
            // Ẩn item đang edit
            if (editingIndex === realIndex) return null;

            // Logic kiểm tra Section thay đổi để hiển thị Header
            // Nếu là item đầu tiên của trang HOẶC section khác item trước đó
            const prevQ = idx > 0 ? currentQuestions[idx - 1] : null;
            const showSectionHeader = !prevQ || (q.section !== prevQ.section);

            return (
                <div key={q.id || realIndex}>
                    {/* SECTION HEADER */}
                    {showSectionHeader && (
                        <div className="flex items-center gap-2 mt-6 mb-3 pb-2 border-b border-slate-200">
                            <BookOpen className="w-5 h-5 text-slate-500"/>
                            <h3 className="font-bold text-lg text-slate-800 uppercase tracking-tight">
                                {q.section || 'Phần chung'}
                            </h3>
                        </div>
                    )}

                    {/* QUESTION ITEM */}
                    <div className="relative group">
                        {/* Hiển thị Level CEFR bên cạnh STT */}
                        <div className="absolute -left-3 top-4 z-10">
                            {q.cefr_level && (
                                <Badge className={`text-[10px] px-1 h-5 ${
                                    q.cefr_level.startsWith('A') ? 'bg-green-500' : 
                                    q.cefr_level.startsWith('B') ? 'bg-yellow-500' : 'bg-red-500'
                                }`}>
                                    {q.cefr_level}
                                </Badge>
                            )}
                        </div>
                        
                        <QuestionItem 
                            index={idx} 
                            displayIndex={realIndex + 1}
                            question={q} 
                            onEdit={() => setEditingIndex(realIndex)}
                            onDelete={() => handleDeleteWrapper(idx)}
                        />
                    </div>
                </div>
            )
        })}

        {/* 4. PAGINATION */}
        {totalPages > 1 && !isAddingOrEditing && (
            <div className="flex justify-center items-center gap-2 pt-8">
                <Button 
                    variant="outline" size="sm" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4"/>
                </Button>
                
                <span className="text-sm font-medium text-slate-600 px-2">
                    Trang {currentPage} / {totalPages}
                </span>

                <Button 
                    variant="outline" size="sm" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="w-4 h-4"/>
                </Button>
            </div>
        )}
      </div>

      {/* DIALOG IMPORT */}
      <FileImportDialog 
        open={isImportOpen} 
        onOpenChange={setIsImportOpen}
        onImport={handleImportSuccess}
      />

    </div>
  )
}