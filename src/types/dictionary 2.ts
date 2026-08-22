// src/types/dictionary.ts

export interface ExampleSentence {
  ru: string;
  vn: string;
}

export interface GrammarCol {
  col1: string;
  col2: string;
  col3: string;
}

export interface DictionaryWord {
  id: string;
  topic_slug: string;
  russian_word: string;
  vietnamese_meaning: string;
  word_type: string;
  phonetic: string | null;
  definition_usage: string | null;
  examples: ExampleSentence[];
  grammar_structure: GrammarCol[];
  created_at: string;
}