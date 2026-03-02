import { useFieldArray, Control } from "react-hook-form";
import { GrammarInput } from "@/lib/schemas/grammar"; // Đảm bảo import đúng đường dẫn Schema
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Hàm utility mặc định của shadcn


interface QuizBuilderProps {
  control: Control<GrammarInput>;
}


export default function QuizBuilder({ control }: QuizBuilderProps) {
  // Hook quản lý mảng câu hỏi
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Bài luyện tập</h3>
            <Badge variant="secondary" className="px-2 py-0.5">
              {fields.length} câu
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tạo các câu hỏi trắc nghiệm để kiểm tra kiến thức học viên.
          </p>
        </div>
      </div>


      {/* Empty State: Khi chưa có câu hỏi nào */}
      {fields.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-xl bg-gray-50/50">
          <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
            Chưa có câu hỏi luyện tập.
          </p>
          <Button
            type="button"
            onClick={() =>
              append({
                question: "",
                options: ["", "", "", ""],
                correct_answer: 0,
              })
            }
          >
            <Plus className="w-4 h-4 mr-2" /> Tạo câu hỏi
          </Button>
        </div>
      )}


      {/* List Questions */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="group relative p-6 border rounded-xl bg-white shadow-sm hover:border-blue-300 transition-all duration-200"
          >
            {/* Header của từng Card câu hỏi */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                        {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-500">Câu hỏi trắc nghiệm</span>
                </div>
               
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2"
                    onClick={() => remove(index)}
                    title="Xóa câu hỏi này"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>


            {/* Nội dung câu hỏi */}
            <div className="space-y-6 pl-2 md:pl-11">
              <FormField
                control={control}
                name={`questions.${index}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập nội dung câu hỏi..."
                        className="font-medium text-base border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-500 placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Khu vực Đáp án */}
              <div className="space-y-3">
                <FormLabel className="text-xs uppercase text-gray-400 font-semibold tracking-wider">
                  Các lựa chọn (Tick chọn đáp án đúng)
                </FormLabel>


                <FormField
                  control={control}
                  name={`questions.${index}.correct_answer`}
                  render={({ field: correctField }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) => correctField.onChange(parseInt(val))}
                          value={correctField.value?.toString()}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {[0, 1, 2, 3].map((optIndex) => (
                            <FormItem key={optIndex} className="space-y-0">
                                {/* Wrapper cho từng đáp án */}
                                <div
                                    className={cn(
                                        "relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                                        // Styling điều kiện: Nếu là đáp án đúng -> Viền xanh + Nền xanh nhạt
                                        correctField.value === optIndex
                                        ? "border-green-500 bg-green-50/30 ring-1 ring-green-500"
                                        : "bg-gray-50/50 border-gray-200 hover:border-blue-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400"
                                    )}
                                >
                                    {/* Radio Button */}
                                    <FormControl>
                                        <RadioGroupItem
                                            value={optIndex.toString()}
                                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                        />
                                    </FormControl>


                                    {/* Label A, B, C, D */}
                                    <span className={cn(
                                        "text-sm font-bold w-6",
                                        correctField.value === optIndex ? "text-green-700" : "text-gray-400"
                                    )}>
                                        {String.fromCharCode(65 + optIndex)}.
                                    </span>


                                    {/* Input nội dung đáp án */}
                                    <FormField
                                        control={control}
                                        name={`questions.${index}.options.${optIndex}`}
                                        render={({ field: optionField }) => (
                                        <div className="flex-1">
                                            <Input
                                                {...optionField}
                                                placeholder={`Nhập đáp án ${String.fromCharCode(65 + optIndex)}`}
                                                className="border-none shadow-none focus-visible:ring-0 bg-transparent px-0 h-auto py-1 text-sm"
                                            />
                                        </div>
                                        )}
                                    />
                                   
                                    {/* Icon Check khi đúng */}
                                    {correctField.value === optIndex && (
                                        <CheckCircle2 className="w-4 h-4 text-green-600 animate-in fade-in zoom-in" />
                                    )}
                                </div>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        ))}


        {/* Nút thêm câu hỏi ở cuối */}
        {fields.length > 0 && (
            <Button
            type="button"
            variant="outline"
            className="w-full py-8 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 transition-all group"
            onClick={() =>
                append({
                question: "",
                options: ["", "", "", ""],
                correct_answer: 0,
                })
            }
            >
            <div className="flex flex-col items-center gap-1">
                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Thêm câu hỏi mới</span>
            </div>
            </Button>
        )}
      </div>
    </div>
  );
}