import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Khởi tạo Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    // 1. Lấy file audio từ FormData do client gửi lên
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "Không tìm thấy file audio" }, { status: 400 });
    }

    // ==========================================
    // GIAI ĐOẠN 1: SPEECH-TO-TEXT VỚI WHISPER
    // ==========================================
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3", // Model STT tốt nhất hiện tại trên Groq
      response_format: "json",
      language: "ru", // Đổi thành "en" nếu đánh giá tiếng Anh, "ru" cho tiếng Nga
    });

    const studentText = transcription.text;

    if (!studentText) {
      return NextResponse.json({ error: "Không thể nhận diện giọng nói" }, { status: 400 });
    }

    // ==========================================
    // GIAI ĐOẠN 2: ĐÁNH GIÁ BẰNG LLAMA 3
    // ==========================================
    const systemPrompt = `
      Bạn là một chuyên gia ngôn ngữ học khó tính. 
      Nhiệm vụ của bạn là đánh giá câu nói của sinh viên dựa trên văn bản được bóc băng.
      
      Văn bản của sinh viên: "${studentText}"
      
      Hãy đánh giá và BẮT BUỘC trả về định dạng JSON chính xác như sau, không kèm theo bất kỳ văn bản nào khác:
      {
        "transcript": "Văn bản đã nhận diện được",
        "score": [Điểm từ 1.00 đến 10.00],
        "feedback": "Nhận xét chi tiết về ngữ pháp và từ vựng",
        "errors": ["Lỗi 1", "Lỗi 2"] 
      }
    `;

    const evaluation = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt }
      ],
      model: "llama-3.3-70b-versatile", // Model thông minh nhất của Groq hiện tại
      response_format: { type: "json_object" }, // Ép Groq trả về chuẩn JSON
      temperature: 0.2, // Giảm sự sáng tạo để đánh giá chuẩn xác và ổn định hơn
    });

    // Parse kết quả JSON từ Llama 3
    const resultJson = JSON.parse(evaluation.choices[0]?.message?.content || "{}");

    // Trả kết quả về cho Frontend
    return NextResponse.json(resultJson, { status: 200 });

  } catch (error) {
    console.error("Lỗi xử lý đánh giá Groq:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra khi gọi AI" }, { status: 500 });
  }
}