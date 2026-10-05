import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Filter, Download, Plus, MoreVertical } from 'lucide-react';

const JobApplications = () => {
  const { applications } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="job-applications">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0, marginBottom: '8px'}}>Applications</h2>
          <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Manage and review candidate applications.</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button className="btn-secondary">
            <Download size={16} /> Export
          </button>
          <button className="btn-primary">
            <Plus size={16} /> Add Candidate
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{display: 'flex', gap: '16px'}}>
          <div className="search-box" style={{flex: 1, maxWidth: '400px', border: '1px solid var(--border-color)'}}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name, role, or ID..." 
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
                <th>Candidate</th>
                <th>Job</th>
                <th>Experience</th>
                <th>Applied Date</th>
                <th>Recruiter</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="candidate-name">{app.name}</div>
                    <div className="candidate-job">{app.email}</div>
                  </td>
                  <td>{app.jobTitle}</td>
                  <td>{app.experience}</td>
                  <td>{app.appliedDate}</td>
                  <td>{app.recruiter}</td>
                  <td>
                    <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '_')}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '48px', color: 'var(--text-muted)'}}>
                    No applications found matching your criteria.
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

export default JobApplications;
