import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Khởi tạo SDK mới của Google
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    const targetText = formData.get('targetText') as string;

    if (!audioFile || !targetText) {
      return NextResponse.json({ error: 'Thiếu file âm thanh hoặc câu mẫu' }, { status: 400 });
    }

    // Chuyển file audio thành Base64 để gửi cho Gemini
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');
    const mimeType = audioFile.type || 'audio/webm';

    const prompt = `Bạn là giáo viên dạy phát âm tiếng Nga. Hãy nghe đoạn ghi âm sau. 
    Học viên đang cố gắng đọc câu này: "${targetText}".
    Hãy đánh giá cách phát âm của họ từ thang điểm 1 đến 10.
    Trả về KẾT QUẢ DUY NHẤT bằng một chuỗi JSON có định dạng như sau:
    { "score": 8, "tip": "Nhận xét/mẹo sửa lỗi ngắn gọn bằng tiếng Việt" }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Đã cập nhật sang model mới nhất
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Audio, mimeType: mimeType } },
            { text: prompt }
          ]
        }
      ],
      config: {
        // Tính năng mới: Ép AI luôn luôn trả về chuẩn JSON
        responseMimeType: "application/json", 
      }
    });

    const aiText = response.text || "{}";
    
    // Vì đã bật responseMimeType JSON, ta có thể parse thẳng một cách an toàn
    const result = JSON.parse(aiText);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error("Lỗi chấm điểm AI:", error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi chấm điểm' }, { status: 500 });
  }
}