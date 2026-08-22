const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://aqgrrysauxpogiffljer.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZ3JyeXNhdXhwb2dpZmZsamVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NzYyMzgsImV4cCI6MjA4MjU1MjIzOH0.i6R-WnvaJWEqTi033tjTV7-rTR7feED2Tjq92-dv0gc'
);
async function check() {
  const { data, error } = await supabase.from('shadowing_history').insert({
    user_id: '00000000-0000-0000-0000-000000000000',
    topic_id: 'shadowing-1',
    topic_title: 'Title',
    score: 100,
    total_sentences: 5,
    completed_sentences: 5
  });
  console.log("Error:", error);
}
check();
