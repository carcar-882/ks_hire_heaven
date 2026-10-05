import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Filter, Download, Plus, MoreVertical, Briefcase, CheckCircle, FileEdit, Archive, Clock } from 'lucide-react';
import '../styles/admin.css';

const Jobs = () => {
  const { jobs, addJob } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', department: 'Engineering', employment_type: 'Full Time', location: 'Hyderabad'
  });

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleCreateJob = async (status) => {
    if(!formData.title) {
      alert("Job Title is required!");
      return;
    }
    const newJob = {
      ...formData,
      job_id: `JOB-${Math.floor(Math.random() * 900) + 100}`,
      status: status,
      experience: '3-5 Years', // Default mock values
      package: 'Competitive',
      shortDescription: 'Join our team!',
      technologies: [],
      responsibilities: [],
      requiredSkills: []
    };
    await addJob(newJob);
    setShowCreateModal(false);
    setFormData({title: '', department: 'Engineering', employment_type: 'Full Time', location: 'Hyderabad'});
  };

  // Stats
  const totalJobs = jobs.length;
  const published = jobs.filter(j => j.status === 'Published').length;
  const drafts = jobs.filter(j => j.status === 'Draft').length;
  const hiring = jobs.filter(j => j.status === 'Hiring').length;
  const closed = jobs.filter(j => j.status === 'Closed').length;

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
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
                <th>Department</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div className="candidate-name">{job.title}</div>
                    <div className="candidate-job">{job.job_id}</div>
                  </td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td>{job.employment_type}</td>
                  <td>
                    <span className={`status-badge status-${job.status?.toLowerCase().replace(' ', '_') || 'draft'}`}>
                      {job.status || 'Draft'}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '48px', color: 'var(--text-muted)'}}>
                    No jobs found. Click "Create Job" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="admin-card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative'}}>
            <h2 style={{marginTop: 0}}>Create New Job</h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Job Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Frontend Developer" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}} required />
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Department *</label>
                  <select name="department" value={formData.department} onChange={handleInputChange} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}}>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem'}}>Employment Type *</label>
                  <select name="employment_type" value={formData.employment_type} onChange={handleInputChange} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', boxSizing: 'border-box'}}>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px'}}>
                <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="btn-secondary" onClick={() => handleCreateJob('Draft')}>Save Draft</button>
                <button className="btn-primary" onClick={() => handleCreateJob('Published')}>Publish Job</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
