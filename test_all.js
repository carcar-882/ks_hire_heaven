import { createClient } from '@supabase/supabase-js'; 
const supabase = createClient('https://gzspuubdjcllvejfqcmz.supabase.co', 'sb_publishable_iIOpVIjwNhrVF4Bdw1LI8A_Ai4LN1Xp'); 
async function test() { 
  const { data: jobs, error: jErr } = await supabase.from('jobs').select('*'); 
  console.log("Jobs:", jobs?.length, jErr); 
  const { data: apps, error: aErr } = await supabase.from('applications').select('*'); 
  console.log("Apps:", apps?.length, aErr); 
} 
test();
