import { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import HeroNavbar from '../components/HeroNavbar';
import Footer from '../components/Footer';
import ApplicationModal from '../components/ApplicationModal';
import { careersEmail } from '../data/jobs';
import '../components/Hero.css';
import '../styles/careers/careers.css';
import {
  Briefcase,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  Globe2,
  LineChart,
  MapPin,
  Network,
  Rocket,
  Search,
  Server,
  Shield,
  Users
} from 'lucide-react';

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default function Careers() {
  const reduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Roles');
  const [activeExperience, setActiveExperience] = useState('All Experience');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = () => {
    setLoading(true);
    setError(null);
    fetch('/api/jobs')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then(data => {
        // Only show published jobs and non-archived jobs
        const jobsArray = Array.isArray(data) ? data : [];
        setJobs(jobsArray.filter(job => job.status === 'Published' && !job.archived_at));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setError("Unable to load jobs. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Careers at KS Hire Heaven | Azure Cloud Jobs Hyderabad';
    window.scrollTo(0, 0);
    return () => { document.title = previousTitle; };
  }, []);

  // Derive categories dynamically from the actual published jobs
  const categories = useMemo(() => {
    if (!Array.isArray(jobs)) return ['All Roles'];
    const deps = jobs.map(j => j?.department).filter(Boolean);
    return ['All Roles', ...new Set(deps)];
  }, [jobs]);

  const experienceLevels = [
    'All Experience',
    '3–5 Years',
    '5–8 Years',
    '8–10 Years',
    '10+ Years'
  ];

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    return jobs.filter((job) => {
      if (!job) return false;
      const matchSearch =
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(job.technologies) ? job.technologies : []).some(t => t?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = activeCategory === 'All Roles' || job.department === activeCategory;

      let matchExp = true;
      if (activeExperience !== 'All Experience' && job.experience) {
        const expLower = job.experience.toLowerCase();
        if (activeExperience === '3–5 Years') matchExp = expLower.includes('3') || expLower.includes('4') || expLower.includes('5');
        else if (activeExperience === '5–8 Years') matchExp = expLower.includes('5') || expLower.includes('6') || expLower.includes('7') || expLower.includes('8');
        else if (activeExperience === '8–10 Years') matchExp = expLower.includes('8') || expLower.includes('9') || expLower.includes('10');
        else if (activeExperience === '10+ Years') matchExp = expLower.includes('10') || expLower.includes('15');
      }

      return matchSearch && matchCategory && matchExp;
    });
  }, [searchQuery, activeCategory, activeExperience, jobs]);

  const handleApply = (jobTitle, jobId) => {
    setSelectedRole(jobTitle);
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const handleGeneralApply = () => {
    const subject = encodeURIComponent('General Application – KS Hire Heaven Software India Private Limited');
    window.location.href = `mailto:${careersEmail}?subject=${subject}`;
  };

  return (
    <div className="careers-page">
      <HeroNavbar />
      
      <main className="careers-main">
        {/* Hero Section */}
        <section className="careers-hero">
          <div className="careers-hero-content">
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="careers-badge">WE ARE HIRING</div>
              <h1>Build Your Career in Cloud & Digital Transformation</h1>
              <p className="careers-hero-lead">
                Join KS Hire Heaven Software India Private Limited and work on an enterprise-scale Azure Cloud IaaS Migration project using Azure Site Recovery and Azure Migrate.
              </p>
              
              <div className="careers-stats">
                <div className="stat-item">
                  <span className="stat-value">3–15 Yrs</span>
                  <span className="stat-label">Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">₹7–15 LPA</span>
                  <span className="stat-label">Package Range</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">Hyderabad</span>
                  <span className="stat-label">Location</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">2 Years</span>
                  <span className="stat-label">Project Tenure</span>
                </div>
              </div>

              <div className="careers-hero-actions">
                <a href="#open-positions" className="btn-primary">Explore Open Positions</a>
                <button onClick={handleGeneralApply} className="btn-secondary">Apply via Email</button>
              </div>
            </motion.div>
          </div>
          
          <div className="careers-hero-visual">
            <div className="cloud-graphic">
              <div className="cg-node on-prem">
                <Server size={32} />
                <span>On-Premises</span>
              </div>
              <div className="cg-arrow">
                <div className="cg-line"></div>
                <ChevronRight className="cg-icon" />
              </div>
              <div className="cg-node migrate">
                <Rocket size={32} />
                <span>Azure Migration</span>
              </div>
              <div className="cg-arrow">
                <div className="cg-line"></div>
                <ChevronRight className="cg-icon" />
              </div>
              <div className="cg-node azure">
                <Cloud size={32} />
                <span>Azure Cloud</span>
              </div>
            </div>
          </div>
        </section>

        {/* Project Highlight Section */}
        <section className="project-highlight-section">
          <Reveal className="project-highlight-card">
            <h2>Work on a Large-Scale Azure Cloud Transformation Project</h2>
            <p>Join a technology team working on an enterprise Azure Infrastructure-as-a-Service migration initiative focused on moving and modernizing infrastructure workloads using Microsoft Azure migration and disaster recovery technologies.</p>
            
            <div className="project-details-grid">
              <div className="pd-item">
                <span className="pd-label">Project</span>
                <span className="pd-value">Azure Cloud IaaS Migration</span>
              </div>
              <div className="pd-item">
                <span className="pd-label">Migration Tools</span>
                <span className="pd-value">Azure Migrate + Azure Site Recovery (ASR)</span>
              </div>
              <div className="pd-item">
                <span className="pd-label">Project Tenure</span>
                <span className="pd-value">2 Years</span>
              </div>
              <div className="pd-item">
                <span className="pd-label">Location</span>
                <span className="pd-value">Hyderabad</span>
              </div>
              <div className="pd-item">
                <span className="pd-label">Technology</span>
                <span className="pd-value">Microsoft Azure</span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Open Positions Section */}
        <section id="open-positions" className="open-positions-section">
          <Reveal>
            <div className="section-header">
              <h2>Explore Our Open Positions</h2>
              <p>Join our technology team and contribute to enterprise-scale Azure cloud transformation.</p>
            </div>
          </Reveal>

          <div className="jobs-filter-container">
            <div className="search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search jobs by title, technology, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-groups">
              <div className="filter-group">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="filter-group exp-group">
                {experienceLevels.map(exp => (
                  <button
                    key={exp}
                    className={`filter-btn ${activeExperience === exp ? 'active' : ''}`}
                    onClick={() => setActiveExperience(exp)}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="jobs-grid">
            {loading ? (
              <div style={{gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--text-muted)'}}>
                Loading open positions...
              </div>
            ) : error ? (
              <div style={{gridColumn: '1 / -1', padding: '48px', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '12px', color: '#ef4444'}}>
                <p style={{marginBottom: '16px'}}>{error}</p>
                <button className="btn-primary" onClick={fetchJobs}>Retry</button>
              </div>
            ) : filteredJobs && filteredJobs.length > 0 ? (
              filteredJobs.map((job, idx) => (
                <Reveal key={job.id} delay={idx * 0.05} className="job-card">
                  <div className="jc-header">
                    <span className="jc-category">{job.department}</span>
                    {job.badge && <span className="jc-badge">{job.badge}</span>}
                  </div>
                  <h3 className="jc-title">{job.title}</h3>
                  
                  <div className="jc-meta">
                    <span className="jc-meta-item"><Briefcase size={16} /> {job.employment_type || 'Full Time'}</span>
                    <span className="jc-meta-item"><LineChart size={16} /> {job.salary_min ? `${job.salary_currency === 'INR' ? '₹' : job.salary_currency}${job.salary_min}–${job.salary_max} ${job.salary_period}` : 'Competitive'}</span>
                    <span className="jc-meta-item"><MapPin size={16} /> {job.location || 'Remote'}</span>
                  </div>
                  
                  {job.project && (
                    <div className="jc-project">
                      <strong>Project:</strong> {job.project} ({job.projectTenure})
                    </div>
                  )}

                  <p className="jc-desc">{job.description || job.shortDescription}</p>

                  <div className="jc-tags">
                    {(Array.isArray(job.required_skills) ? job.required_skills : []).map(tech => (
                      <span key={tech} className="jc-tag">{tech}</span>
                    ))}
                  </div>

                  <div className="jc-actions">
                    <details className="jc-details-accordion">
                      <summary className="btn-outline">View Job Description</summary>
                      <div className="jc-details-content">
                        <h4>Responsibilities</h4>
                        <ul style={{paddingLeft: '20px', marginBottom: '16px'}}>
                          {(Array.isArray(job.responsibilities) ? job.responsibilities : []).map((r, i) => <li key={i} style={{marginBottom: '4px'}}>{r}</li>)}
                        </ul>
                        <h4>Required Skills</h4>
                        <div className="skill-tags">
                          {(Array.isArray(job.required_skills) ? job.required_skills : []).map(s => <span key={s} className="skill-tag">{s}</span>)}
                        </div>
                      </div>
                    </details>
                    <button className="btn-primary apply-btn" onClick={() => handleApply(job.title, job.id)}>
                      Apply Now
                    </button>
                  </div>
                  <p className="jc-instruction">Please attach your latest resume before sending your application.</p>
                </Reveal>
              ))
            ) : (
              <div className="no-jobs-found" style={{gridColumn: '1 / -1'}}>
                <p>No open positions match your current filters.</p>
                {jobs.length === 0 ? (
                  <p style={{marginTop: '8px', color: 'var(--text-muted)'}}>No open positions available.</p>
                ) : (
                  <button className="btn-outline" onClick={() => { setSearchQuery(''); setActiveCategory('All Roles'); setActiveExperience('All Experience'); }}>
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* General Application */}
        <section className="general-app-section">
          <Reveal className="general-app-card">
            <div className="ga-content">
              <h3>Don't See Your Exact Role?</h3>
              <p>If your experience is relevant to cloud, Azure, infrastructure, DevOps, data, analytics, recruitment, or business analysis, you can still share your profile with our recruitment team.</p>
            </div>
            <button className="btn-primary" onClick={handleGeneralApply}>Send Your Resume</button>
          </Reveal>
        </section>

        {/* CTA Section */}
        <section className="careers-cta-section">
          <Reveal className="careers-cta-content">
            <h2>Your Next Opportunity Starts Here.</h2>
            <p>Bring your expertise. Build your cloud career. Be part of a team delivering enterprise Azure cloud transformation.</p>
            <div className="cta-actions">
              <a href="#open-positions" className="btn-primary">Explore Open Positions</a>
              <button onClick={handleGeneralApply} className="btn-secondary">Send Your Resume</button>
            </div>
          </Reveal>
        </section>
      </main>
      
      <Footer />
      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialRole={selectedRole} 
        jobId={selectedJobId}
      />
    </div>
  );
}
