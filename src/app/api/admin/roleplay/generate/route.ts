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

    const { level, topic } = await request.json();

    if (!level || !topic) {
      return NextResponse.json({ error: "Thiếu cấp độ (level) hoặc chủ đề (topic)." }, { status: 400 });
    }

    const normalizedTopic = topic.trim().toLowerCase();

    // 1. Kiểm tra số lượng kịch bản đã tồn tại cho topic này
    const { data: existingScenarios } = await supabase
      .from('roleplay_scenarios')
      .select('level, title, context')
      .ilike('topic_keyword', normalizedTopic);

    const existingCount = existingScenarios ? existingScenarios.length : 0;
    
    // Đánh giá cấp độ (A2=1, B1=2, B2=3, C1=4)
    const levelWeight: Record<string, number> = { 'A2': 1, 'B1': 2, 'B2': 3, 'C1': 4 };
    const objectiveCount: Record<string, number> = { 'A2': 5, 'B1': 7, 'B2': 10, 'C1': 13 };
    const requestedWeight = levelWeight[level] || 1;
    const requiredObjectives = objectiveCount[level] || 5;
    
    let maxExistingWeight = 0;
    let existingContextsText = "";
    
    if (existingCount > 0) {
      existingContextsText = existingScenarios!
        .map((s, i) => `Kịch bản ${i + 1} (${s.level}): ${s.title} - ${s.context}`)
        .join('\n');
        
      existingScenarios!.forEach(s => {
        const w = levelWeight[s.level] || 1;
        if (w > maxExistingWeight) maxExistingWeight = w;
      });
    }

    // 2. Xử lý Logic Giới hạn (Limit & Expansion)
    let aiInstruction = "";
    
    if (existingCount >= 3) {
      // Đã có 3 kịch bản -> Ép tạo cốt truyện mở rộng (Phần tiếp theo) ở cấp độ cao hơn
      if (requestedWeight <= maxExistingWeight && requestedWeight < 3) {
         return NextResponse.json({ 
           error: `Chủ đề "${topic}" đã đạt giới hạn 3 kịch bản. Để tránh nhàm chán, hãy chọn cấp độ khó hơn (VD: ${maxExistingWeight === 1 ? 'B1 hoặc B2' : 'B2'}) để AI tạo phần tiếp theo của câu chuyện.` 
         }, { status: 400 });
      }
      
      aiInstruction = `ĐÂY LÀ PHẦN TIẾP THEO (EXPANSION) CỦA CÂU CHUYỆN.
Các phần trước đã xảy ra như sau:
${existingContextsText}

YÊU CẦU ĐẶC BIỆT:
- KHÔNG lặp lại các tình huống cũ. 
- Hãy tạo một rắc rối/diễn biến mới phức tạp hơn nối tiếp các sự kiện trên ở cấp độ ${level}.
- Trường "context" trả về: Câu đầu tiên PHẢI tóm tắt ngắn gọn việc học viên đã vượt qua phần trước, sau đó mới nêu bối cảnh của thử thách hiện tại (ví dụ: "Sau khi bạn đã mua hàng xong, khi ra cửa thì bảo vệ bất ngờ chặn lại...").`;

    } else if (existingCount > 0) {
      // Dưới 3 kịch bản -> Cho phép tạo mới nhưng ép tránh trùng lặp
      aiInstruction = `CẢNH BÁO TRÁNH TRÙNG LẶP:
Chủ đề này đã có các kịch bản sau:
${existingContextsText}

YÊU CẦU ĐẶC BIỆT:
- Kịch bản bạn tạo ra phải có BỐI CẢNH VÀ VẤN ĐỀ HOÀN TOÀN KHÁC BIỆT so với các kịch bản trên.`;
    }

    // Seed và Timestamp để tránh AI lặp lại kịch bản
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();

    const systemPrompt = `Bạn là chuyên gia ngôn ngữ Nga (CEFRL) và là một Master Game Designer.
Nhiệm vụ của bạn là tạo ra một kịch bản Roleplay (Nhập vai giao tiếp) tiếng Nga.

THÔNG TIN ĐẦU VÀO:
- Trình độ: ${level} (CEFRL: A2, B1, B2, C1)
- Chủ đề: ${topic}
- Số mục tiêu bắt buộc: ${requiredObjectives}
- Random Seed: ${randomSeed}-${timestamp} (để đảm bảo không bao giờ trùng lặp kịch bản)

QUY TẮC SINH TÌNH HUỐNG (STRICT RULES):
1. ĐỘ KHÓ & TỪ VỰNG:
   - Nếu là A2: Tình huống đơn giản, giao tiếp sinh tồn (hỏi đường, mua bán, chào hỏi). Câu ngắn, từ vựng cơ bản.
   - Nếu là B1: Tình huống có một chút vấn đề/rắc rối nhẹ cần giải quyết (đổi trả hàng lỗi, giải thích lý do đi muộn). Cần dùng câu ghép, liên từ.
   - Nếu là B2: Tình huống phức tạp, có sự đối kháng hoặc tranh luận (đàm phán lương, phàn nàn dịch vụ tồi tệ, tranh cãi với hàng xóm). Đòi hỏi khả năng thuyết phục, bảo vệ quan điểm.
   - Nếu là C1: Tình huống chuyên sâu, trừu tượng hoặc đa lớp (tranh luận học thuật, thuyết trình dự án, xử lý khủng hoảng truyền thông, đàm phán hợp đồng quốc tế). Đòi hỏi sử dụng thành ngữ, cấu trúc phức tạp, và khả năng lập luận logic chặt chẽ.
2. NHÂN VẬT AI (ai_role): Phải là một nhân vật cụ thể (ví dụ: "Nhân viên an ninh sân bay khó tính", "Chủ nhà đang tức giận", "Bồi bàn thân thiện").
3. LỜI MỞ ĐẦU (first_message): Phải hoàn toàn bằng tiếng Nga. Nếu là B1/B2/C1, câu mở đầu nên tạo ra một rào cản hoặc câu hỏi mở buộc học viên phải giải thích dài.
4. MỤC TIÊU (objectives): Tạo CHÍNH XÁC ${requiredObjectives} mục tiêu (A2=5, B1=7, B2=10, C1=13). KHÔNG được tạo ít hơn hoặc nhiều hơn.
5. GỢI Ý (hints):
   - hint_vi: Ý nghĩa gợi ý bằng tiếng Việt.
   - hint_ru: Câu trả lời mẫu bằng tiếng Nga (phải đúng cấp độ ngữ pháp ${level}).

${aiInstruction}

ĐẦU RA BẮT BUỘC (Trả về ĐÚNG định dạng JSON sau, KHÔNG thêm markdown):
{
  "title": "Tên kịch bản (tiếng Việt, ngắn gọn)",
  "context": "Bối cảnh chi tiết (tiếng Việt). Ví dụ: Bạn đang ở... Mục đích của bạn là...",
  "ai_role": "Vai trò của AI (tiếng Việt)",
  "first_message": "Câu mở đầu của AI (Tiếng Nga)",
  "objectives": [
    {
      "id": "obj1",
      "description": "Mô tả nhiệm vụ (tiếng Việt)",
      "hint_vi": "Gợi ý nghĩa tiếng Việt",
      "hint_ru": "Gợi ý câu tiếng Nga"
    }
  ]
}`;

    const response = await generateContentWithFallback({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.9, // Cao để tăng tính sáng tạo và đa dạng
      },
    }, "gemini-3.1-flash-lite");

    const scenario = parseAIResponse(response.text);

    // Validate cơ bản
    if (!scenario || !scenario.title || !scenario.objectives || !Array.isArray(scenario.objectives)) {
      return NextResponse.json({ error: "AI trả về format sai." }, { status: 500 });
    }

    // Tự động generate ID cho các objectives nếu AI quên
    scenario.objectives = scenario.objectives.map((obj: any, index: number) => ({
      ...obj,
      id: obj.id || `obj${index + 1}`
    }));

    // Lưu vào Database
    const { data: dbData, error: dbError } = await supabase
      .from('roleplay_scenarios')
      .insert({
        level: level,
        topic_keyword: normalizedTopic,
        title: scenario.title,
        context: scenario.context,
        ai_role: scenario.ai_role,
        first_message: scenario.first_message,
        objectives: scenario.objectives
      })
      .select('id')
      .single();

    if (dbError) {
      console.error("Lỗi insert roleplay_scenarios:", dbError);
      return NextResponse.json({ error: "Lưu kịch bản thất bại." }, { status: 500 });
    }

    // Gắn id của DB vào data trả về
    scenario.id = dbData.id;

    return NextResponse.json({ success: true, data: scenario });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi không xác định";
    console.error("Lỗi generate-roleplay API:", msg);
    return NextResponse.json(
      { error: "Không thể tạo kịch bản, vui lòng thử lại." },
      { status: 500 }
    );
  }
}
