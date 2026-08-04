import { createClient } from "@supabase/supabase-js";

// A "anon key" é feita para ficar no código do cliente — a segurança real
// vem das políticas de Row Level Security configuradas no banco.
const SUPABASE_URL = "https://xbjwyacugqnctdvefgzp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhiand5YWN1Z3FuY3RkdmVmZ3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxOTgwMTIsImV4cCI6MjEwMDc3NDAxMn0.D8vgM4TU-zkKheziUIKpX-Cdq8Uke7hqhiCwV5j6a_s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
