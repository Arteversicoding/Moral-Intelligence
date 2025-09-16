// Initialize Supabase with the global CDN version
const supabaseUrl = 'https://bdvevqjyfrligrulmxbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdmV2cWp5ZnJsaWdydWxteGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MTkwNTUsImV4cCI6MjA3MzQ5NTA1NX0.m62U1ZTIARIFNewsCDWPEd2HZJWZv2TEHowSxGdxEkw';

// Create the Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Make it globally available for debugging
window.supabaseClient = supabase;

// Export for ES modules
export { supabase };