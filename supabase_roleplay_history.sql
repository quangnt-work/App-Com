CREATE TABLE roleplay_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  scenario_id uuid REFERENCES roleplay_scenarios(id) NOT NULL,
  topic_title text NOT NULL,
  messages jsonb NOT NULL,
  completed_objectives text[] NOT NULL,
  total_objectives integer NOT NULL,
  hints_used integer NOT NULL DEFAULT 0,
  elapsed_seconds integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE roleplay_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own history" ON roleplay_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own history" ON roleplay_history
  FOR SELECT USING (auth.uid() = user_id);
