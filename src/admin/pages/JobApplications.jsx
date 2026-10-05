import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Filter, Download, Plus, MoreVertical, LayoutGrid, List, Eye, X, FileText, CheckCircle, XCircle } from 'lucide-react';
import '../styles/admin.css';

const PIPELINE_STAGES = ['New', 'Shortlisted', 'Interview', 'Selected', 'Hired', 'Rejected'];

const JobApplications = () => {
  const { applications, updateApplicationStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'pipeline'
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = applications.filter(app => 
    (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (!selectedApp) return;
    const headers = ['Field', 'Value'];
    const rows = [
      ['Name', selectedApp.name],
      ['Email', selectedApp.email],
      ['Phone', selectedApp.phone],
      ['Role', selectedApp.role],
      ['Experience', selectedApp.experience],
      ['Location', selectedApp.location],
      ['Current CTC', selectedApp.currentCTC],
      ['Expected CTC', selectedApp.expectedCTC],
      ['Notice Period', selectedApp.noticePeriod],
      ['Message', (selectedApp.message || '').replace(/\n/g, ' ')]
    ];
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => `"${e[0]}","${e[1]}"`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedApp.name.replace(/\s+/g, '_')}_Application.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="job-applications">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}} className="no-print">
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
            <Download size={16} /> Export All
          </button>
        </div>
      </div>

      {viewMode === 'table' && !selectedApp && (
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="candidate-name" style={{fontWeight: 600}}>{app.name}</div>
                    <div className="candidate-job" style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{app.email}</div>
                  </td>
                  <td>{app.role}</td>
                  <td>{app.experience}</td>
                  <td>{app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${(app.status || 'New').toLowerCase().replace(' ', '_')}`}>
                      {app.status || 'New'}
                    </span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button 
                        className="icon-btn" 
                        onClick={() => setSelectedApp(app)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
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
                    </div>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '48px', color: 'var(--text-muted)'}}>
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {viewMode === 'pipeline' && !selectedApp && (
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
                    <div key={app.id} className="admin-card" style={{padding: '16px', border: '1px solid var(--border-color)'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '4px'}}>{app.name}</div>
                        <button className="icon-btn" onClick={() => setSelectedApp(app)} style={{padding: '2px'}}><Eye size={16} /></button>
                      </div>
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

      {selectedApp && (
        <div className="application-details">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}} className="no-print">
            <div>
              <h2 style={{margin: 0}}>{selectedApp.name}</h2>
              <div style={{marginTop: '8px', color: 'var(--text-muted)', display: 'flex', gap: '12px'}}>
                <span>{selectedApp.email}</span> •
                <span>{selectedApp.phone}</span> •
                <span>{selectedApp.location}</span>
              </div>
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
              <button className="btn-secondary" onClick={handleExportCSV}><Download size={16} /> Export Excel</button>
              <button className="btn-secondary" onClick={handleExportPDF}><FileText size={16} /> Export PDF</button>
              <button className="btn-secondary" onClick={() => setSelectedApp(null)}><X size={16} /> Close</button>
            </div>
          </div>

          <div className="admin-card print-area" style={{padding: '32px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px'}}>
              <div>
                <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)'}}>Applied Role</p>
                <h3 style={{margin: '4px 0 0 0', fontSize: '1.25rem'}}>{selectedApp.role}</h3>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)'}}>Current Status</p>
                <select 
                  className="no-print"
                  style={{marginTop: '4px', fontSize: '1rem', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', fontWeight: 600}}
                  value={selectedApp.status || 'New'}
                  onChange={(e) => {
                    updateApplicationStatus(selectedApp.id, e.target.value);
                    setSelectedApp({...selectedApp, status: e.target.value});
                  }}
                >
                  {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <h3 className="only-print" style={{margin: '4px 0 0 0', fontSize: '1.25rem', display: 'none'}}>{selectedApp.status || 'New'}</h3>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px'}}>
              <div>
                <h4 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px'}}>Professional Details</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div>
                    <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)'}}>Experience</p>
                    <p style={{margin: '4px 0 0 0', fontWeight: 500}}>{selectedApp.experience || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)'}}>Notice Period</p>
                    <p style={{margin: '4px 0 0 0', fontWeight: 500}}>{selectedApp.noticePeriod || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)'}}>Current CTC</p>
                    <p style={{margin: '4px 0 0 0', fontWeight: 500}}>{selectedApp.currentCTC || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)'}}>Expected CTC</p>
                    <p style={{margin: '4px 0 0 0', fontWeight: 500}}>{selectedApp.expectedCTC || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px'}}>Message / Cover Letter</h4>
                <div style={{backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', minHeight: '100px'}}>
                  {selectedApp.message ? (
                    <p style={{margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: 1.6}}>{selectedApp.message}</p>
                  ) : (
                    <p style={{margin: 0, color: 'var(--text-muted)', fontStyle: 'italic'}}>No message provided.</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px'}}>Resume Attached</h4>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                <FileText size={32} color="var(--primary-purple)" />
                <div style={{flex: 1}}>
                  <p style={{margin: 0, fontWeight: 600}}>
                    {selectedApp.resume?.name || selectedApp.resumeName || 'Resume.pdf'}
                  </p>
                  <p style={{margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)'}}>Uploaded with application</p>
                </div>
                <div className="no-print">
                  <button className="btn-secondary" onClick={() => alert("In a production backend, this would securely download the file.")}>
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
            </div>

            <div className="no-print" style={{marginTop: '48px', display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '24px'}}>
              <button className="btn-primary" onClick={() => updateApplicationStatus(selectedApp.id, 'Shortlisted')}><CheckCircle size={16} /> Shortlist Candidate</button>
              <button className="btn-secondary" style={{color: 'var(--danger)'}} onClick={() => updateApplicationStatus(selectedApp.id, 'Rejected')}><XCircle size={16} /> Reject</button>
            </div>
          </div>
          
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-area, .print-area * {
                visibility: visible;
              }
              .print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .no-print {
                display: none !important;
              }
              .only-print {
                display: block !important;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
