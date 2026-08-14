export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      dictionary_words: {
        Row: {
          created_at: string
          definition_usage: string | null
          examples: Json | null
          grammar_structure: Json | null
          id: string
          phonetic: string | null
          russian_word: string
          topic_slug: string
          vietnamese_meaning: string
          word_type: string
        }
        Insert: {
          created_at?: string
          definition_usage?: string | null
          examples?: Json | null
          grammar_structure?: Json | null
          id?: string
          phonetic?: string | null
          russian_word: string
          topic_slug: string
          vietnamese_meaning: string
          word_type: string
        }
        Update: {
          created_at?: string
          definition_usage?: string | null
          examples?: Json | null
          grammar_structure?: Json | null
          id?: string
          phonetic?: string | null
          russian_word?: string
          topic_slug?: string
          vietnamese_meaning?: string
          word_type?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          file_size: string
          file_type: string
          file_url: string
          id: string
          lesson_id: string | null
          title: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_size: string
          file_type: string
          file_url: string
          id?: string
          lesson_id?: string | null
          title: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_size?: string
          file_type?: string
          file_url?: string
          id?: string
          lesson_id?: string | null
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_questions: {
        Row: {
          content: string
          correct_answer: string | null
          created_at: string
          difficulty: string | null
          exam_id: string | null
          explanation: string | null
          id: string
          media_url: string | null
          options: Json | null
          order_index: number | null
          parent_id: string | null
          score: number | null
          type: string
        }
        Insert: {
          content: string
          correct_answer?: string | null
          created_at?: string
          difficulty?: string | null
          exam_id?: string | null
          explanation?: string | null
          id?: string
          media_url?: string | null
          options?: Json | null
          order_index?: number | null
          parent_id?: string | null
          score?: number | null
          type: string
        }
        Update: {
          content?: string
          correct_answer?: string | null
          created_at?: string
          difficulty?: string | null
          exam_id?: string | null
          explanation?: string | null
          id?: string
          media_url?: string | null
          options?: Json | null
          order_index?: number | null
          parent_id?: string | null
          score?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_questions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_submissions: {
        Row: {
          answers: Json | null
          created_at: string | null
          exam_id: string | null
          graded_by: string | null
          id: string
          passed: boolean | null
          score: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["submission_status"] | null
          submitted_at: string | null
          teacher_feedback: string | null
          time_spent: number | null
          total_score: number | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          created_at?: string | null
          exam_id?: string | null
          graded_by?: string | null
          id?: string
          passed?: boolean | null
          score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_at?: string | null
          teacher_feedback?: string | null
          time_spent?: number | null
          total_score?: number | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          created_at?: string | null
          exam_id?: string | null
          graded_by?: string | null
          id?: string
          passed?: boolean | null
          score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_at?: string | null
          teacher_feedback?: string | null
          time_spent?: number | null
          total_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_submissions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          code: string
          created_at: string
          description: string | null
          duration: number
          exam_type: string
          id: string
          level: string
          pass_score: number | null
          question_count: number
          status: string
          title: string
          total_score: number | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          duration?: number
          exam_type: string
          id?: string
          level: string
          pass_score?: number | null
          question_count?: number
          status?: string
          title: string
          total_score?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          duration?: number
          exam_type?: string
          id?: string
          level?: string
          pass_score?: number | null
          question_count?: number
          status?: string
          title?: string
          total_score?: number | null
        }
        Relationships: []
      }
      grammars: {
        Row: {
          audio_url: string | null
          audios: Json | null
          category: string | null
          content: string | null
          created_at: string | null
          description: string | null
          file_mime_type: string | null
          file_size: number | null
          file_url: string | null
          id: string
          instructor_id: string | null
          price: number | null
          questions: Json | null
          reference_files: Json | null
          slug: string | null
          status: string | null
          tags: string[] | null
          thumbnail: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          audios?: Json | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          file_mime_type?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          instructor_id?: string | null
          price?: number | null
          questions?: Json | null
          reference_files?: Json | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          audios?: Json | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          file_mime_type?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          instructor_id?: string | null
          price?: number | null
          questions?: Json | null
          reference_files?: Json | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_exercises: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration: number | null
          id: string
          is_premium: boolean | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          id?: string
          is_premium?: boolean | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          id?: string
          is_premium?: boolean | null
          title?: string
        }
        Relationships: []
      }
      practice_questions: {
        Row: {
          content: string | null
          correct_answer: string | null
          explanation: string | null
          id: string
          media_url: string | null
          options: Json | null
          order_index: number | null
          parent_id: string | null
          practice_set_id: string | null
          type: Database["public"]["Enums"]["question_type"] | null
        }
        Insert: {
          content?: string | null
          correct_answer?: string | null
          explanation?: string | null
          id?: string
          media_url?: string | null
          options?: Json | null
          order_index?: number | null
          parent_id?: string | null
          practice_set_id?: string | null
          type?: Database["public"]["Enums"]["question_type"] | null
        }
        Update: {
          content?: string | null
          correct_answer?: string | null
          explanation?: string | null
          id?: string
          media_url?: string | null
          options?: Json | null
          order_index?: number | null
          parent_id?: string | null
          practice_set_id?: string | null
          type?: Database["public"]["Enums"]["question_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_questions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "practice_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_questions_practice_set_id_fkey"
            columns: ["practice_set_id"]
            isOneToOne: false
            referencedRelation: "practice_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          level: string | null
          skill: Database["public"]["Enums"]["practice_skill"]
          thumbnail_url: string | null
          title: string
          total_questions: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          level?: string | null
          skill: Database["public"]["Enums"]["practice_skill"]
          thumbnail_url?: string | null
          title: string
          total_questions?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          level?: string | null
          skill?: Database["public"]["Enums"]["practice_skill"]
          thumbnail_url?: string | null
          title?: string
          total_questions?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      roleplay_history: {
        Row: {
          completed_objectives: string[]
          created_at: string
          elapsed_seconds: number
          hints_used: number
          id: string
          messages: Json
          scenario_id: string
          topic_title: string
          total_objectives: number
          user_id: string
        }
        Insert: {
          completed_objectives: string[]
          created_at?: string
          elapsed_seconds: number
          hints_used?: number
          id?: string
          messages: Json
          scenario_id: string
          topic_title: string
          total_objectives: number
          user_id: string
        }
        Update: {
          completed_objectives?: string[]
          created_at?: string
          elapsed_seconds?: number
          hints_used?: number
          id?: string
          messages?: Json
          scenario_id?: string
          topic_title?: string
          total_objectives?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roleplay_history_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "roleplay_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      roleplay_scenarios: {
        Row: {
          ai_role: string
          context: string
          created_at: string
          first_message: string
          id: string
          level: string
          objectives: Json
          title: string
          topic_keyword: string | null
        }
        Insert: {
          ai_role: string
          context: string
          created_at?: string
          first_message: string
          id?: string
          level: string
          objectives: Json
          title: string
          topic_keyword?: string | null
        }
        Update: {
          ai_role?: string
          context?: string
          created_at?: string
          first_message?: string
          id?: string
          level?: string
          objectives?: Json
          title?: string
          topic_keyword?: string | null
        }
        Relationships: []
      }
      sentences: {
        Row: {
          created_at: string
          id: string
          phonetic: string
          russian_text: string
          topic_slug: string
          vietnamese_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          phonetic: string
          russian_text: string
          topic_slug: string
          vietnamese_text: string
        }
        Update: {
          created_at?: string
          id?: string
          phonetic?: string
          russian_text?: string
          topic_slug?: string
          vietnamese_text?: string
        }
        Relationships: []
      }
      shadowing_sentences: {
        Row: {
          audio_url: string | null
          created_at: string | null
          id: string
          order_index: number
          ru: string
          topic_id: string | null
          vi: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          order_index: number
          ru: string
          topic_id?: string | null
          vi: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          order_index?: number
          ru?: string
          topic_id?: string | null
          vi?: string
        }
        Relationships: [
          {
            foreignKeyName: "shadowing_sentences_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "shadowing_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      shadowing_topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: string
          title?: string
        }
        Relationships: []
      }
      submission_question_results: {
        Row: {
          admin_explanation: string | null
          ai_feedback: string | null
          correct_answer: string | null
          created_at: string | null
          earned_score: number | null
          id: string
          is_correct: boolean | null
          max_score: number | null
          order_index: number | null
          question_id: string
          question_text: string
          question_type: string
          submission_id: string
          user_answer: string | null
        }
        Insert: {
          admin_explanation?: string | null
          ai_feedback?: string | null
          correct_answer?: string | null
          created_at?: string | null
          earned_score?: number | null
          id?: string
          is_correct?: boolean | null
          max_score?: number | null
          order_index?: number | null
          question_id: string
          question_text: string
          question_type: string
          submission_id: string
          user_answer?: string | null
        }
        Update: {
          admin_explanation?: string | null
          ai_feedback?: string | null
          correct_answer?: string | null
          created_at?: string | null
          earned_score?: number | null
          id?: string
          is_correct?: boolean | null
          max_score?: number | null
          order_index?: number | null
          question_id?: string
          question_text?: string
          question_type?: string
          submission_id?: string
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sqr_question_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sqr_submission_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "exam_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_question_results_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "exam_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_practice_progress: {
        Row: {
          completed_questions: number | null
          id: string
          last_accessed_at: string | null
          practice_set_id: string | null
          score: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_questions?: number | null
          id?: string
          last_accessed_at?: string | null
          practice_set_id?: string | null
          score?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_questions?: number | null
          id?: string
          last_accessed_at?: string | null
          practice_set_id?: string | null
          score?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_practice_progress_practice_set_id_fkey"
            columns: ["practice_set_id"]
            isOneToOne: false
            referencedRelation: "practice_sets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_exam_questions: {
        Args: { p_exam_id: string; p_questions: Json[] }
        Returns: undefined
      }
    }
    Enums: {
      practice_skill:
        | "reading"
        | "listening"
        | "writing"
        | "speaking"
        | "grammar"
        | "vocabulary"
      question_type:
        | "multiple_choice"
        | "essay"
        | "fill_in_blank"
        | "group"
        | "reorder"
        | "rewrite"
        | "error_correction"
        | "topic"
      submission_status: "in_progress" | "completed" | "graded" | "pending"
      user_role: "admin" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      practice_skill: [
        "reading",
        "listening",
        "writing",
        "speaking",
        "grammar",
        "vocabulary",
      ],
      question_type: [
        "multiple_choice",
        "essay",
        "fill_in_blank",
        "group",
        "reorder",
        "rewrite",
        "error_correction",
        "topic",
      ],
      submission_status: ["in_progress", "completed", "graded", "pending"],
      user_role: ["admin", "student"],
    },
  },
} as const
