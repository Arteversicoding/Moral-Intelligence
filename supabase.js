// supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = "https://leqtvucfgxwukfgsvnei.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlcXR2dWNmZ3h3dWtmZ3N2bmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTg2MDYsImV4cCI6MjA3MzU3NDYwNn0.cEO_Bzv183QIzEBOnqYAId4aZAkYaW0_jsnwiA1atzQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
