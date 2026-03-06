// src/app/api/chat-ai/route.ts
// Dùng Groq (llama-3.3-70b-versatile) thay Gemini 2.5 Flash
// Free tier Groq: ~14,400 tokens/phút, không giới hạn 20 req/ngày

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { ChatRequestBody } from "@/types/ai-chat";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, topic, isAssessment } = body;

    // System prompt cho chế độ chat thường
    let systemPrompt = `Bạn là một người Nga bản xứ. Chủ đề trò chuyện hiện tại là: "${topic}". Cuộc trò chuyện luôn PHẢI sử dụng tiếng Nga, không được sử dụng bất kỳ ngôn ngữ khác.
    Hãy đặt câu hỏi mở cho tôi.`;

    // System prompt cho chế độ đánh giá — ép JSON output
    if (isAssessment) {
      systemPrompt = `Bạn là một chuyên gia khảo thí ngôn ngữ tiếng Nga. Dựa vào toàn bộ lịch sử đoạn hội thoại của học viên với chủ đề "${topic}", hãy đánh giá chi tiết năng lực.
Trả về kết quả bằng tiếng Việt. BẮT BUỘC trả về JSON với đúng các trường sau, không kèm văn bản khác:
{
  "vocabulary": "Đánh giá về vốn từ vựng học viên đã dùng",
  "intonation": "Nhận xét về ngữ pháp và cách hành văn",
  "overall_level": "Trình độ theo CEFR (A1/A2/B1/B2/C1/C2)",
  "general_feedback": "Nhận xét chung và lời khuyên cải thiện"
}`;
    }

    // Chuyển đổi messages sang format Groq (OpenAI-compatible)
    // Nếu messages rỗng (startChat) → AI tự mở đầu hội thoại
    const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...(messages.length === 0
        ? [{ role: "user" as const, content: `Bắt đầu buổi luyện tập về chủ đề: ${topic}` }]
        : messages.map((msg) => ({
          role: msg.role === "model" ? ("assistant" as const) : ("user" as const),
          content: msg.content,
        }))),
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: isAssessment ? 0.2 : 0.7,
      ...(isAssessment && { response_format: { type: "json_object" } }),
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText) {
      return NextResponse.json({ error: "AI không trả về nội dung." }, { status: 500 });
    }

    // Chế độ đánh giá → parse JSON
    if (isAssessment) {
      try {
        const assessmentData = JSON.parse(responseText);
        return NextResponse.json({ success: true, isAssessment: true, data: assessmentData });
      } catch {
        console.error("Lỗi Parse JSON từ AI:", responseText);
        return NextResponse.json({ error: "AI không trả về đúng định dạng đánh giá." }, { status: 500 });
      }
    }

    // Chế độ chat thường
    return NextResponse.json({ success: true, isAssessment: false, data: responseText });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi không xác định";
    console.error("Lỗi Groq API:", msg);
    return NextResponse.json(
      { error: "Không thể kết nối với hệ thống AI, vui lòng thử lại." },
      { status: 500 }
    );
  }
}