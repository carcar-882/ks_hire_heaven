import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env) ? process.env : {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://gzspuubdjcllvejfqcmz.supabase.co';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iIOpVIjwNhrVF4Bdw1LI8A_Ai4LN1Xp';

export const supabase = createClient(supabaseUrl, supabaseKey);
