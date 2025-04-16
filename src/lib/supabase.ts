
import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings (https://supabase.com)
// Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a Supabase client with the credentials
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
