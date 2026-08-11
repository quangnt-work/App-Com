// src/app/api/shadowing-evaluate/route.ts
// AI evaluation for blind mode sentences (6+)
// Uses Gemini to analyze pronunciation accuracy with word-level detail

import { NextResponse } from "next/server";
import { generateContentWithFallback, parseAIResponse } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const EvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  word_analysis: z.array(
    z.object({
      word: z.string(),
      status: z.enum(["correct", "wrong", "missing", "extra"]),
      expected: z.string().optional(),
    })
  ),
  feedback: z.string(),
  pronunciation_tips: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // 1. Kiểm tra xác thực (Bảo mật)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để sử dụng tính năng AI." },
        { status: 401 }
      );
    }

    const { targetText, studentText } = await request.json();

    if (!targetText?.trim()) {
      return NextResponse.json(
        { error: "Thiếu câu mẫu để đánh giá" },
        { status: 400 }
      );
    }

    if (!studentText?.trim()) {
      return NextResponse.json({
        score: 0,
        transcript: "",
        word_analysis: [],
        feedback: "Không nhận diện được giọng nói. Hãy nói to và rõ hơn.",
        evaluated_by: "ai",
      });
    }

    const prompt = `Bạn là chuyên gia ngôn ngữ tiếng Nga. So sánh câu mẫu với phần bóc băng giọng nói của học viên.

Câu mẫu (chuẩn): "${targetText}"
Bóc băng từ học viên: "${studentText}"

Phân tích TỪNG TỪ trong câu mẫu và xác định học viên đã nói đúng hay sai.

BẮT BUỘC trả về JSON chính xác format sau, không kèm văn bản khác:
{
  "score": <số từ 0 đến 10, 10 = hoàn hảo>,
  "word_analysis": [
    {"word": "<từ>", "status": "correct"},
    {"word": "<từ>", "status": "wrong", "expected": "<từ đúng>"},
    {"word": "<từ>", "status": "missing"},
    {"word": "<từ>", "status": "extra"}
  ],
  "feedback": "<nhận xét ngắn bằng tiếng Việt, 1-2 câu>",
  "pronunciation_tips": "<mẹo phát âm cụ thể cho từ sai, bằng tiếng Việt>"
}

Quy tắc:
- "correct": Từ được đọc đúng hoặc gần đúng (biến thể phát âm chấp nhận được)
- "wrong": Từ bị đọc sai rõ ràng (kèm "expected" là từ đúng)
- "missing": Từ trong câu mẫu mà học viên bỏ qua
- "extra": Từ học viên nói thêm không có trong mẫu
- Nếu 2 câu gần giống nhau (chỉ khác chút phát âm) → score >= 8
- Nếu 2 câu hoàn toàn khác nhau → score <= 3`;

    const response = await generateContentWithFallback(
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      },
      "gemini-3.1-flash-lite"
    );

    const data = parseAIResponse(response.text);
    
    // 2. Validate với Zod
    const validatedData = EvaluationSchema.parse(data);

    return NextResponse.json({
      score: validatedData.score,
      transcript: studentText,
      word_analysis: validatedData.word_analysis,
      feedback: validatedData.feedback,
      pronunciation_tips: validatedData.pronunciation_tips ?? "",
      evaluated_by: "ai",
    });
  } catch (error: unknown) {
    console.error("Shadowing evaluate error:", error);

    // Fallback: nếu AI lỗi, trả về kết quả cơ bản thay vì crash
    return NextResponse.json(
      { error: "Lỗi khi đánh giá bằng AI. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
