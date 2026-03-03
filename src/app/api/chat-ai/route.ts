// src/app/api/chat-ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { ChatRequestBody, GeminiContent } from "@/types/ai-chat";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, topic, isAssessment } = body;

    // ==========================================
    // LOGIC 1: ĐÁNH GIÁ KHI KẾT THÚC HỘI THOẠI
    // ==========================================
    if (isAssessment) {
      const prompt = `Dựa trên lịch sử hội thoại sau đây về chủ đề "${topic}", hãy đưa ra nhận xét chi tiết cho sinh viên bằng tiếng Việt.
      Lịch sử: ${JSON.stringify(messages)}
      Trả về KẾT QUẢ DUY NHẤT bằng một chuỗi JSON chuẩn xác có định dạng như sau:
      { 
        "vocabulary": "Nhận xét chi tiết về từ vựng", 
        "intonation": "Nhận xét về ngữ pháp và câu cú", 
        "overall_level": "A1 / A2 / B1 / B2", 
        "general_feedback": "Lời khuyên tổng quan" 
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const aiText = response.text || "{}";
      const result = JSON.parse(aiText) as Record<string, string>;
      
      return NextResponse.json(result);
    }

    // ==========================================
    // LOGIC 2: BẮT ĐẦU HOẶC TIẾP TỤC TRÒ CHUYỆN
    // ==========================================
    
    // Khai báo mảng với Type rõ ràng thay vì any[]
    let formattedContents: GeminiContent[] = [];

    if (messages.length === 0) {
      // Prompt mở đầu: Viết hoàn toàn bằng tiếng Nga hoặc yêu cầu cực kỳ ngắn gọn
      formattedContents = [
        {
          role: 'user',
          parts: [{ text: `Hãy bắt đầu cuộc trò chuyện về chủ đề "${topic}". Nhớ tuân thủ tuyệt đối System Instruction: Chỉ dùng tiếng Nga, 1-2 câu.` }]
        }
      ];
    } else {
      formattedContents = messages.map((msg): GeminiContent => ({
        role: msg.role === 'model' ? 'model' : 'user', 
        parts: [{ text: msg.content }]
      }));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents as any,
      config: {
        // SYSTEM INSTRUCTION: Đây là "vòng kim cô" ép AI tuân thủ luật chơi
        systemInstruction: `Bạn là người Nga bản xứ đang chat với người học tiếng Nga. 
        Luật bắt buộc:
        1. CHỈ sử dụng tiếng Nga. Tuyệt đối KHÔNG sử dụng tiếng Việt.
        2. KHÔNG giải thích, KHÔNG dịch nghĩa, KHÔNG nói các câu như "Đây là câu trả lời của tôi".
        3. Văn phong chat tự nhiên, ngắn gọn (1 đến 3 câu tối đa).
        4. Luôn kết thúc bằng một câu hỏi để duy trì cuộc hội thoại.`,
      }
    });

    return NextResponse.json({ content: response.text });
    
  // 3. Sử dụng 'unknown' thay cho 'any' trong khối catch
  } catch (error: unknown) {
    console.error("Lỗi API Chat AI:", error);
    
    // Kiểm tra an toàn xem error có phải là một Error object không
    const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
    
    return NextResponse.json(
      { error: `Lỗi Server: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}