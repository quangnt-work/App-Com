// src/app/api/dictionary-lookup/route.ts
// Tra cứu từ điển AI — dùng Gemini 2.5 Flash
// Đảm bảo tạo bảng ngữ pháp chuẩn xác với cấu trúc tiếng Nga
// Chịu tải bằng GEMINI_SECONDARY_API_KEY và cơ chế Retry Exponential Backoff

import { NextResponse } from "next/server";
import { generateContentWithFallback, parseAIResponse } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { word } = body;

    if (!word || !word.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập từ cần tra cứu." }, { status: 400 });
    }

    const trimmedWord = word.trim();

    const prompt = `Bạn là từ điển Nga-Việt chuyên nghiệp, chính xác tuyệt đối. Hệ thống của bạn hoạt động như một cỗ máy tạo JSON. Tra cứu từ/cụm từ tiếng Nga: "${trimmedWord}"

QUY TẮC:
- Nếu input là tiếng Việt → dịch sang tiếng Nga rồi tra cứu từ tiếng Nga đó.
- russian_word luôn phải là TIẾNG NGA (chữ Cyrillic), dạng nguyên thể (với động từ) hoặc dạng số ít (với danh từ/tính từ).
- word_type phải chính xác là 1 trong các từ sau tiếng Nga: "существительное" (danh từ), "глагол" (động từ), "прилагательное" (tính từ), "наречие" (trạng từ), "предлог" (giới từ), "местоимение" (đại từ), "числительное" (số từ), "союз" (liên từ), "частица" (tiểu từ), "междометие" (thán từ).
- vietnamese_meaning: liệt kê các nghĩa chính, phân tách bằng dấu ";". Ví dụ: "đi; đi bộ; hoạt động".
- definition_usage: giải thích CHI TIẾT từng nghĩa, ngữ cảnh sử dụng, phạm vi sử dụng.
- examples: tạo 4 câu ví dụ đa dạng kèm dịch tiếng Việt.

QUY TẮC BẮT BUỘC CHO grammar_structure (phải là một MẢNG PHẲNG DUY NHẤT (flat array) chứa các object, không lồng ghép mảng con hay cú pháp không hợp lệ. Trả về đúng format như sau):

🔹 Nếu là ĐỘNG TỪ (глагол), lập danh sách các dòng liên tiếp để thể hiện các nhóm chia động từ:
[
  {"col1": "CHIA ĐỘNG TỪ", "col2": "THỜI HIỆN TẠI/TƯƠNG LAI", "col3": "THỜI QUÁ KHỨ"},
  {"col1": "я", "col2": "<hiện tại/tương lai>", "col3": "<quá khứ giống đực/cái>"},
  {"col1": "ты", "col2": "<hiện tại/tương lai>", "col3": "<quá khứ giống đực/cái>"},
  {"col1": "он/она/оно", "col2": "<hiện tại/tương lai>", "col3": "<quá khứ đực/cái/trung>"},
  {"col1": "мы", "col2": "<hiện tại/tương lai>", "col3": "<quá khứ số nhiều>"},
  {"col1": "вы", "col2": "<hiện tại/tương lai>", "col3": "<quá khứ số nhiều>"},
  {"col1": "они", "col2": "<hiện tại/tương lai>", "col3": "<quá khứ số nhiều>"},
  {"col1": "MỆNH LỆNH THỨC", "col2": "Số ít (<mệnh lệnh ít>)", "col3": "Số nhiều (<mệnh lệnh nhiều>)"},
  {"col1": "TÍNH ĐỘNG TỪ CHỦ ĐỘNG", "col2": "Chủ động hiện tại: <tính động từ chủ động hiện tại>", "col3": "Chủ động quá khứ: <tính động từ chủ động quá khứ>"},
  {"col1": "TÍNH ĐỘNG TỪ BỊ ĐỘNG", "col2": "Bị động hiện tại: <tính động từ bị động hiện tại>", "col3": "Bị động quá khứ: <tính động từ bị động quá khứ>"},
  {"col1": "TRẠNG ĐỘNG TỪ", "col2": "Thể chưa hoàn thành: <nếu có>", "col3": "Thể hoàn thành: <nếu có>"}
]

🔹 Nếu là TÍNH TỪ (прилагательное), lập danh sách các dòng liên tiếp:
[
  {"col1": "BIẾN ĐỔI THEO GIỐNG", "col2": "Số ít", "col3": "Số nhiều"},
  {"col1": "Мужской (Giống nam)", "col2": "<đuôi nam>", "col3": "<đuôi số nhiều>"},
  {"col1": "Женский (Giống nữ)", "col2": "<đuôi nữ>", "col3": ""},
  {"col1": "Средний (Giống trung)", "col2": "<đuôi trung>", "col3": ""},
  {"col1": "DẠNG NGẮN (краткая форма)", "col2": "<nếu có>", "col3": ""},
  {"col1": "SO SÁNH", "col2": "So sánh hơn: <dạng hơn>", "col3": "So sánh nhất: <dạng nhất>"}
]

🔹 Nếu là DANH TỪ (существительное), lập danh sách biến cách:
[
  {"col1": "BIẾN CÁCH", "col2": "Số ít", "col3": "Số nhiều"},
  {"col1": "Им. (chủ cách - ai/cái gì)", "col2": "<số ít>", "col3": "<số nhiều>"},
  {"col1": "Род. (sinh cách - của ai/cái gì)", "col2": "<số ít>", "col3": "<số nhiều>"},
  {"col1": "Дат. (tặng cách - cho ai/cái gì)", "col2": "<số ít>", "col3": "<số nhiều>"},
  {"col1": "Вин. (đối cách - thấy ai/cái gì)", "col2": "<số ít>", "col3": "<số nhiều>"},
  {"col1": "Твор. (công cụ - bằng/cùng ai/cái gì)", "col2": "<số ít>", "col3": "<số nhiều>"},
  {"col1": "Пред. (giới cách - về ai/cái gì)", "col2": "<số ít>", "col3": "<số nhiều>"}
]

🔹 Với các loại từ khác: grammar_structure = []

BẮT BUỘC TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON CHUẨN XÁC, KHÔNG GIẢI THÍCH (KHÔNG LỒNG MẢNG VÀO NHAU TRÁI CÚ PHÁP):
{
  "russian_word": "từ tiếng Nga",
  "vietnamese_meaning": "các nghĩa phân tách bằng dấu ;",
  "word_type": "loại từ bằng tiếng Nga",
  "phonetic": "phiên âm [...]",
  "definition_usage": "giải thích",
  "examples": [
    { "ru": "câu ru 1", "vn": "vn 1" },
    { "ru": "câu ru 2", "vn": "vn 2" },
    { "ru": "câu ru 3", "vn": "vn 3" },
    { "ru": "câu ru 4", "vn": "vn 4" }
  ],
  "grammar_structure": [
    { "col1": "...", "col2": "...", "col3": "..." }
  ]
}`;

    // generateContentWithFallback đã bao gồm logic Exponential Backoff & Key Rotation
    const response = await generateContentWithFallback({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    }, "gemini-3.1-flash-lite");

    const wordData = parseAIResponse(response.text);

    const result = {
      id: `ai-${Date.now()}`,
      topic_slug: "ai-search",
      russian_word: wordData.russian_word || trimmedWord,
      vietnamese_meaning: wordData.vietnamese_meaning || "",
      word_type: wordData.word_type || "",
      phonetic: wordData.phonetic || null,
      definition_usage: wordData.definition_usage || null,
      examples: Array.isArray(wordData.examples) ? wordData.examples : [],
      grammar_structure: Array.isArray(wordData.grammar_structure) ? wordData.grammar_structure : [],
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi không xác định";
    console.error("Lỗi dictionary-lookup API:", msg);
    return NextResponse.json(
      { error: "Không thể tra cứu. " + msg },
      { status: 500 }
    );
  }
}
