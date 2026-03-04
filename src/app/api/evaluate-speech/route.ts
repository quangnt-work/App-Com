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


    const prompt = `Bạn là một giảng viên ngữ âm tại Đại học Tổng hợp Quốc gia Saint Petersburg. Hãy nghe đoạn ghi âm và đối chiếu với văn bản: '${targetText}'.
    Hãy chú ý kỹ:
    1. Trọng âm (Stress): Người Nga rất khắt khe về trọng âm.
    2. Biến âm: Các phụ âm đứng cuối từ có bị vô thanh hóa đúng cách không (vd: 'в' đọc thành 'ф')?
    3. Độ rung: Âm 'Р' có đủ độ rung không?
    Trả về JSON: { 'score': điểm/10.00, 'tip': 'nhận xét ngắn gọn bằng tiếng Việt' }`;

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
