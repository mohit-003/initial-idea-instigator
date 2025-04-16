
import { createClient } from '@supabase/supabase-js';

// We'll use the same values as in the integrations/supabase/client.ts file
const supabaseUrl = "https://gyznxttsncqajqcbxefj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5em54dHRzbmNxYWpxY2J4ZWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzMzMDksImV4cCI6MjA1NzAwOTMwOX0.Lh7JTOSgxMEMcAGLREXiZaRADpRYdXJRXSUUm_z_1QU";

// Create a Supabase client with the credentials
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
