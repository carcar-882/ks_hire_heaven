import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const supabaseUrl = 'https://gzspuubdjcllvejfqcmz.supabase.co';
const supabaseKey = 'sb_publishable_iIOpVIjwNhrVF4Bdw1LI8A_Ai4LN1Xp';
const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jobsJsPath = join(__dirname, 'src', 'data', 'jobs.js');
const jobsJsContent = fs.readFileSync(jobsJsPath, 'utf8');

const arrayString = jobsJsContent.substring(jobsJsContent.indexOf('['), jobsJsContent.lastIndexOf(']') + 1);
const jobsArray = eval('(' + arrayString + ')');

const formattedJobs = jobsArray.map((job) => ({
  job_id: job.id,
  title: job.title,
  department: job.category || 'Engineering',
  location: job.location,
  employment_type: 'Full Time',
  experience: job.experience,
  salary: job.package,
  salary_min: job.package?.match(/\d+/)?.[0] || '',
  salary_max: job.package?.match(/\d+–(\d+)/)?.[1] || '',
  salary_currency: 'INR',
  salary_period: 'LPA',
  description: job.shortDescription || job.description,
  responsibilities: job.responsibilities || [],
  required_skills: job.requiredSkills || [],
  status: 'Published'
}));

async function seed() {
  console.log('Seeding Supabase...');
  const { data, error } = await supabase.from('jobs').insert(formattedJobs);
  if (error) {
    console.error('Error seeding:', error);
  } else {
    console.log('Successfully seeded jobs into Supabase!');
  }
}

seed();
