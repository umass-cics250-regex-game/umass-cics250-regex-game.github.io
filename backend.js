import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://dzaumxbflepbicflsehj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YXVteGJmbGVwYmljZmxzZWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDcxMzQsImV4cCI6MjA3NzQyMzEzNH0.xMC2WtkMXwKdybzAqN1HhYxCR1xJ9NTrHnQNcIcedxs";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveSessionResult(result) {
  const { data, error } = await supabase
    .from("session_results")
    .insert([result]);

  if (error) {
    console.error("Error saving session result:", error);
  } else {
    console.log("Session result saved:", data);
  }
}

// --  session_results for storing results in Supabase SQL editor
// CREATE TABLE IF NOT EXISTS session_results (
//     id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- unique row ID
//     session_id TEXT NOT NULL,                             -- unique session identifier
//     score_before INT NOT NULL DEFAULT 0,                  -- score before session
//     score_after INT NOT NULL DEFAULT 0,                   -- score after session
//     levels_completed INT NOT NULL DEFAULT 0,              -- number of levels completed
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()     -- timestamp of creation
// );

// -- Allow insert on session_results -  results in supabase SQL editor
// CREATE POLICY "Allow insert for anon" 
// ON session_results
// FOR INSERT 
// TO anon 
// WITH CHECK (true);

