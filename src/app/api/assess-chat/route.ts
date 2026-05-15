// src/app/api/assess-chat/route.ts
// Đánh giá cuối buổi chat: thống nhất dùng Gemini 2.0 Flash cho cả 2 case
// Case A: Có audio → Gemini 2.0 Flash nghe audio thật để đánh giá ngữ điệu
// Case B: Không có audio → Gemini 2.0 Flash đánh giá text-only (thay Groq LLaMA)

import { NextResponse } from "next/server";
import { ChatMessageType } from "@/types/ai-chat";
import { generateContentWithFallback } from "@/lib/gemini";

interface AssessChatBody {
    messages: ChatMessageType[];
    topic: string;
    // Mảng audio base64 từ các tin nhắn giọng nói của user (tối đa 3 mẫu)
    audioSamples?: { data: string; mimeType: string }[];
}

export async function POST(request: Request) {
    try {
        const body: AssessChatBody = await request.json();
        const { messages, topic, audioSamples } = body;

        if (messages.length === 0) {
            return NextResponse.json(
                { error: "Không có nội dung hội thoại để đánh giá." },
                { status: 400 }
            );
        }

        // Tóm tắt lịch sử hội thoại dạng text để đưa vào prompt
        const conversationText = messages
            .map((m) => `${m.role === "user" ? "Học viên" : "AI"}: ${m.content}`)
            .join("\n");

        // ============================================================
        // CASE A: Có audio → Gemini 2.0 Flash (đánh giá ngữ điệu + audio)
        // ============================================================
        if (audioSamples && audioSamples.length > 0) {
            const assessmentPrompt = `Bạn là chuyên gia ngôn ngữ tiếng Nga. Hãy đánh giá toàn diện học viên dựa trên:
1. Các đoạn audio ghi âm giọng nói của học viên (đánh giá ngữ điệu, phát âm, nhịp điệu)
2. Lịch sử hội thoại bằng văn bản bên dưới (đánh giá từ vựng, ngữ pháp)

Chủ đề hội thoại: "${topic}"

Lịch sử hội thoại:
${conversationText}

Trả về kết quả bằng tiếng Việt. BẮT BUỘC theo đúng JSON sau:
{
  "vocabulary": "Đánh giá vốn từ vựng học viên đã dùng",
  "intonation": "Đánh giá ngữ điệu, phát âm, nhịp nói qua audio (cụ thể, chi tiết)",
  "overall_level": "Trình độ theo CEFR (A1/A2/B1/B2/C1/C2)",
  "general_feedback": "Nhận xét tổng hợp và lời khuyên cải thiện"
}`;

            // Xây dựng parts: tất cả audio samples + text prompt
            const audioParts = audioSamples.map((sample) => ({
                inlineData: { mimeType: sample.mimeType, data: sample.data },
            }));

            const response = await generateContentWithFallback({
                contents: [
                    {
                        role: "user",
                        parts: [...audioParts, { text: assessmentPrompt }],
                    },
                ],
                config: {
                    responseMimeType: "application/json",
                    temperature: 0.2,
                },
            }, "gemini-3.1-flash-lite");

            const responseText = response.text?.trim();
            if (!responseText) throw new Error("Gemini không trả về nội dung.");

            const assessmentData = JSON.parse(responseText);
            return NextResponse.json({ success: true, data: assessmentData, mode: "audio" });
        }

        // ============================================================
        // CASE B: Không có audio → Gemini 2.0 Flash (text-only)
        // Trước đây dùng Groq LLaMA → nay thống nhất Gemini để giảm phụ thuộc Groq
        // ============================================================
        const textPrompt = `Bạn là chuyên gia khảo thí tiếng Nga. Đánh giá học viên qua hội thoại sau về chủ đề "${topic}". 
Trả về JSON với đúng các trường: vocabulary, intonation, overall_level, general_feedback. Bằng tiếng Việt.
Lưu ý: intonation chỉ dựa trên văn bản (không có audio), hãy đánh giá về ngữ pháp và hành văn.

Lịch sử hội thoại:
${conversationText}`;

        const response = await generateContentWithFallback({
            contents: [{ role: "user", parts: [{ text: textPrompt }] }],
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
            },
        }, "gemini-3.1-flash-lite");

        const responseText = response.text?.trim();
        if (!responseText) throw new Error("Gemini không trả về nội dung.");

        const assessmentData = JSON.parse(responseText);
        return NextResponse.json({ success: true, data: assessmentData, mode: "text" });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Lỗi không xác định";
        console.error("Lỗi assess-chat:", msg);
        return NextResponse.json(
            { error: "Không thể thực hiện đánh giá, vui lòng thử lại." },
            { status: 500 }
        );
    }
}
