import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://dzaumxbflepbicflsehj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YXVteGJmbGVwYmljZmxzZWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDcxMzQsImV4cCI6MjA3NzQyMzEzNH0.xMC2WtkMXwKdybzAqN1HhYxCR1xJ9NTrHnQNcIcedxs";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveScoreToSupabase(score1, score2) {

  const { data, error } = await supabase
    .from("scores")
    .insert([{ score1, score2 }]);

  if (error) {
    console.error("Error saving score:", error);
  } else {
    console.log("Score saved to Supabase:", data);
  }
}



//export async function saveSessionResult(result) {
  export async function saveSessionResult(score1, score2) {
  // result should look like:
  // {
  //   session_id: 
  //   score_before: 7,         
  //   score_after: 9,           
  //   levels_completed: 12,    
  //   timestamp: new Date().toISOString()
  // }
  
  // const { data, error } = await supabase
  //   .from("session_results")
  //   .insert([result]);
    
  // console.log("logged:", data);
  // if (error) {
  //   console.error("Error saving session result:", error);
  // } else {
  //   console.log("Session result saved:", data);
  // }
  const { data, error } = await supabase
  .from("scores")
  .insert([{ score1, score2 }]);

  if (error) {
    console.error("Error saving score:", error);
  } else {
    console.log("Score saved to Supabase:", data);
  }
}

// create table scores (
//   id uuid default gen_random_uuid() primary key,
//   score1 int not null,
//   score2 int not null,
//   created_at timestamp default now()
// );

// CREATE POLICY "Allow insert for anon" 
// ON scores 
// FOR INSERT 
// TO anon 
// WITH CHECK (true);
