import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateContentWithFallback, parseAIResponse } from "@/lib/gemini";
import { EdgeTTS } from "node-edge-tts";
import os from "os";
import fs from "fs";
import path from "path";
import { z } from "zod";

const GenerateSchema = z.object({
  topicName: z.string(),
  description: z.string().optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]),
});

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // (Tuỳ chọn: Kiểm tra user có phải Admin không ở đây)

    const body = await request.json();
    const parsed = GenerateSchema.parse(body);
    const { topicName, description, level } = parsed;

    // 2. Call Gemini to generate the script
    let expectedSentences = 30;
    if (level === "B1") expectedSentences = 25;
    else if (level === "B2") expectedSentences = 22;
    else if (level === "C1") expectedSentences = 15;

    const prompt = `Bạn là một chuyên gia ngôn ngữ học tiếng Nga. Hãy tạo một kịch bản giao tiếp Shadowing theo chủ đề: "${topicName}" ở trình độ ${level}.
Quy tắc cực kỳ nghiêm ngặt:

1. Về số lượng câu dựa trên trình độ:
   - Cần sinh đúng ${expectedSentences} câu.

2. Về độ dài và độ khó của câu (Tăng dần mức độ):
   - Không sinh các câu quá ngắn (như "Да", "Нет", "Привет"). Mỗi câu phải đủ ngữ cảnh để luyện ngữ điệu.
   - A1/A2: 5-8 từ/câu. Từ vựng thông dụng.
   - B1: 8-12 từ/câu. Có mệnh đề phụ.
   - B2: 12-18 từ/câu. Thành ngữ, từ vựng chuyên ngành, cấu trúc phức tạp.
   - C1: 15-25 từ/câu. Ngôn ngữ học thuật, nói lóng, ẩn dụ, câu ghép lồng nhau.

Trả về kết quả 100% dưới định dạng JSON array: 
[ { "ru": "Câu tiếng Nga", "vi": "Nghĩa tiếng Việt" } ]`;

    const response = await generateContentWithFallback(
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.7, // Sáng tạo hơn một chút
        },
      },
      "gemini-3.1-flash-lite" // Sử dụng flash-lite hoặc model đang hoạt động trên hệ thống
    );

    const sentences: Array<{ ru: string; vi: string }> = parseAIResponse(response.text);

    if (!Array.isArray(sentences) || sentences.length === 0) {
      throw new Error("AI trả về dữ liệu không hợp lệ.");
    }

    // 3. Khởi tạo Topic trong DB
    const { data: topicData, error: topicError } = await supabase
      .from("shadowing_topics")
      .insert({
        title: topicName,
        description: description || `Luyện tập Shadowing chủ đề ${topicName}`,
        level: level,
      })
      .select()
      .single();

    if (topicError) throw topicError;

    const topicId = topicData.id;
    const tts = new EdgeTTS({ voice: "ru-RU-DmitryNeural", lang: "ru-RU" });
    const generatedSentences = [];

    // 4. Sinh Audio và Lưu từng câu
    // Xử lý tuần tự để không làm quá tải Edge TTS hoặc Supabase Storage
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const tmpPath = path.join(os.tmpdir(), `tts-admin-${Date.now()}-${i}.mp3`);
      
      try {
        // Sinh file MP3
        await tts.ttsPromise(sentence.ru, tmpPath);
        const audioBuffer = fs.readFileSync(tmpPath);
        
        // Tên file trên Storage
        const fileName = `${topicId}/${i + 1}-${Date.now()}.mp3`;

        // Upload lên Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("shadowing_audio")
          .upload(fileName, audioBuffer, {
            contentType: "audio/mpeg",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Lấy public URL
        const { data: publicUrlData } = supabase.storage
          .from("shadowing_audio")
          .getPublicUrl(fileName);

        const audioUrl = publicUrlData.publicUrl;

        // Lưu vào DB
        const { data: sentenceData, error: sentenceError } = await supabase
          .from("shadowing_sentences")
          .insert({
            topic_id: topicId,
            order_index: i + 1,
            ru: sentence.ru,
            vi: sentence.vi,
            audio_url: audioUrl,
          })
          .select()
          .single();

        if (sentenceError) throw sentenceError;
        
        generatedSentences.push(sentenceData);

      } catch (err) {
        console.error(`Lỗi ở câu ${i + 1}:`, err);
        // Có thể chọn continue hoặc break tùy vào business rule. Ở đây ta continue để sinh các câu khác.
      } finally {
        // Dọn dẹp file rác
        if (fs.existsSync(tmpPath)) {
          fs.unlinkSync(tmpPath);
        }
      }
    }

    return NextResponse.json({
      success: true,
      topic: topicData,
      sentences: generatedSentences,
      message: `Đã sinh thành công ${generatedSentences.length}/${sentences.length} câu.`,
    });

  } catch (error: any) {
    console.error("Admin Generate Error:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi hệ thống khi sinh kịch bản." },
      { status: 500 }
    );
  }
}
