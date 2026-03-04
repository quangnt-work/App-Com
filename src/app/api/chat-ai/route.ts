//src/app/api/evaluate-speech/route.ts

import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { ChatRequestBody, GeminiContent } from "@/types/ai-chat";

// Khởi tạo SDK bằng API Key từ biến môi trường
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, topic, isAssessment } = body;

    // 1. Chuyển đổi dữ liệu tin nhắn an toàn (không dùng as any)
    const formattedContents: GeminiContent[] = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    // 2. Chuẩn bị cấu hình (Config) cho Gemini
    // Mặc định cho chế độ Chat bình thường
    let systemInstruction = `Bạn là một giáo viên dạy tiếng Nga thân thiện. Chủ đề trò chuyện hiện tại là: "${topic}". Hãy phản hồi ngắn gọn, tự nhiên và giúp học viên luyện tập tiếng Nga.`;
    let responseMimeType = "text/plain";
    let responseSchema = undefined;
    let temperature = 0.7; // Sáng tạo vừa phải

    // Nếu người dùng bấm "Đánh giá" (isAssessment = true), ép AI đổi vai và trả về JSON
    if (isAssessment) {
      systemInstruction = `Bạn là một chuyên gia khảo thí ngôn ngữ tiếng Nga. Dựa vào toàn bộ lịch sử đoạn hội thoại của học viên với chủ đề "${topic}", hãy đánh giá chi tiết năng lực của học viên. Trả về kết quả bằng tiếng Việt và PHẢI tuân thủ nghiêm ngặt cấu trúc JSON được cung cấp.`;
      responseMimeType = "application/json";
      temperature = 0.2; // Giảm độ sáng tạo để AI tập trung vào logic phân tích và xuất JSON chuẩn
      
      // Định nghĩa Schema khớp 100% với interface ChatAssessment của bạn
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          vocabulary: {
            type: Type.STRING,
            description: "Đánh giá chi tiết về vốn từ vựng mà học viên đã sử dụng trong hội thoại.",
          },
          intonation: {
            type: Type.STRING,
            description: "Nhận xét về ngữ pháp, cách hành văn (hoặc ngữ điệu nếu có data âm thanh).",
          },
          overall_level: {
            type: Type.STRING,
            description: "Đánh giá trình độ tổng quan theo khung CEFR (Ví dụ: A1, A2, B1, B2, C1, C2).",
          },
          general_feedback: {
            type: Type.STRING,
            description: "Nhận xét chung và đưa ra lời khuyên cụ thể giúp học viên cải thiện.",
          },
        },
        required: ["vocabulary", "intonation", "overall_level", "general_feedback"],
      };
    }

    // 3. Gọi Google Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        responseMimeType,
        responseSchema,
        temperature,
      },
    });

    const responseText = response.text;

    if (!responseText) {
      return NextResponse.json(
        { error: "AI không trả về nội dung đánh giá." },
        { status: 500 }
      );
    }

    // 4. Xử lý và trả về dữ liệu cho Client
    if (isAssessment) {
      try {
        // Parse JSON để đảm bảo dữ liệu trả về client là một Object đúng chuẩn ChatAssessment
        const assessmentData = JSON.parse(responseText);
        return NextResponse.json({ success: true, isAssessment: true, data: assessmentData });
      } catch (parseError) {
        console.error("Lỗi Parse JSON từ AI:", responseText);
        return NextResponse.json(
          { error: "AI không trả về đúng định dạng đánh giá." },
          { status: 500 }
        );
      }
    }

    // Nếu chỉ là chat bình thường
    return NextResponse.json({ success: true, isAssessment: false, data: responseText });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Lỗi API GenAI:", error.message);
      return NextResponse.json(
        { error: "Không thể kết nối với hệ thống AI, vui lòng thử lại." },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Lỗi hệ thống không xác định." }, { status: 500 });
  }
}