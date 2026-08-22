const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://aqgrrysauxpogiffljer.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZ3JyeXNhdXhwb2dpZmZsamVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NzYyMzgsImV4cCI6MjA4MjU1MjIzOH0.i6R-WnvaJWEqTi033tjTV7-rTR7feED2Tjq92-dv0gc'
);

async function check() {
  const { data, error } = await supabase.from('roleplay_history').insert({
    user_id: '00000000-0000-0000-0000-000000000000',
    scenario_id: 'roleplay-1',
    topic_title: 'Quán cà phê',
    messages: [],
    completed_objectives: [],
    total_objectives: 5,
    hints_used: 0,
    elapsed_seconds: 120
  });
  console.log("Error:", error);
}
check();
