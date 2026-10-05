import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Plus, Mail, Phone, Briefcase, MoreVertical } from 'lucide-react';

const Recruiters = () => {
  const { recruiters } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecruiters = recruiters.filter(rec => 
    rec.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recruiters-module">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0, marginBottom: '8px'}}>Recruiters</h2>
          <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Manage your recruitment team and track their performance.</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add Recruiter
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="search-box" style={{maxWidth: '400px', border: '1px solid var(--border-color)'}}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Recruiter</th>
                <th>Contact</th>
                <th>Active Jobs</th>
                <th>Candidates</th>
                <th>Hiring Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecruiters.map(rec => (
                <tr key={rec.id}>
                  <td>
                    <div style={{fontWeight: 600, color: 'var(--dark-navy)'}}>{rec.name}</div>
                    <div style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>{rec.role || 'HR Recruiter'}</div>
                  </td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', marginBottom: '4px'}}>
                      <Mail size={14} color="var(--text-muted)" /> {rec.email}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem'}}>
                      <Phone size={14} color="var(--text-muted)" /> {rec.phone || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600}}>
                      <Briefcase size={16} color="var(--primary-purple)" /> {rec.assignedJobs || 0}
                    </div>
                  </td>
                  <td>{rec.totalCandidates || 0}</td>
                  <td>{rec.hiringRate || '0%'}</td>
                  <td>
                    <span className={`status-badge status-${(rec.status || 'Active').toLowerCase()}`}>
                      {rec.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecruiters.length === 0 && (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '48px', color: 'var(--text-muted)'}}>
                    No recruiters found. Click "Add Recruiter" to invite team members.
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

export default Recruiters;
