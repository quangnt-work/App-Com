import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Khởi tạo Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    // 1. Lấy file audio và targetText từ FormData do client gửi lên
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const targetText = (formData.get("targetText") as string) || "";

    if (!audioFile) {
      return NextResponse.json({ error: "Không tìm thấy file audio" }, { status: 400 });
    }

    if (!targetText.trim()) {
      return NextResponse.json({ error: "Không tìm thấy văn bản mẫu để đánh giá" }, { status: 400 });
    }

    // ==========================================
    // GIAI ĐOẠN 1: SPEECH-TO-TEXT VỚI WHISPER
    // ==========================================
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      response_format: "json",
      language: "ru",
    });

    const studentText = transcription.text?.trim();

    // Nếu Whisper không nhận diện được gì (audio im lặng / quá ngắn)
    if (!studentText) {
      return NextResponse.json({
        score: 0,
        feedback: "Không nhận diện được giọng nói. Vui lòng ghi âm rõ hơn.",
        errors: ["Không có âm thanh được nhận diện"],
        transcript: "",
      }, { status: 200 });
    }

    // ==========================================
    // GIAI ĐOẠN 2: ĐÁNH GIÁ BẰNG LLAMA 3
    // So sánh trực tiếp studentText với targetText
    // ==========================================
    const systemPrompt = `
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

    const evaluation = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const resultJson = JSON.parse(evaluation.choices[0]?.message?.content || "{}");

    return NextResponse.json(resultJson, { status: 200 });

  } catch (error) {
    console.error("Lỗi xử lý đánh giá Groq:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra khi gọi AI" }, { status: 500 });
  }
}