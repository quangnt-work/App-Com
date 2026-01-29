import { Control } from "react-hook-form";
import { LessonInput } from "@/lib/schemas/lesson";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneralInfoProps {
  control: Control<LessonInput>;
}

export default function GeneralInfo({ control }: GeneralInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-800">Thông tin cơ bản</h3>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề bài học <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Bài 1 - Nhập môn..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1">
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TIẾNG ANH">Tiếng Anh</SelectItem>
                      <SelectItem value="TIẾNG NGA">Tiếng Nga</SelectItem>
                      <SelectItem value="CNTT">Công nghệ thông tin</SelectItem>
                      <SelectItem value="KHÁC">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả ngắn</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Mô tả nội dung chính của bài học..." 
                  className="min-h-[100px] resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}