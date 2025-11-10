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
