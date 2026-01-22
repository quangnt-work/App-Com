import React, { useState, useRef } from 'react'
import mammoth from 'mammoth'
import { Question, QuestionType, CEFRLevel } from '@/types/exam-custom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Loader2, FileText, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface FileImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (questions: Question[]) => void;
}

export function FileImportDialog({ open, onOpenChange, onImport }: FileImportDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<Question[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIC PARSER NÂNG CAO ---
  const parseDocContent = (text: string) => {
    const questions: Question[] = [];
    
    // 1. Tách theo từng dòng để xử lý Section
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    let currentSection = "General"; // Mặc định
    let currentBlock: string[] = [];
    
    // Regex nhận diện Header phần thi (Hỗ trợ Anh & Nga)
    // VD: Part 1, Section A, Часть 1, Раздел 2
    const sectionRegex = /^(?:Part|Section|Часть|Раздел)\s+(\d+|[IVX]+|One|Two|Three|A|B)[:.]?/i;
    
    // Regex nhận diện bắt đầu câu hỏi (Hỗ trợ Anh & Nga)
    // VD: Question 1, Câu 1, Вопрос 1, 1. (đứng đầu dòng)
    const questionStartRegex = /^(?:Question|Câu|Вопрос)\s+\d+[:.]|^\d+\.\s/i;

    // Helper: Xử lý một block câu hỏi đã gom được
    const processBlock = (blockLines: string[], section: string) => {
        if (blockLines.length === 0) return;
        
        const fullText = blockLines.join('\n');
        
        // A. Tìm Level (VD: [B1], (A2))
        let cefrLevel: CEFRLevel = 'B1'; // Mặc định
        const levelMatch = fullText.match(/\[(A1|A2|B1|B2|C1|C2)\]/i);
        if (levelMatch) cefrLevel = levelMatch[1].toUpperCase() as CEFRLevel;

        // B. Tách Options & Content
        let content = "";
        const options: string[] = [];
        let correctAnswer = "";
        let explanation = "";
        
        // Loại bỏ thẻ Level khỏi nội dung hiển thị cho đẹp
        const cleanLines = blockLines.map(l => l.replace(/\[(A1|A2|B1|B2|C1|C2)\]/i, '').trim());

        let parsingMode: 'content' | 'options' | 'explanation' = 'content';

        cleanLines.forEach(line => {
            // Check Option (A., B., C...)
            const optMatch = line.match(/^([A-D])\./i);
            // Check Explanation (Giải thích:, Explanation:)
            const expMatch = line.match(/^(?:Explanation|Giải thích|Lời giải|Пояснение):/i);

            if (expMatch) {
                parsingMode = 'explanation';
                explanation += line.replace(expMatch[0], '').trim() + '\n';
            } else if (optMatch) {
                parsingMode = 'options';
                let optText = line.replace(/^[A-D]\.\s*/i, "").trim();
                
                // Check đáp án đúng (dấu *)
                if (optText.startsWith('*')) {
                    optText = optText.substring(1).trim();
                    correctAnswer = optText;
                }
                options.push(optText);
            } else {
                // Nếu đang ở mode content hoặc dòng không khớp option -> cộng dồn vào content/exp
                if (parsingMode === 'explanation') explanation += line + '\n';
                else if (parsingMode === 'content') content += line + '\n';
            }
        });

        // C. Xác định loại câu hỏi
        let type: QuestionType = 'multiple_choice';
        if (options.length < 2) type = 'essay'; // Không có option -> Tự luận

        // Mapping CEFR sang difficulty hệ thống
        const mapDifficulty = (lvl: CEFRLevel) => {
            if (['A1', 'A2'].includes(lvl)) return 'easy';
            if (['B1', 'B2'].includes(lvl)) return 'medium';
            return 'hard';
        };

        questions.push({
            id: crypto.randomUUID(),
            section: section,
            content: content.trim(),
            type: type,
            options,
            correct_answer: correctAnswer,
            explanation: explanation.trim(),
            cefr_level: cefrLevel,
            difficulty: mapDifficulty(cefrLevel),
            score: 1, // Điểm tạm tính
            order_index: questions.length
        });
    };

    // 2. Loop chính xử lý từng dòng
    lines.forEach((line) => {
        // Nếu gặp Header Section mới
        if (sectionRegex.test(line)) {
            // Lưu câu hỏi cũ nếu có
            if (currentBlock.length > 0) {
                processBlock(currentBlock, currentSection);
                currentBlock = [];
            }
            currentSection = line; // Cập nhật tên phần thi mới
            return;
        }

        // Nếu gặp Bắt đầu câu hỏi mới
        if (questionStartRegex.test(line)) {
            // Lưu câu hỏi cũ
            if (currentBlock.length > 0) {
                processBlock(currentBlock, currentSection);
            }
            currentBlock = [line]; // Bắt đầu block mới
        } else {
            // Dòng nội dung tiếp theo của câu hỏi hiện tại
            if (currentBlock.length > 0) { // Chỉ push nếu đã bắt đầu câu hỏi
                 currentBlock.push(line);
            } else {
                 // Trường hợp text trôi nổi đầu file (ví dụ đề bài chung của section)
                 // Có thể xử lý logic tạo Group Question ở đây nếu cần.
            }
        }
    });

    // Xử lý block cuối cùng
    if (currentBlock.length > 0) {
        processBlock(currentBlock, currentSection);
    }

    return questions;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const questions = parseDocContent(result.value);
      
      if (questions.length === 0) toast.error("Không tìm thấy câu hỏi đúng định dạng.");
      else {
          setPreviewData(questions);
          toast.success(`Tìm thấy ${questions.length} câu hỏi chia làm ${new Set(questions.map(q => q.section)).size} phần.`);
      }
    } catch (e) { toast.error("Lỗi đọc file"); } 
    finally { setIsProcessing(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Đề Thi (Anh/Nga)</DialogTitle>
        </DialogHeader>

        {!previewData.length && (
            <div className="space-y-4">
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                    <Info className="w-4 h-4"/>
                    <AlertTitle>Quy tắc soạn thảo file Word (.docx)</AlertTitle>
                    <AlertDescription className="text-sm mt-2 space-y-1">
                        <p>1. <strong>Phần thi:</strong> Bắt đầu bằng <em>Part, Section, Часть</em> (VD: <code>Часть 1: Чтение</code>)</p>
                        <p>2. <strong>Trình độ:</strong> Thêm thẻ <code>[A1]</code>, <code>[B2]</code> vào đầu câu hỏi để hệ thống tự xếp loại.</p>
                        <p>3. <strong>Câu hỏi:</strong> Bắt đầu bằng số thứ tự (VD: <code>1.</code> hoặc <code>Вопрос 1:</code>)</p>
                        <p>4. <strong>Đáp án đúng:</strong> Đánh dấu sao <code>*</code> trước đáp án (VD: <code>*A. Hello</code>)</p>
                    </AlertDescription>
                </Alert>
                
                <div 
                    className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:bg-slate-50"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input type="file" accept=".docx" className="hidden" ref={fileInputRef} onChange={handleFileUpload}/>
                    {isProcessing ? <Loader2 className="animate-spin mx-auto"/> : <FileText className="mx-auto w-10 h-10 text-slate-400"/>}
                    <p className="mt-2 text-slate-600">Chọn file đề thi (.docx)</p>
                </div>
            </div>
        )}

        {previewData.length > 0 && (
            <div className="space-y-4">
                {/* Group Preview by Section */}
                {Object.entries(groupBy(previewData, 'section')).map(([section, qs]) => (
                    <div key={section} className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 border-b flex justify-between">
                            <span>{section}</span>
                            <span className="text-xs font-normal bg-white px-2 py-1 rounded border">{(qs as any).length} câu</span>
                        </div>
                        <div className="divide-y max-h-[200px] overflow-y-auto">
                            {(qs as Question[]).map((q, i) => (
                                <div key={i} className="p-3 text-sm bg-white hover:bg-slate-50">
                                    <div className="flex gap-2 mb-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${getCefrColor(q.cefr_level)}`}>
                                            {q.cefr_level}
                                        </span>
                                        <span className="font-semibold text-slate-800 line-clamp-1">{q.content}</span>
                                    </div>
                                    <div className="text-slate-500 text-xs pl-8">
                                        Đáp án: {q.correct_answer || '(Tự luận)'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setPreviewData([])}>Hủy</Button>
                    <Button onClick={() => { onImport(previewData); onOpenChange(false); setPreviewData([]) }}>
                        Nhập {previewData.length} câu hỏi
                    </Button>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helpers
function groupBy(xs: any[], key: string) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

function getCefrColor(level?: string) {
    switch(level) {
        case 'A1': case 'A2': return 'bg-green-500';
        case 'B1': case 'B2': return 'bg-yellow-500';
        case 'C1': case 'C2': return 'bg-red-500';
        default: return 'bg-slate-400';
    }
}