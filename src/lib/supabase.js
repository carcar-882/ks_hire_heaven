import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzspuubdjcllvejfqcmz.supabase.co';
const supabaseKey = 'sb_publishable_iIOpVIjwNhrVF4Bdw1LI8A_Ai4LN1Xp';

export const supabase = createClient(supabaseUrl, supabaseKey);
