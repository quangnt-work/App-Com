"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Info } from "lucide-react";

// Định nghĩa lại kiểu dữ liệu prop cho khớp với state ở wrapper
interface ExamBasicInfo {
  title: string;
  description: string;
  duration: number;
  is_published: boolean;
}

interface ExamSettingsTabProps {
  data: ExamBasicInfo;
  onChange: (newData: ExamBasicInfo) => void;
}

export function ExamSettingsTab({ data, onChange }: ExamSettingsTabProps) {
  
  // Hàm helper để update từng field gọn gàng hơn
  const updateField = (field: keyof ExamBasicInfo, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="grid gap-6">
      {/* Khối thông tin chính */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
          <CardDescription>
            Các thông tin cơ bản sẽ hiển thị cho học viên trước khi bắt đầu làm bài.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Tên đề thi */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Tên đề thi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ví dụ: Đề thi thử THPT Quốc gia 2024..."
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="font-medium"
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả / Hướng dẫn làm bài</Label>
            <Textarea
              id="description"
              placeholder="Nhập các lưu ý cho học viên..."
              rows={4}
              value={data.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Khối cấu hình */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" />
              Cấu hình thời gian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian làm bài (Phút)</Label>
              <div className="relative">
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={data.duration}
                  onChange={(e) => updateField("duration", Number(e.target.value))}
                  className="pr-12"
                />
                <span className="absolute right-3 top-2.5 text-sm text-slate-400">
                  phút
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Nhập 0 nếu không giới hạn thời gian.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-500" />
              Trạng thái hiển thị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2 border rounded-lg p-3 bg-slate-50/50">
              <div className="space-y-0.5">
                <Label className="text-base">Công khai đề thi</Label>
                <p className="text-xs text-slate-500">
                  {data.is_published 
                    ? "Đề thi đang hiển thị cho học viên." 
                    : "Đề thi đang ẩn (Chế độ nháp)."}
                </p>
              </div>
              <Switch
                checked={data.is_published}
                onCheckedChange={(checked) => updateField("is_published", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}