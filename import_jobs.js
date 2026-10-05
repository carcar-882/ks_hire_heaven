import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current dir for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the JS file
const jobsJsPath = join(__dirname, 'src', 'data', 'jobs.js');
const jobsJsContent = fs.readFileSync(jobsJsPath, 'utf8');

// Extract the array using a dirty but effective eval since it's trusted local code
// First, strip out 'export const careersEmail = ...' and 'export const jobs = '
const arrayString = jobsJsContent.substring(jobsJsContent.indexOf('['), jobsJsContent.lastIndexOf(']') + 1);

// Evaluate it to a JS object
const jobsArray = eval('(' + arrayString + ')');

// Format for our db.json
const formattedJobs = jobsArray.map((job, index) => ({
  id: index + 1,
  job_id: job.id,
  title: job.title,
  department: job.category || 'Engineering',
  location: job.location,
  employment_type: 'Full Time',
  experience: job.experience,
  salary: job.package,
  description: job.shortDescription,
  responsibilities: job.responsibilities,
  requiredSkills: job.requiredSkills,
  status: 'Published'
}));

// Read db.json
const dbPath = join(__dirname, 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Update jobs
dbData.jobs = formattedJobs;

// Write back
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log(`Successfully imported ${formattedJobs.length} jobs into the database!`);
