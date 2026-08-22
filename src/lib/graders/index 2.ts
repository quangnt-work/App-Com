import { generateContentWithFallback, parseAIResponse } from '@/lib/gemini';

export function parseOptions(q: any): any {
  try {
    if (typeof q.options === 'string') return JSON.parse(q.options);
    return q.options || {};
  } catch { return {}; }
}

export const normalizeWords = (s: string) =>
  s.toLowerCase()
   .replace(/[.,!?;:«»"']/g, '')
   .trim()
   .split(/\s+/)
   .filter(Boolean);

export const stripQ = (s: string) => s.replace(/^[\s"'"«»]+|[\s"'"«»]+$/g, '').trim();

export function gradeMultipleChoice(parsedQ: any, userAnswer: string, weight: number) {
  let userSelections: any[] = [];
  try {
     userSelections = JSON.parse(userAnswer);
     if (!Array.isArray(userSelections)) userSelections = [userAnswer];
  } catch {
     userSelections = [userAnswer];
  }

  let qCorrectAnswer = '';
  let qIsCorrect = false;

  if (parsedQ.correct_indexes && Array.isArray(parsedQ.correct_indexes)) {
     qCorrectAnswer = parsedQ.correct_indexes.map((i: number) => parsedQ.options?.[i]).filter(Boolean).join(', ');
     const correctIdxs = [...parsedQ.correct_indexes].map(Number).sort();
     let userIdxs = userSelections.map(Number).filter(n => !isNaN(n)).sort();
     if (userIdxs.length === 0 && userSelections.length > 0) {
        userIdxs = userSelections.map(s => parsedQ.options.findIndex((o: string) => o.trim() === s.trim())).filter(i => i !== -1).sort();
     }
     qIsCorrect = correctIdxs.length > 0 && correctIdxs.length === userIdxs.length && correctIdxs.every((val, i) => val === userIdxs[i]);
  } else {
     qCorrectAnswer = parsedQ.correct_answer?.trim() || '';
     qIsCorrect = userSelections.includes(qCorrectAnswer) || userAnswer === qCorrectAnswer;
  }
  
  return { qCorrectAnswer, qIsCorrect, qEarned: qIsCorrect ? weight : 0, qAiFeedback: '' };
}

export function gradeWordArrangement(parsedQ: any, userAnswer: string, weight: number) {
  const qCorrectAnswer = parsedQ.correct_sentence?.trim() || '';
  const userWords = normalizeWords(userAnswer);
  const correctWords = normalizeWords(qCorrectAnswer);
  const qIsCorrect = userWords.length > 0 &&
    userWords.length === correctWords.length &&
    userWords.every((w, i) => w === correctWords[i]);
  return { qCorrectAnswer, qIsCorrect, qEarned: qIsCorrect ? weight : 0, qAiFeedback: '' };
}

export function gradeErrorCorrection(parsedQ: any, userAnswer: string, weight: number) {
  let userPairs: {wrong: string, correct: string}[] = [];
  try {
     userPairs = JSON.parse(userAnswer);
     if (!Array.isArray(userPairs)) throw new Error();
  } catch {
     const arr = userAnswer.split('||');
     userPairs = [{ wrong: arr[0] || '', correct: arr[1] || '' }];
  }

  const fullWrongRaw = stripQ(parsedQ.wrong_part?.trim() || '');
  const fullCorrectRaw = stripQ(parsedQ.correct_part?.trim() || '');
  const qCorrectAnswer = `"${fullWrongRaw}" → "${fullCorrectRaw}"`;
  
  const correctWrongParts = fullWrongRaw.split(',').map((s: string) => stripQ(s).toLowerCase()).filter(Boolean);
  const correctCorrectParts = fullCorrectRaw.split(',').map((s: string) => stripQ(s).toLowerCase()).filter(Boolean);
  const numTargets = Math.max(correctWrongParts.length, 1);
  const wPerTarget = weight / numTargets;
  let localEarned = 0;

  userPairs.forEach((pair) => {
     const uW = stripQ((pair.wrong || '').trim()).toLowerCase();
     const uC = stripQ((pair.correct || '').trim()).toLowerCase();
     if (!uW && !uC) return;
     let partial = 0;
     const mi = correctWrongParts.indexOf(uW);
     if (mi !== -1) {
        partial += 0.5;
        if (correctCorrectParts[mi] === uC) partial += 0.5;
     } else if (uW === fullWrongRaw.toLowerCase()) {
        partial += 0.5;
        if (uC === fullCorrectRaw.toLowerCase()) partial += 0.5;
     }
     localEarned += partial * wPerTarget;
  });

  const crRatio = Math.min(1, localEarned / weight);
  const qIsCorrect = crRatio === 1 ? true : crRatio > 0 ? null : false;
  const qAiFeedback = crRatio === 1 ? 'Đúng tuyệt đối.' : crRatio > 0 ? `Điểm thành phần: ${Math.round(crRatio * 100)}%.` : 'Sai hoàn toàn.';
  
  return { qCorrectAnswer, qIsCorrect, qEarned: crRatio * weight, qAiFeedback };
}

export function gradeFillInBlank(parsedQ: any, userAnswer: string, weight: number) {
  let isCorrect = false;
  let correctAnswer = parsedQ.correct_answer?.trim();
  if (parsedQ.correct_answers && Array.isArray(parsedQ.correct_answers)) {
     correctAnswer = parsedQ.correct_answers.join(', ');
     const n = userAnswer.toLowerCase();
     isCorrect = n === (parsedQ.correct_answers[0] || '').toLowerCase() ||
                 n === parsedQ.correct_answers.join(' ').toLowerCase() ||
                 n === parsedQ.correct_answers.join(', ').toLowerCase();
  } else if (correctAnswer) {
     isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
  }
  return { qCorrectAnswer: correctAnswer || '', qIsCorrect: isCorrect, qEarned: isCorrect ? weight : 0, qAiFeedback: '' };
}

export async function gradeEssayWithAI(parsedQ: any, questionText: string, userAnswer: string, weight: number) {
  let aiScoreRatio = 0.5;
  const sampleAnswer = parsedQ.sample_answer || parsedQ.correct_answer || 'Không có';
  const contextText = parsedQ.passage ? `\nĐoạn văn tham khảo:\n${parsedQ.passage}` : '';
  let qAiFeedback = '';

  try {
    const prompt = `Bạn là giáo viên ngoại ngữ. Hãy chấm câu trả lời tự luận của học sinh.
Hướng dẫn:
- So khớp các từ khoá và ý chính trong câu trả lời với đáp án gợi ý.
- Đánh giá mức độ đúng về ngữ nghĩa, không nhất thiết phải giống từng chữ.
- Nếu câu trả lời đúng ý nghĩa nhưng diễn đạt khác thì vẫn cho điểm cao.
- Nếu thiếu từ khoá quan trọng hoặc sai nghĩa thì trừ điểm.
- Thang điểm: 0-10.
- Trả về JSON thuần tuý duy nhất: {"score": <điểm_số_từ_0_đến_10>, "feedback": "<nhận xét ngắn gọn tiếng Việt>"}

Câu hỏi: ${questionText}${contextText}
Đáp án gợi ý: ${sampleAnswer}
Bài làm của học sinh: ${userAnswer}`;

    const response = await generateContentWithFallback({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    }, "gemini-3.1-flash-lite");

    const parsed = parseAIResponse(response.text, { score: 0, feedback: 'Đã chấm điểm.' });
    const score10 = Number(parsed.score) || 0;
    aiScoreRatio = Math.max(0, Math.min(10, score10)) / 10;
    qAiFeedback = parsed.feedback || 'Đã chấm điểm.';
  } catch (e) {
    console.error("Essay AI Grading Error:", e);
  }

  return { qCorrectAnswer: sampleAnswer, qIsCorrect: null, qEarned: weight * aiScoreRatio, qAiFeedback };
}

export async function evaluateQuestionAnswer(qType: string, parsedQ: any, questionText: string, userAnswer: string, weight: number) {
  if (['multiple_choice', 'reading_mcq', 'listening_mcq'].includes(qType)) {
    return gradeMultipleChoice(parsedQ, userAnswer, weight);
  }
  if (qType === 'word_arrangement') {
    return gradeWordArrangement(parsedQ, userAnswer, weight);
  }
  if (qType === 'error_correction') {
    return gradeErrorCorrection(parsedQ, userAnswer, weight);
  }
  if (['listening_fill', 'fill_in_blank'].includes(qType)) {
    return gradeFillInBlank(parsedQ, userAnswer, weight);
  }
  if (['essay', 'reading_open', 'listening_open'].includes(qType)) {
    return await gradeEssayWithAI(parsedQ, questionText, userAnswer, weight);
  }
  return { qCorrectAnswer: '', qIsCorrect: false, qEarned: 0, qAiFeedback: '' };
}
