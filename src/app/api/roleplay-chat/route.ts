import { NextResponse } from "next/server";
import { ChatMessageType } from "@/types/ai-chat";
import { generateContentWithFallback, parseAIResponse } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, context, ai_role, objectives } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages không hợp lệ" }, { status: 400 });
    }

    // Build list of objectives for the prompt
    const objectivesList = objectives.map((obj: { id: string; description: string }) => `- [${obj.id}]: ${obj.description}`).join('\n');

    // Build conversation history (giới hạn 20 tin nhắn gần nhất)
    const recentMessages = messages.slice(-20);
    const conversation = recentMessages.map((m: ChatMessageType) => `${m.role === 'user' ? 'Học viên' : ai_role}: ${m.content}`).join('\n');

    const systemPrompt = `Bạn là hệ thống điều khiển AI trong trò chơi nhập vai (Roleplay) luyện tiếng Nga.
Bối cảnh: ${context}
Vai của bạn: ${ai_role}
Nhiệm vụ của học viên cần hoàn thành:
${objectivesList}

Lịch sử trò chuyện:
${conversation}

Nhiệm vụ của bạn:
1. Đóng vai "${ai_role}" và phản hồi lại câu nói cuối cùng của Học viên bằng TIẾNG NGA. Phản hồi phải tự nhiên, đúng ngữ cảnh và đúng vai. Chỉ nói tiếng Nga trong phần phản hồi (reply).
2. Dịch phần phản hồi tiếng Nga sang tiếng Việt (reply_vi).
3. Kiểm tra xem trong toàn bộ lịch sử trò chuyện, Học viên đã hoàn thành những nhiệm vụ nào trong danh sách trên.
4. Nếu câu nói cuối cùng của Học viên có lỗi ngữ pháp hoặc dùng từ sai, hãy sửa lỗi và giải thích ngắn gọn bằng tiếng Việt. Nếu không có lỗi, để trường correction là null.

TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON CHUẨN XÁC:
{
  "reply": "Câu trả lời của bạn bằng tiếng Nga",
  "reply_vi": "Bản dịch tiếng Việt của reply",
  "completed_objectives": ["obj1", "obj3"],
  "correction": "Sửa lỗi: ... → ... (giải thích ngắn)" 
}

Lưu ý:
- correction phải là null nếu câu của học viên không có lỗi.
- reply_vi phải là bản dịch trung thành của reply.
- completed_objectives chứa tất cả ID đã hoàn thành tính tới thời điểm hiện tại.`;

    const response = await generateContentWithFallback({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    }, "gemini-3.1-flash-lite");

    const data = parseAIResponse(response.text);

    return NextResponse.json({
      success: true,
      reply: data.reply,
      reply_vi: data.reply_vi || null,
      completed_objectives: data.completed_objectives || [],
      correction: data.correction || null,
    });

  } catch (error: any) {
    console.error("Lỗi Roleplay API:", error);
    return NextResponse.json(
      { error: "Lỗi khi xử lý phản hồi từ AI." },
      { status: 500 }
    );
  }
}
