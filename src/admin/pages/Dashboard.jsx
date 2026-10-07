import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Users, FileText, UserCheck, Calendar, MoreVertical, Download } from 'lucide-react';

const Dashboard = () => {
  const { applications, kpis } = useAdmin();
  return (
    <div className="dashboard">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h2 style={{margin: 0}}>Overview</h2>
        <button className="btn-secondary">
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <div className="kpi-card" key={idx}>
            <div className="kpi-header">
              {kpi.label}
              <div className="kpi-icon">
                {kpi.icon === 'Users' && <Users size={20} />}
                {kpi.icon === 'FileText' && <FileText size={20} />}
                {kpi.icon === 'UserCheck' && <UserCheck size={20} />}
                {kpi.icon === 'Calendar' && <Calendar size={20} />}
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-footer">
              <span className={`kpi-trend ${kpi.trendType}`}>
                {kpi.trend}
              </span>
              <span style={{color: 'var(--text-muted)'}}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Applications</h3>
          <button className="btn-secondary" style={{padding: '6px 12px', fontSize: '0.75rem'}}>View All</button>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Application ID</th>
                <th>Role</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="candidate-name">{app.name}</div>
                    <div className="candidate-job">{app.experience} • {app.location}</div>
                  </td>
                  <td>{app.application_number || 'Pending'}</td>
                  <td>{app.role}</td>
                  <td>{app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'N/A'}</td>
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
              {applications.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '48px', color: 'var(--text-muted)'}}>
                    No applications received yet.
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

export default Dashboard;
