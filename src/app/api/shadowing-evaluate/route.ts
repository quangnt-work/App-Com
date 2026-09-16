// src/app/api/shadowing-evaluate/route.ts
// Chấm điểm phát âm đa phương thức (Multimodal Audio) bằng Gemini Flash
// Nghe trực tiếp audio học viên để chấm Trọng âm (Ударение), Biến âm (Редукция), Âm mềm/cứng

import { NextResponse } from "next/server";
import { generateContentWithFallback, parseAIResponse, AUDIO_MODELS_FALLBACK } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const EvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  transcript: z.string().optional().default(""),
  word_analysis: z.array(
    z.object({
      word: z.string(),
      status: z.enum(["correct", "wrong", "wrong_stress", "missing", "extra"]),
      expected: z.string().optional(),
      note: z.string().optional(),
    })
  ),
  feedback: z.string(),
  pronunciation_tips: z.string().optional(),
  stress_guide: z.string().optional(),
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

    const { targetText, studentText, audioBase64, mimeType } = await request.json();

    if (!targetText?.trim()) {
      return NextResponse.json(
        { error: "Thiếu câu mẫu để đánh giá" },
        { status: 400 }
      );
    }

    const hasAudio = typeof audioBase64 === "string" && audioBase64.length > 50;

    if (!hasAudio && !studentText?.trim()) {
      return NextResponse.json({
        score: 0,
        transcript: "",
        word_analysis: [],
        feedback: "Không nhận diện được giọng nói. Hãy nói to và rõ hơn.",
        evaluated_by: "ai",
      });
    }

    // =========================================================================
    // CASE A: Có Audio thực tế -> Gemini nghe trực tiếp (Chân thật 100%)
    // =========================================================================
    if (hasAudio) {
      const audioPart = {
        inlineData: {
          mimeType: mimeType || "audio/webm",
          data: audioBase64,
        },
      };

      const audioPrompt = `Bạn là chuyên gia ngữ âm học tiếng Nga (Russian Phonetics Examiner) cực kỳ khắt khe.
Nhiệm vụ: Lắng nghe đoạn ghi âm của học viên và so sánh với câu mẫu chuẩn: "${targetText}".

YÊU CẦU ĐÁNH GIÁ KHẮT KHE (KHÔNG ĐƯỢC AUTO-CORRECT):
1. Lắng nghe chính xác những gì học viên THỰC SỰ nói. Tuyệt đối KHÔNG tự động đoán hoặc sửa lỗi để khớp với câu mẫu.
2. Độ chính xác từ ngữ: Nếu phát âm sai, không rõ ràng, hoặc thiếu từ, BẮT BUỘC phải đánh dấu là "wrong" hoặc "missing".
3. Trọng âm (Ударение): Học viên có đặt trọng âm đúng âm tiết trong từng từ không? Nếu đọc đúng từ nhưng sai trọng âm (ví dụ: nhấn nhầm âm tiết), đánh dấu status là "wrong_stress".
4. Suy giảm nguyên âm & Phụ âm cứng/mềm: Đánh giá cực kỳ khắt khe việc phát âm "О" không trọng âm, và các phụ âm mềm.
5. Chấm điểm tuyến tính và khắt khe (0.0 đến 10.0):
   - 10.0: Đọc đúng 100% tất cả các từ, chuẩn trọng âm và biến âm.
   - 8.0 - 9.0: Đọc đúng phần lớn, sai 1-2 lỗi nhỏ.
   - 6.0 - 7.0: Đọc đúng 70-80% số từ, còn lại sai hoặc thiếu.
   - 4.0 - 5.0: Đọc đúng ~50% số từ.
   - < 4.0: Đọc sai phần lớn.
Nếu học viên chỉ nói đúng 70% từ thì điểm KHÔNG BAO GIỜ được vượt quá 7.0. Điểm phải phản ánh chính xác tỷ lệ từ đọc đúng.

BẮT BUỘC trả về định dạng JSON thuần túy (không kèm markdown thừa):
{
  "score": <số từ 0 đến 10, ví dụ 6.5>,
  "transcript": "<những từ bạn THỰC SỰ nghe thấy, kể cả những từ phát âm sai hoặc thiếu>",
  "word_analysis": [
    {
      "word": "<từ trong câu mẫu>",
      "status": "correct" | "wrong_stress" | "wrong" | "missing" | "extra",
      "expected": "<từ chuẩn có đánh dấu trọng âm nếu sai, ví dụ спаси́бо>",
      "note": "<lỗi ngữ âm cụ thể nếu có, ví dụ: 'phát âm sai hoàn toàn', 'sai trọng âm ở âm tiết 1' hoặc null>"
    }
  ],
  "feedback": "<nhận xét sư phạm bằng tiếng Việt, 1-2 câu, chỉ rõ lỗi sai>",
  "pronunciation_tips": "<hướng dẫn mẹo phát âm cụ thể cho từ sai, bằng tiếng Việt>",
  "stress_guide": "<câu mẫu có gắn dấu trọng âm sắc nhọn, ví dụ: Спаси́бо большóе>"
}`;

      const response = await generateContentWithFallback(
        {
          contents: [
            {
              role: "user",
              parts: [audioPart, { text: audioPrompt }],
            },
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        },
        AUDIO_MODELS_FALLBACK
      );

      const data = parseAIResponse(response.text);
      const validatedData = EvaluationSchema.parse(data);

      return NextResponse.json({
        score: validatedData.score,
        transcript: validatedData.transcript || studentText || "",
        word_analysis: validatedData.word_analysis,
        feedback: validatedData.feedback,
        pronunciation_tips: validatedData.pronunciation_tips ?? "",
        stress_guide: validatedData.stress_guide ?? "",
        evaluated_by: "ai",
      });
    }

    // =========================================================================
    // CASE B: Không có audio (Fallback bóc băng dạng text)
    // =========================================================================
    const textPrompt = `Bạn là chuyên gia ngôn ngữ tiếng Nga. So sánh câu mẫu với phần bóc băng giọng nói của học viên.

Câu mẫu (chuẩn): "${targetText}"
Bóc băng từ học viên: "${studentText}"

Phân tích TỪNG TỪ trong câu mẫu và xác định học viên đã nói đúng hay sai.

BẮT BUỘC trả về JSON chính xác format sau:
{
  "score": <số từ 0 đến 10>,
  "transcript": "${studentText}",
  "word_analysis": [
    {"word": "<từ>", "status": "correct"},
    {"word": "<từ>", "status": "wrong", "expected": "<từ đúng>"},
    {"word": "<từ>", "status": "missing"},
    {"word": "<từ>", "status": "extra"}
  ],
  "feedback": "<nhận xét ngắn bằng tiếng Việt, 1-2 câu>",
  "pronunciation_tips": "<mẹo phát âm cụ thể cho từ sai, bằng tiếng Việt>"
}`;

    const response = await generateContentWithFallback(
      {
        contents: [{ role: "user", parts: [{ text: textPrompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      },
      AUDIO_MODELS_FALLBACK
    );

    const data = parseAIResponse(response.text);
    const validatedData = EvaluationSchema.parse(data);

    return NextResponse.json({
      score: validatedData.score,
      transcript: studentText,
      word_analysis: validatedData.word_analysis,
      feedback: validatedData.feedback,
      pronunciation_tips: validatedData.pronunciation_tips ?? "",
      stress_guide: validatedData.stress_guide ?? "",
      evaluated_by: "ai",
    });
  } catch (error: unknown) {
    console.error("Shadowing evaluate error:", error);
    return NextResponse.json(
      { error: "Lỗi khi đánh giá bằng AI. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

