
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

// Use hardcoded values instead of environment variables
const supabaseUrl = "https://vfmzqnjhiemyoiwubzwt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbXpxbmpoaWVteW9pd3Viend0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTM5NzQsImV4cCI6MjA2MDM2OTk3NH0.Mh3qCPp99IIbe6cbS-dmmGJMWFccUQVdeAKKHYfKGHY";

// Add validation to prevent the error
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Please check your environment variables.');
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
