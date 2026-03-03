export interface Sentence {
  id: string;
  topic_slug: string;
  russian_text: string;
  phonetic: string;
  vietnamese_text: string;
  created_at?: string;
}

export interface EvaluationResult {
  score: number;
  tip: string;
}