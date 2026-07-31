// src/app/api/evaluate-speech/route.ts
// Giai đoạn 1: Groq Whisper (Speech-to-Text) — giữ nguyên, không có free alternative tốt hơn
// Giai đoạn 2: Gemini 2.0 Flash (đánh giá phát âm) — chuyển từ Groq LLaMA để giảm tải

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { generateContentWithFallback, parseAIResponse } from "@/lib/gemini";

// Groq chỉ dùng cho Whisper STT
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    // 1. Lấy dữ liệu từ FormData
    const formData = await request.formData();
    const targetText = (formData.get("targetText") as string) || "";
    let studentText = (formData.get("studentText") as string) || "";

    if (!targetText.trim()) {
      return NextResponse.json({ error: "Không tìm thấy văn bản mẫu để đánh giá" }, { status: 400 });
    }

    // ==========================================
    // GIAI ĐOẠN 1: SPEECH-TO-TEXT VỚI WHISPER (Groq) HOẶC SỬ DỤNG TEXT TỪ CLIENT
    // ==========================================
    if (!studentText) {
      // Nếu client gửi audio thực sự (chưa bóc băng)
      const audioFile = formData.get("audio") as File;
      if (!audioFile || audioFile.size <= 0 || audioFile.type === 'application/octet-stream') {
         return NextResponse.json({ error: "Không có file ghi âm hợp lệ và không có văn bản" }, { status: 400 });
      }

      const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3",
        response_format: "json",
        language: "ru",
      });
      studentText = transcription.text?.trim() || "";
    }

    // Nếu không nhận diện được gì
    if (!studentText) {
      return NextResponse.json({
        score: 0,
        feedback: "Không nhận diện được giọng nói. Vui lòng ghi âm rõ hơn.",
        errors: ["Không có âm thanh được nhận diện"],
        transcript: "",
      }, { status: 200 });
    }

    // ==========================================
    // GIAI ĐOẠN 2: ĐÁNH GIÁ BẰNG GEMINI 2.0 FLASH
    // Chuyển từ Groq LLaMA → Gemini để giảm tải Groq
    // ==========================================
    const evaluationPrompt = `
      Bạn là một chuyên gia ngôn ngữ học tiếng Nga. Nhiệm vụ của bạn là đánh giá độ chính xác phát âm và nội dung của sinh viên so với câu mẫu.

      - Câu mẫu (câu đúng): "${targetText}"
      - Văn bản bóc băng từ giọng nói của sinh viên: "${studentText}"

      Hãy so sánh hai câu trên và đánh giá:
      1. Sinh viên có đọc đúng nội dung câu mẫu không?
      2. Có lỗi phát âm hoặc thiếu/thừa từ so với mẫu không?
      3. Điểm từ 1 đến 10 (10 là hoàn toàn khớp với câu mẫu).

      Nếu câu bóc băng hoàn toàn khác câu mẫu (sinh viên không đọc câu mẫu), cho điểm thấp (1-3) và giải thích rõ.

      BẮT BUỘC trả về định dạng JSON chính xác như sau, không kèm theo bất kỳ văn bản nào khác:
      {
        "transcript": "Văn bản đã nhận diện được",
        "score": [Điểm từ 1.00 đến 10.00],
        "feedback": "Nhận xét chi tiết so với câu mẫu",
        "errors": ["Lỗi cụ thể 1", "Lỗi cụ thể 2"]
      }
    `;

    const response = await generateContentWithFallback({
      contents: [{ role: "user", parts: [{ text: evaluationPrompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }, "gemini-3.1-flash-lite");

    const resultJson = parseAIResponse(response.text, {});

    return NextResponse.json(resultJson, { status: 200 });

  } catch (error) {
    console.error("Lỗi xử lý đánh giá:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra khi gọi AI" }, { status: 500 });
  }
}