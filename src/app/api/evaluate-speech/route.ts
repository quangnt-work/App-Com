// src/app/api/evaluate-speech/route.ts
// Chấm điểm phát âm bằng Multimodal Audio Native với Gemini Flash
// Nghe trực tiếp audio học viên và so sánh với câu mẫu (targetText)

import { NextResponse } from "next/server";
import { generateContentWithFallback, parseAIResponse, AUDIO_MODELS_FALLBACK } from "@/lib/gemini";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const targetText = (formData.get("targetText") as string) || "";
    let studentText = (formData.get("studentText") as string) || "";
    const audioFile = formData.get("audio") as File | null;

    if (!targetText.trim()) {
      return NextResponse.json({ error: "Không tìm thấy văn bản mẫu để đánh giá" }, { status: 400 });
    }

    const hasValidAudio = audioFile && audioFile.size > 100 && audioFile.type !== "application/octet-stream";

    // =========================================================================
    // CASE A: Có file Audio thực sự -> Gemini Multimodal Audio nghe trực tiếp
    // =========================================================================
    if (hasValidAudio) {
      try {
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = audioFile.type || "audio/webm";

        const audioPart = {
          inlineData: {
            mimeType,
            data: base64Audio,
          },
        };

        const evaluationPrompt = `Bạn là một chuyên gia ngữ âm học tiếng Nga. Nhiệm vụ của bạn là lắng nghe đoạn ghi âm giọng đọc của sinh viên và so sánh chi tiết với câu mẫu: "${targetText}".

Hãy đánh giá chân thật và công tâm:
1. Độ chính xác từ ngữ: Sinh viên có đọc đúng nội dung câu mẫu không? Có từ nào đọc sai, đọc thiếu hoặc nói thừa không?
2. Trọng âm (Ударение): Sinh viên có nhấn đúng trọng âm của từng từ không? (Ví dụ: "хорóшо" hay "хорошó").
3. Biến âm (Редукция): Nguyên âm không mang trọng âm có được phát âm đúng quy tắc giảm âm không (ví dụ "O" không trọng âm đọc thành /a/)?
4. Thang điểm từ 1.0 đến 10.0 (10 = hoàn hảo chuẩn bản xứ; 8-9 = rất tốt, lỗi nhỏ; 5-7 = hiểu được nhưng sai trọng âm/ngữ âm; 1-4 = sai nhiều).

BẮT BUỘC trả về định dạng JSON chính xác như sau, không kèm bất kỳ văn bản nào khác:
{
  "transcript": "<những gì bạn thực sự nghe thấy từ giọng đọc>",
  "score": <Điểm số từ 1.00 đến 10.00>,
  "feedback": "<Nhận xét sư phạm bằng tiếng Việt, 1-2 câu ngắn gọn>",
  "errors": ["Lỗi phát âm hoặc trọng âm cụ thể 1", "Lỗi cụ thể 2"],
  "stress_guide": "<câu mẫu có gắn dấu trọng âm, ví dụ: Спаси́бо большóе>"
}`;

        const response = await generateContentWithFallback(
          {
            contents: [
              {
                role: "user",
                parts: [audioPart, { text: evaluationPrompt }],
              },
            ],
            config: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          },
          AUDIO_MODELS_FALLBACK
        );

        const resultJson = parseAIResponse(response.text, {});
        return NextResponse.json(resultJson, { status: 200 });
      } catch (audioErr) {
        console.warn("Lỗi khi chấm audio trực tiếp với Gemini, fallback sang STT:", audioErr);
        // Fallback: Nếu không bóc băng được bằng Audio, thử bóc băng qua Groq Whisper
        if (!studentText && audioFile) {
          try {
            const transcription = await groq.audio.transcriptions.create({
              file: audioFile,
              model: "whisper-large-v3",
              response_format: "json",
              language: "ru",
            });
            studentText = transcription.text?.trim() || "";
          } catch (whisperErr) {
            console.error("Whisper fallback error:", whisperErr);
          }
        }
      }
    }

    // =========================================================================
    // CASE B: Không có audio hoặc Fallback Text-only
    // =========================================================================
    if (!studentText) {
      return NextResponse.json(
        {
          score: 0,
          feedback: "Không nhận diện được giọng nói. Vui lòng thử lại và nói rõ ràng hơn.",
          errors: ["Không có âm thanh được nhận diện"],
          transcript: "",
        },
        { status: 200 }
      );
    }

    const textPrompt = `Bạn là một chuyên gia ngôn ngữ học tiếng Nga. Nhiệm vụ của bạn là đánh giá độ chính xác của sinh viên so với câu mẫu.

- Câu mẫu (chuẩn): "${targetText}"
- Văn bản nhận diện từ sinh viên: "${studentText}"

Hãy so sánh hai câu trên và đánh giá:
1. Sinh viên có đọc đúng nội dung câu mẫu không?
2. Có lỗi từ ngữ hoặc thiếu/thừa từ so với mẫu không?
3. Điểm từ 1 đến 10.

BẮT BUỘC trả về JSON chính xác:
{
  "transcript": "${studentText}",
  "score": <Điểm từ 1.00 đến 10.00>,
  "feedback": "<Nhận xét chi tiết so với câu mẫu>",
  "errors": ["Lỗi cụ thể nếu có"]
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

    const resultJson = parseAIResponse(response.text, {});
    return NextResponse.json(resultJson, { status: 200 });
  } catch (error) {
    console.error("Lỗi xử lý đánh giá:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra khi gọi AI" }, { status: 500 });
  }
}