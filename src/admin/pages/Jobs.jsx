import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Filter, Download, Plus, MoreVertical, Briefcase, CheckCircle, FileEdit, Archive, Eye, Trash2, Edit2, X, PlusCircle } from 'lucide-react';
import '../styles/admin.css';

const DEFAULT_JOB = {
  title: '',
  responsibilities: [''],
  location: '',
  salary_min: '',
  salary_max: '',
  salary_currency: 'INR',
  salary_period: 'LPA',
  required_skills: [''],
  department: 'Engineering',
  employment_type: 'Full Time'
};

const Jobs = () => {
  const { jobs, addJob, updateJob, deleteJob } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state: 'list', 'create', 'edit', 'view'
  const [viewState, setViewState] = useState('list');
  const [currentJob, setCurrentJob] = useState(DEFAULT_JOB);
  
  // Handlers for form arrays
  const handleArrayChange = (field, index, value) => {
    const newArray = [...currentJob[field]];
    newArray[index] = value;
    setCurrentJob({ ...currentJob, [field]: newArray });
  };
  
  const addArrayItem = (field) => {
    setCurrentJob({ ...currentJob, [field]: [...currentJob[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = currentJob[field].filter((_, i) => i !== index);
    setCurrentJob({ ...currentJob, [field]: newArray });
  };

  const moveArrayItem = (field, index, dir) => {
    if ((dir === -1 && index === 0) || (dir === 1 && index === currentJob[field].length - 1)) return;
    const newArray = [...currentJob[field]];
    const temp = newArray[index];
    newArray[index] = newArray[index + dir];
    newArray[index + dir] = temp;
    setCurrentJob({ ...currentJob, [field]: newArray });
  };

  const handleInputChange = (e) => {
    setCurrentJob({...currentJob, [e.target.name]: e.target.value});
  };

  const handleSaveJob = async (status) => {
    if(!currentJob.title || !currentJob.location || !currentJob.salary_min || !currentJob.salary_max) {
      alert("Job Title, Location, and Salary fields are required!");
      return;
    }
    
    // Clean arrays
    const cleanResponsibilities = currentJob.responsibilities.filter(r => r.trim() !== '');
    const cleanSkills = currentJob.required_skills.filter(s => s.trim() !== '');
    
    if (cleanResponsibilities.length === 0) {
      alert("At least one responsibility is required!");
      return;
    }
    if (cleanSkills.length === 0) {
      alert("At least one required skill is required!");
      return;
    }

    const jobData = {
      ...currentJob,
      responsibilities: cleanResponsibilities,
      required_skills: cleanSkills,
      status: status,
      updated_at: new Date().toISOString()
    };

    if (viewState === 'create') {
      jobData.job_id = `JOB-${Math.floor(Math.random() * 900) + 100}`;
      jobData.created_at = new Date().toISOString();
      await addJob(jobData);
    } else if (viewState === 'edit') {
      await updateJob(currentJob.id, jobData);
    }
    
    setViewState('list');
    setCurrentJob(DEFAULT_JOB);
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job? If applications exist, it is recommended to archive it instead.")) {
      await deleteJob(id);
    }
  };
  
  const handleArchiveJob = async (job) => {
    await updateJob(job.id, { ...job, archived_at: new Date().toISOString(), status: 'Archived' });
  };

  // Stats
  const activeJobs = jobs.filter(j => !j.archived_at);
  const totalJobs = activeJobs.length;
  const published = activeJobs.filter(j => j.status === 'Published').length;
  const drafts = activeJobs.filter(j => j.status === 'Draft').length;
  const closed = activeJobs.filter(j => j.status === 'Closed').length;

  const filteredJobs = activeJobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSalary = (job) => {
    if (!job.salary_min) return 'Competitive';
    return `${job.salary_currency === 'INR' ? '₹' : job.salary_currency}${job.salary_min}–${job.salary_max} ${job.salary_period}`;
  };

  if (viewState === 'create' || viewState === 'edit') {
    return (
      <div className="jobs-module">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
          <h2 style={{margin: 0}}>{viewState === 'create' ? 'Create New Job' : `Edit ${currentJob.title}`}</h2>
          <button className="btn-secondary" onClick={() => setViewState('list')}><X size={16} /> Close</button>
        </div>
        
        <div className="admin-card" style={{padding: '32px', maxWidth: '800px'}}>
          
          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 600}}>1. Job Title *</label>
            <input type="text" name="title" value={currentJob.title} onChange={handleInputChange} placeholder="e.g. Azure Architect" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} required />
          </div>
          
          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 600}}>2. Responsibilities *</label>
            {currentJob.responsibilities.map((resp, idx) => (
              <div key={idx} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                <input type="text" value={resp} onChange={(e) => handleArrayChange('responsibilities', idx, e.target.value)} placeholder="e.g. Design enterprise-grade Azure cloud architecture." style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)'}} />
                <button type="button" onClick={() => moveArrayItem('responsibilities', idx, -1)} className="btn-secondary" style={{padding: '0 12px'}}>↑</button>
                <button type="button" onClick={() => moveArrayItem('responsibilities', idx, 1)} className="btn-secondary" style={{padding: '0 12px'}}>↓</button>
                <button type="button" onClick={() => removeArrayItem('responsibilities', idx)} className="btn-secondary" style={{padding: '0 12px', color: 'var(--danger)'}}><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" className="btn-outline" onClick={() => addArrayItem('responsibilities')} style={{marginTop: '8px'}}>
              <PlusCircle size={16} /> Add Responsibility
            </button>
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 600}}>3. Location *</label>
            <input type="text" name="location" value={currentJob.location} onChange={handleInputChange} placeholder="e.g. Hyderabad" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} required />
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 600}}>4. Package / Salary *</label>
            <div style={{display: 'flex', gap: '12px'}}>
              <input type="number" name="salary_min" value={currentJob.salary_min} onChange={handleInputChange} placeholder="Min (e.g. 10)" style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)'}} required />
              <input type="number" name="salary_max" value={currentJob.salary_max} onChange={handleInputChange} placeholder="Max (e.g. 15)" style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)'}} required />
              <select name="salary_currency" value={currentJob.salary_currency} onChange={handleInputChange} style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
              <select name="salary_period" value={currentJob.salary_period} onChange={handleInputChange} style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                <option value="LPA">LPA</option>
                <option value="Per Month">Per Month</option>
              </select>
            </div>
            <div style={{marginTop: '8px', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
              Preview: {formatSalary(currentJob)}
            </div>
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: 600}}>5. Required Skills *</label>
            {currentJob.required_skills.map((skill, idx) => (
              <div key={idx} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                <input type="text" value={skill} onChange={(e) => handleArrayChange('required_skills', idx, e.target.value)} placeholder="e.g. Azure Architecture" style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)'}} />
                <button type="button" onClick={() => removeArrayItem('required_skills', idx)} className="btn-secondary" style={{padding: '0 12px', color: 'var(--danger)'}}><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" className="btn-outline" onClick={() => addArrayItem('required_skills')} style={{marginTop: '8px'}}>
              <PlusCircle size={16} /> Add Skill
            </button>
          </div>

          <hr style={{margin: '32px 0', borderColor: 'var(--border-color)'}} />
          <h3 style={{marginBottom: '16px'}}>Optional Information</h3>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Department</label>
              <input type="text" name="department" value={currentJob.department} onChange={handleInputChange} placeholder="e.g. Engineering" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Employment Type</label>
              <select name="employment_type" value={currentJob.employment_type} onChange={handleInputChange} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}}>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px'}}>
            <button className="btn-secondary" onClick={() => setViewState('list')}>Cancel</button>
            <button className="btn-secondary" onClick={() => handleSaveJob('Draft')}>Save as Draft</button>
            <button className="btn-primary" onClick={() => handleSaveJob('Published')}>{viewState === 'edit' ? 'Save Changes & Publish' : 'Publish Job'}</button>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'view' && currentJob) {
    return (
      <div className="jobs-module">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
          <div>
            <h2 style={{margin: 0}}>{currentJob.title}</h2>
            <div style={{marginTop: '8px', color: 'var(--text-muted)', display: 'flex', gap: '12px'}}>
              <span>{currentJob.job_id}</span> •
              <span>{currentJob.department}</span> •
              <span>{formatSalary(currentJob)}</span> •
              <span>{currentJob.location}</span>
            </div>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <button className="btn-secondary" onClick={() => setViewState('edit')}><Edit2 size={16} /> Edit Job</button>
            <button className="btn-secondary" onClick={() => setViewState('list')}><X size={16} /> Close</button>
          </div>
        </div>

        <div className="admin-card" style={{padding: '32px'}}>
          <h3 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px'}}>Responsibilities</h3>
          <ul style={{marginBottom: '32px', paddingLeft: '20px'}}>
            {(currentJob.responsibilities || []).map((r, i) => <li key={i} style={{marginBottom: '8px'}}>{r}</li>)}
          </ul>

          <h3 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px'}}>Required Skills</h3>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px'}}>
            {(currentJob.required_skills || []).map((s, i) => (
              <span key={i} style={{backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.875rem'}}>
                {s}
              </span>
            ))}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
            <div>
              <h3 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px'}}>Location</h3>
              <p>{currentJob.location}</p>
            </div>
            <div>
              <h3 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px'}}>Package</h3>
              <p>{formatSalary(currentJob)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT LIST VIEW
  return (
    <div className="jobs-module">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0, marginBottom: '8px'}}>Jobs</h2>
          <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Manage, create, publish and track all job openings.</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button className="btn-secondary">
            <Download size={16} /> Export Jobs
          </button>
          <button className="btn-primary" onClick={() => { setCurrentJob(DEFAULT_JOB); setViewState('create'); }}>
            <Plus size={16} /> Create Job
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">Total Jobs <Briefcase size={20} color="var(--primary-purple)" /></div>
          <div className="kpi-value">{totalJobs}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">Published <CheckCircle size={20} color="var(--success)" /></div>
          <div className="kpi-value">{published}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">Drafts <FileEdit size={20} color="var(--warning)" /></div>
          <div className="kpi-value">{drafts}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">Closed <Archive size={20} color="var(--danger)" /></div>
          <div className="kpi-value">{closed}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{display: 'flex', gap: '16px'}}>
          <div className="search-box" style={{flex: 1, maxWidth: '400px', border: '1px solid var(--border-color)'}}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search jobs by title or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary">
            <Filter size={16} /> Filters
          </button>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Location</th>
                <th>Package</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div className="candidate-name" style={{fontWeight: 600}}>{job.title}</div>
                    <div className="candidate-job" style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{job.job_id} • {job.department}</div>
                  </td>
                  <td>{job.location}</td>
                  <td>{formatSalary(job)}</td>
                  <td>
                    <span className={`status-badge status-${job.status?.toLowerCase().replace(' ', '_') || 'draft'}`}>
                      {job.status || 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button className="icon-btn" onClick={() => { setCurrentJob(job); setViewState('view'); }} title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => { setCurrentJob(job); setViewState('edit'); }} title="Edit Job">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => handleArchiveJob(job)} title="Archive Job">
                        <Archive size={16} />
                      </button>
                      <button className="icon-btn" style={{color: 'var(--danger)'}} onClick={() => handleDeleteJob(job.id)} title="Hard Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '48px', color: 'var(--text-muted)'}}>
                    No jobs found. Click "Create Job" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
