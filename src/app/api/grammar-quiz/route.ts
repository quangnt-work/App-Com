// src/app/api/grammar-quiz/route.ts
// Dùng Gemini 2.0 Flash gen 20 câu trắc nghiệm ngữ pháp tiếng Nga
// Mỗi lần gọi sẽ gen câu khác nhau nhờ temperature + prompt "random"

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GrammarQuizRequest {
  topic: string;
  count?: number;
}

export async function POST(request: Request) {
  try {
    const body: GrammarQuizRequest = await request.json();
    const { topic, count = 20 } = body;

    if (!topic) {
      return NextResponse.json({ error: "Thiếu chủ đề." }, { status: 400 });
    }

    // Tạo seed ngẫu nhiên để đảm bảo mỗi lần gen khác nhau
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();

    const prompt = `Bạn là chuyên gia ngôn ngữ Nga. Hãy tạo ${count} câu hỏi trắc nghiệm ngữ pháp tiếng Nga về chủ đề "${topic}".

YÊU CẦU BẮT BUỘC:
1. Phân bổ đều 4 cấp độ: 5 câu A1, 5 câu A2, 5 câu B1, 5 câu B2
2. Mỗi câu có 4 đáp án, chỉ 1 đáp án đúng
3. Câu hỏi phải đa dạng: chia động từ, giới từ, cách (падеж), giới tính, số nhiều, trật tự từ, liên từ...
4. Đáp án sai phải hợp lý (lỗi thường gặp của người học)
5. Giải thích bằng tiếng Việt, ngắn gọn, có kèm quy tắc ngữ pháp
6. Câu hỏi bằng tiếng Nga, đáp án bằng tiếng Nga
7. KHÔNG được lặp lại câu hỏi — sử dụng seed "${randomSeed}" và timestamp ${timestamp} để đảm bảo tính ngẫu nhiên
8. Sắp xếp xen kẽ level: không gom tất cả A1 rồi đến A2

BẮT BUỘC trả về JSON array với đúng format sau:
[
  {
    "id": 1,
    "question": "Câu hỏi tiếng Nga",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correctIndex": 0,
    "explanation": "Giải thích tiếng Việt",
    "level": "A1"
  }
]`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.9, // Cao để đảm bảo câu hỏi khác nhau mỗi lần
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      return NextResponse.json({ error: "AI không trả về nội dung." }, { status: 500 });
    }

    const questions = JSON.parse(responseText);

    // Validate cơ bản
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "AI trả về format sai." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: questions });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi không xác định";
    console.error("Lỗi grammar-quiz API:", msg);
    return NextResponse.json(
      { error: "Không thể tạo câu hỏi, vui lòng thử lại." },
      { status: 500 }
    );
  }
}
