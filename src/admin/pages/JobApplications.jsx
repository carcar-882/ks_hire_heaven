import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Filter, Download, Plus, MoreVertical, LayoutGrid, List } from 'lucide-react';

const PIPELINE_STAGES = ['New', 'Shortlisted', 'Interview', 'Selected', 'Hired', 'Rejected'];

const JobApplications = () => {
  const { applications, updateApplicationStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'pipeline'

  const filteredApps = applications.filter(app => 
    (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="job-applications">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0, marginBottom: '8px'}}>Applications</h2>
          <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Manage and review candidate applications.</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <div style={{display: 'flex', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden'}}>
            <button 
              className="icon-btn" 
              style={{borderRadius: 0, border: 'none', background: viewMode === 'table' ? 'var(--primary-purple)' : 'transparent', color: viewMode === 'table' ? 'white' : 'var(--text-muted)'}}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button 
              className="icon-btn" 
              style={{borderRadius: 0, border: 'none', background: viewMode === 'pipeline' ? 'var(--primary-purple)' : 'transparent', color: viewMode === 'pipeline' ? 'white' : 'var(--text-muted)'}}
              onClick={() => setViewMode('pipeline')}
              title="Pipeline View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <button className="btn-secondary">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {viewMode === 'table' && (
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
                  <td>{app.role}</td>
                  <td>{app.experience}</td>
                  <td>{app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'N/A'}</td>
                  <td>{app.recruiter || 'Unassigned'}</td>
                  <td>
                    <span className={`status-badge status-${(app.status || 'New').toLowerCase().replace(' ', '_')}`}>
                      {app.status || 'New'}
                    </span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button 
                        className="btn-secondary" 
                        style={{padding: '4px 8px', fontSize: '0.75rem'}}
                        onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                      >
                        Shortlist
                      </button>
                      <button 
                        className="btn-secondary" 
                        style={{padding: '4px 8px', fontSize: '0.75rem', color: 'var(--danger)'}}
                        onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                      >
                        Reject
                      </button>
                      <button className="icon-btn">
                        <MoreVertical size={16} />
                      </button>
                    </div>
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
      )}

      {viewMode === 'pipeline' && (
        <div style={{display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '24px'}}>
          {PIPELINE_STAGES.map(stage => {
            const stageApps = filteredApps.filter(app => (app.status || 'New') === stage);
            return (
              <div key={stage} style={{flex: '0 0 300px', backgroundColor: 'var(--bg-color)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                  <h3 style={{margin: 0, fontSize: '1rem'}}>{stage}</h3>
                  <span style={{backgroundColor: '#e0e0e0', color: '#555', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600}}>
                    {stageApps.length}
                  </span>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {stageApps.map(app => (
                    <div key={app.id} className="admin-card" style={{padding: '16px', cursor: 'pointer', border: '1px solid var(--border-color)'}}>
                      <div style={{fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '4px'}}>{app.name}</div>
                      <div style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px'}}>{app.role}</div>
                      
                      <div style={{display: 'flex', gap: '8px'}}>
                        <select 
                          style={{fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', width: '100%'}}
                          value={app.status || 'New'}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        >
                          {PIPELINE_STAGES.map(s => <option key={s} value={s}>Move to {s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <div style={{textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.875rem', border: '2px dashed var(--border-color)', borderRadius: '8px'}}>
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
