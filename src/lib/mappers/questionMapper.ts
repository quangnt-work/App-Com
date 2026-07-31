export function groupQuestionsForDisplay(questions: any[]): any[] {
  const groupedQuestions: any[] = [];
  let currentReadingGroup: any = null;

  // Pass 1: Group reading questions
  for (const q of questions) {
    if (q.question_type === 'reading_mcq') {
      if (currentReadingGroup && currentReadingGroup.passage === q.passage) {
        currentReadingGroup.sub_questions.push({
          question: q.question,
          selection_mode: q.selection_mode,
          options: q.options,
          correct_indexes: q.correct_indexes,
          explanation: q.explanation,
        });
      } else {
        if (currentReadingGroup) {
          groupedQuestions.push(currentReadingGroup);
        }
        currentReadingGroup = {
          question_type: 'reading_group',
          passage: q.passage,
          instruction: q.instruction,
          sub_questions: [{
            question: q.question,
            selection_mode: q.selection_mode,
            options: q.options,
            correct_indexes: q.correct_indexes,
            explanation: q.explanation,
          }],
        };
      }
    } else {
      if (currentReadingGroup) {
        groupedQuestions.push(currentReadingGroup);
        currentReadingGroup = null;
      }
      groupedQuestions.push(q);
    }
  }
  if (currentReadingGroup) {
    groupedQuestions.push(currentReadingGroup);
  }

  // Pass 2: Group listening questions
  const finalGroupedQuestions: any[] = [];
  let currentListeningGroup: any = null;

  for (const q of groupedQuestions) {
    if (q.question_type === 'listening_mcq' && q.audio_url) {
      if (currentListeningGroup && currentListeningGroup.audio_url === q.audio_url) {
        currentListeningGroup.sub_questions.push({
          question: q.question,
          selection_mode: q.selection_mode,
          options: q.options,
          correct_indexes: q.correct_indexes,
          explanation: q.explanation,
        });
      } else {
        if (currentListeningGroup) finalGroupedQuestions.push(currentListeningGroup);
        currentListeningGroup = {
          question_type: 'listening_group',
          audio_url: q.audio_url,
          instruction: q.instruction,
          sub_questions: [{
            question: q.question,
            selection_mode: q.selection_mode,
            options: q.options,
            correct_indexes: q.correct_indexes,
            explanation: q.explanation,
          }]
        };
      }
    } else {
      if (currentListeningGroup) {
        finalGroupedQuestions.push(currentListeningGroup);
        currentListeningGroup = null;
      }
      finalGroupedQuestions.push(q);
    }
  }
  if (currentListeningGroup) {
    finalGroupedQuestions.push(currentListeningGroup);
  }

  return finalGroupedQuestions;
}

export function flattenQuestionsForDb(questions: any[]): any[] {
  const flatQuestions: any[] = [];
  if (!questions) return flatQuestions;

  for (const q of questions) {
    if (q.question_type === 'reading_group') {
      for (const sub of q.sub_questions) {
        flatQuestions.push({
          question_type: 'reading_mcq',
          passage: q.passage,
          instruction: q.instruction,
          question: sub.question,
          selection_mode: sub.selection_mode,
          options: sub.options,
          correct_indexes: sub.correct_indexes,
          explanation: sub.explanation
        });
      }
    } else if (q.question_type === 'listening_group') {
      for (const sub of q.sub_questions) {
        flatQuestions.push({
          question_type: 'listening_mcq',
          audio_url: q.audio_url,
          instruction: q.instruction,
          question: sub.question,
          selection_mode: sub.selection_mode,
          options: sub.options,
          correct_indexes: sub.correct_indexes,
          explanation: sub.explanation
        });
      }
    } else {
      flatQuestions.push(q);
    }
  }

  return flatQuestions;
}
