import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xrakquoquxxwicdwldvj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYWtxdW9xdXh4d2ljZHdsZHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjM0MzcsImV4cCI6MjA3MzU5OTQzN30.JKFjak1sDgp4JTmrE4PEWazfuOjUDn5zXnjqZGD041k";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
