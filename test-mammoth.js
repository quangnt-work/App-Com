// Quick test to verify the fix works on the actual A2 file
const mammoth = require("mammoth");
const path = require("path");

// Replicate the preprocessText + parser logic
function preprocessText(text) {
  let processed = text.replace(
    /([^\n])([А-ЕA-Eа-е]\s*[.):]\s*)/g,
    (match, before, optionPart) => {
      if (/\s/.test(before)) return match;
      return before + "\n" + optionPart;
    }
  );
  processed = processed.replace(
    /([^\n\d])(\d+\s*[.):]\s*)/g,
    (match, before, numPart) => {
      if (/\s/.test(before)) return match;
      return before + "\n" + numPart;
    }
  );
  return processed;
}

const QUESTION_START_RE = /^\s*(?:Câu|Question|Bài)?\s*(\d+)\s*[.:)]\s*(.+)/i;
const OPTION_LINE_RE = /^\s*([А-ЕA-Eа-е])\s*[.:)]\s*(.+)/;

function parseQuestionsFromText(text) {
  const processedText = preprocessText(text);
  const lines = processedText.split(/\r?\n/);
  const questions = [];
  let current = null;
  let autoQuestionNumber = 1;
  let pendingText = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const qMatch = line.match(QUESTION_START_RE);
    if (qMatch) {
      if (current && current.options.length > 0) questions.push(current);
      const parsedNum = parseInt(qMatch[1], 10);
      autoQuestionNumber = parsedNum + 1;
      current = { number: parsedNum, question: qMatch[2].trim(), options: [], optionLabels: [] };
      pendingText = [];
      continue;
    }

    const optMatch = line.match(OPTION_LINE_RE);
    if (optMatch) {
      const label = optMatch[1];
      const isFirstOption = label.toUpperCase() === 'A' || label === 'А' || label === 'а';
      if (current && current.options.length > 0 && isFirstOption) {
        questions.push(current);
        current = null;
      }
      if (!current) {
        const qText = pendingText.length > 0 ? pendingText.join(" ") : "Missing";
        current = { number: autoQuestionNumber++, question: qText, options: [], optionLabels: [] };
        pendingText = [];
      }
      current.optionLabels.push(label);
      current.options.push(optMatch[2].trim());
      continue;
    }

    if (current && current.options.length === 0) {
      current.question += " " + line;
    } else if (current && current.options.length > 0) {
      pendingText.push(line);
    } else {
      pendingText.push(line);
    }
  }
  if (current && current.options.length >= 2) questions.push(current);
  return questions;
}

async function test() {
  // Test with A2 file
  const files = ["ngân hàng A2.docx", "ngân hàng A1.docx"];
  for (const f of files) {
    try {
      const fp = path.join(require("os").homedir(), "Desktop", f);
      const raw = await mammoth.extractRawText({ path: fp });
      const text = raw.value;
      
      console.log(`\n=== ${f} ===`);
      
      // Show first 300 chars of preprocessed text
      const processed = preprocessText(text);
      console.log("Preprocessed (first 500 chars):");
      console.log(processed.substring(0, 500));
      console.log("---");
      
      const questions = parseQuestionsFromText(text);
      console.log(`Parsed: ${questions.length} questions`);
      if (questions.length > 0) {
        console.log("Q1:", JSON.stringify(questions[0]));
        console.log("Q2:", JSON.stringify(questions[1]));
      }
    } catch (e) {
      console.log(`Skip ${f}: ${e.message}`);
    }
  }
}

test().catch(console.error);
