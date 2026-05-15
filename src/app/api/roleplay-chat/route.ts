import { NextResponse } from "next/server";
import { ChatMessageType } from "@/types/ai-chat";
import { generateContentWithFallback } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { messages, context, ai_role, objectives } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages không hợp lệ" }, { status: 400 });
    }

    // Build list of objectives for the prompt
    const objectivesList = objectives.map((obj: any) => `- [${obj.id}]: ${obj.description}`).join('\n');

    // Build conversation history
    const conversation = messages.map((m: ChatMessageType) => `${m.role === 'user' ? 'Học viên' : ai_role}: ${m.content}`).join('\n');

    const systemPrompt = `Bạn là hệ thống điều khiển AI trong trò chơi nhập vai (Roleplay) luyện tiếng Nga.
Bối cảnh: ${context}
Vai của bạn: ${ai_role}
Nhiệm vụ của học viên cần hoàn thành:
${objectivesList}

Lịch sử trò chuyện:
${conversation}

Nhiệm vụ của bạn:
1. Đóng vai "${ai_role}" và phản hồi lại câu nói cuối cùng của Học viên bằng TIẾNG NGA. Phản hồi phải tự nhiên, đúng ngữ cảnh và đúng vai. Chỉ nói tiếng Nga trong phần phản hồi.
2. Kiểm tra xem trong toàn bộ lịch sử trò chuyện, Học viên đã hoàn thành những nhiệm vụ nào trong danh sách trên. (Đã nói đúng ý, hỏi đúng câu, hoặc đạt được mục đích).

TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON CHUẨN XÁC:
{
  "reply": "Câu trả lời của bạn bằng tiếng Nga",
  "completed_objectives": ["obj1", "obj3"] // Danh sách các ID nhiệm vụ mà học viên ĐÃ hoàn thành tính tới thời điểm hiện tại.
}`;

    const response = await generateContentWithFallback({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    }, "gemini-3.1-flash-lite");

    const responseText = response.text?.trim();
    if (!responseText) throw new Error("Gemini không trả về nội dung.");

    const data = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      reply: data.reply,
      completed_objectives: data.completed_objectives || []
    });

  } catch (error: any) {
    console.error("Lỗi Roleplay API:", error);
    return NextResponse.json(
      { error: "Lỗi khi xử lý phản hồi từ AI." },
      { status: 500 }
    );
  }
}
