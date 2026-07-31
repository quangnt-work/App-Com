// src/app/api/chat-ai/route.ts
// Dùng Gemini 2.0 Flash thay Groq LLaMA
// Free tier Gemini: RPD cao (~1,500/ngày), chất lượng tiếng Nga tốt hơn LLaMA

import { NextResponse } from "next/server";
import { ChatRequestBody } from "@/types/ai-chat";
import { generateContentWithFallback, parseAIResponse } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, topic, isAssessment } = body;

    // System prompt cho chế độ chat thường
    let systemInstruction = `Bạn là một người Nga bản xứ. Chủ đề trò chuyện hiện tại là: "${topic}". Cuộc trò chuyện luôn PHẢI sử dụng tiếng Nga, không được sử dụng bất kỳ ngôn ngữ khác.
    Hãy đặt câu hỏi mở cho tôi.`;

    // System prompt cho chế độ đánh giá — ép JSON output
    if (isAssessment) {
      systemInstruction = `Bạn là một chuyên gia khảo thí ngôn ngữ tiếng Nga. Dựa vào toàn bộ lịch sử đoạn hội thoại của học viên với chủ đề "${topic}", hãy đánh giá chi tiết năng lực.
Trả về kết quả bằng tiếng Việt. BẮT BUỘC trả về JSON với đúng các trường sau, không kèm văn bản khác:
{
  "vocabulary": "Đánh giá về vốn từ vựng học viên đã dùng",
  "intonation": "Nhận xét về ngữ pháp và cách hành văn",
  "overall_level": "Trình độ theo CEFR (A1/A2/B1/B2/C1/C2)",
  "general_feedback": "Nhận xét chung và lời khuyên cải thiện"
}`;
    }

    // Chuyển đổi messages sang format Gemini
    // Nếu messages rỗng (startChat) → AI tự mở đầu hội thoại
    const geminiContents =
      messages.length === 0
        ? [{ role: "user" as const, parts: [{ text: `Bắt đầu buổi luyện tập về chủ đề: ${topic}` }] }]
        : messages.map((msg) => ({
          role: msg.role === "model" ? ("model" as const) : ("user" as const),
          parts: [{ text: msg.content }],
        }));

    const response = await generateContentWithFallback({
      contents: geminiContents,
      config: {
        systemInstruction,
        temperature: isAssessment ? 0.2 : 0.7,
        ...(isAssessment && { responseMimeType: "application/json" }),
      },
    }, "gemini-3.1-flash-lite");

    const responseText = response.text?.trim();

    if (!responseText) {
      return NextResponse.json({ error: "AI không trả về nội dung." }, { status: 500 });
    }

    // Chế độ đánh giá → parse JSON
    if (isAssessment) {
      try {
        const assessmentData = parseAIResponse(response.text);
        return NextResponse.json({ success: true, isAssessment: true, data: assessmentData });
      } catch {
        return NextResponse.json({ error: "AI không trả về đúng định dạng đánh giá." }, { status: 500 });
      }
    }

    // Chế độ chat thường
    return NextResponse.json({ success: true, isAssessment: false, data: responseText });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi không xác định";
    console.error("Lỗi Gemini API:", msg);
    return NextResponse.json(
      { error: "Không thể kết nối với hệ thống AI, vui lòng thử lại." },
      { status: 500 }
    );
  }
}