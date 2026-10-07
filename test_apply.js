import { createClient } from '@supabase/supabase-js'; 
const supabase = createClient('https://gzspuubdjcllvejfqcmz.supabase.co', 'sb_publishable_iIOpVIjwNhrVF4Bdw1LI8A_Ai4LN1Xp'); 
async function test() { 
  // Get a real job
  const { data: jobs } = await supabase.from('jobs').select('*').limit(1);
  if (!jobs || jobs.length === 0) {
    console.log("No jobs found");
    return;
  }
  const job = jobs[0];
  console.log("Applying to job:", job.job_id);

  const { data, error } = await supabase.from('applications').insert([{ 
    name: 'Test Candidate', 
    email: 'test@example.com',
    phone: '9876543210',
    experience: '4 years',
    location: 'Bangalore',
    currentctc: '10',
    expectedctc: '12',
    noticeperiod: '30 days',
    message: 'Test application',
    role: job.title,
    job_id: job.job_id,
    status: 'New'
  }]).select().single(); 
  
  if (error) {
    console.error("INSERT ERROR:", error);
  } else {
    console.log("INSERT SUCCESS:", data);
  }
} 
test();
