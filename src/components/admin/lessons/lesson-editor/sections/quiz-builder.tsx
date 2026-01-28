import { useFieldArray, Control } from "react-hook-form";
import { LessonInput } from "@/lib/schemas/lesson";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, HelpCircle } from "lucide-react";

interface QuizBuilderProps {
  control: Control<LessonInput>;
}

export default function QuizBuilder({ control }: QuizBuilderProps) {
  // Hook quản lý mảng động
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-50 rounded-lg">
            <HelpCircle className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-semibold text-lg text-gray-800">Bài tập trắc nghiệm</h3>
        </div>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
          {fields.length} câu hỏi
        </span>
      </div>

      <div className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="relative p-6 border rounded-xl bg-gray-50/30 group hover:border-blue-200 transition-colors">
            
            {/* Nút xóa câu hỏi */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="space-y-4 pr-8">
              {/* Nội dung câu hỏi */}
              <FormField
                control={control}
                name={`questions.${index}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-700">Câu hỏi {index + 1}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập câu hỏi..." className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Các lựa chọn đáp án & Đáp án đúng */}
              <div className="mt-4">
                <FormLabel className="text-sm text-gray-600 mb-2 block">Đáp án (Chọn chấm tròn cho đáp án đúng)</FormLabel>
                
                {/* Controller cho Radio Group (Correct Answer) */}
                <FormField
                  control={control}
                  name={`questions.${index}.correct_answer`}
                  render={({ field: correctField }) => (
                    <RadioGroup
                      onValueChange={(val) => correctField.onChange(parseInt(val))}
                      value={correctField.value.toString()}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {[0, 1, 2, 3].map((optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3 bg-white p-3 rounded-lg border focus-within:ring-2 ring-blue-500/20">
                          <RadioGroupItem value={optIndex.toString()} id={`q${index}-opt${optIndex}`} />
                          
                          {/* Input cho text đáp án */}
                          <FormField
                            control={control}
                            name={`questions.${index}.options.${optIndex}`}
                            render={({ field: optionField }) => (
                              <div className="flex-1">
                                <Input 
                                  {...optionField} 
                                  placeholder={`Đáp án ${String.fromCharCode(65 + optIndex)}`}
                                  className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto py-1"
                                />
                              </div>
                            )}
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                 {/* Hiển thị lỗi nếu chưa chọn đáp án đúng (tùy chọn) */}
                 <p className="text-red-500 text-xs mt-2 min-h-[1rem]">
                    {control.getFieldState(`questions.${index}.correct_answer`).error?.message}
                 </p>
              </div>
            </div>
          </div>
        ))}

        {/* Nút thêm câu hỏi */}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ 
            question: "", 
            options: ["", "", "", ""], 
            correct_answer: 0 
          })}
          className="w-full py-6 border-dashed border-2 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm câu hỏi mới
        </Button>
      </div>
    </div>
  );
}