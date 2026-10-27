import { createClient } from "@supabase/supabase-js";

// A "anon key" é feita para ficar no código do cliente — a segurança real
// vem das políticas de Row Level Security configuradas no banco.
const SUPABASE_URL = "https://xeychjnydiefrjmfgbdl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleWNoam55ZGllZnJqbWZnYmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MzMyNTYsImV4cCI6MjEwNjEwOTI1Nn0.oeaKCJZdtsBDlb0VlLNHbSGHGEy-b42DoNWauae3gWs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
