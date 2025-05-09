
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

const SUPABASE_URL = "https://vfmzqnjhiemyoiwubzwt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbXpxbmpoaWVteW9pd3Viend0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTM5NzQsImV4cCI6MjA2MDM2OTk3NH0.Mh3qCPp99IIbe6cbS-dmmGJMWFccUQVdeAKKHYfKGHY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
