import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Plus, Calendar, Clock, Video, MoreVertical } from 'lucide-react';

const Interviews = () => {
  const { interviews } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInterviews = interviews.filter(int => 
    int.candidate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    int.job?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="interviews-module">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0, marginBottom: '8px'}}>Interviews</h2>
          <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Schedule and manage candidate interviews.</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Schedule Interview
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="search-box" style={{maxWidth: '400px', border: '1px solid var(--border-color)'}}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by candidate or job..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Role</th>
                <th>Round</th>
                <th>Schedule</th>
                <th>Interviewer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.map(int => (
                <tr key={int.id}>
                  <td>
                    <div style={{fontWeight: 600, color: 'var(--dark-navy)'}}>{int.candidate}</div>
                  </td>
                  <td>{int.job}</td>
                  <td>{int.round || 'Technical'}</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', marginBottom: '4px'}}>
                      <Calendar size={14} color="var(--text-muted)" /> {int.date}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem'}}>
                      <Clock size={14} color="var(--text-muted)" /> {int.time}
                    </div>
                  </td>
                  <td>{int.interviewer}</td>
                  <td>
                    <span className={`status-badge status-${(int.status || 'Scheduled').toLowerCase().replace(' ', '_')}`}>
                      {int.status || 'Scheduled'}
                    </span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button className="icon-btn" title="Join Meeting">
                        <Video size={16} color="var(--primary-purple)" />
                      </button>
                      <button className="icon-btn">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInterviews.length === 0 && (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '48px', color: 'var(--text-muted)'}}>
                    No interviews scheduled. Click "Schedule Interview" to set one up.
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

export default Interviews;
