import { createClient } from '@supabase/supabase-js'; 
const supabase = createClient('https://gzspuubdjcllvejfqcmz.supabase.co', 'sb_publishable_iIOpVIjwNhrVF4Bdw1LI8A_Ai4LN1Xp'); 
async function test() { 
  const { data, error } = await supabase.from('applications').select('*'); 
  console.log(data, error); 
} 
test();
