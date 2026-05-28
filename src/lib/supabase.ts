import { createClient } from '@supabase/supabase-js';

const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isDemoMode = demoMode;
