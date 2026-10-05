import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { BarChart2, PieChart, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

const Analytics = () => {
  const { applications, jobs } = useAdmin();

  // Simple mock metrics for the Analytics UI
  const publishedJobs = jobs.filter(j => j.status === 'Published').length;
  const totalApps = applications.length;
  const hiredApps = applications.filter(a => a.status === 'Hired').length;
  const conversionRate = totalApps > 0 ? ((hiredApps / totalApps) * 100).toFixed(1) : '0.0';

  return (
    <div className="analytics-module">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0, marginBottom: '8px'}}>Analytics & Reports</h2>
          <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem'}}>Visualize your recruitment pipeline and performance metrics.</p>
        </div>
      </div>

      <div className="kpi-grid" style={{marginBottom: '24px'}}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Conversion Rate</span>
            <div className="kpi-icon-wrapper positive">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-value">{conversionRate}%</div>
          <div className="kpi-trend positive">+1.2% from last month</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Avg. Time to Hire</span>
            <div className="kpi-icon-wrapper neutral">
              <Clock size={20} />
            </div>
          </div>
          <div className="kpi-value">18 Days</div>
          <div className="kpi-trend positive">-2 days from last month</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Jobs</span>
            <div className="kpi-icon-wrapper positive">
              <BarChart2 size={20} />
            </div>
          </div>
          <div className="kpi-value">{publishedJobs}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Hired Candidates</span>
            <div className="kpi-icon-wrapper positive">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="kpi-value">{hiredApps}</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
        <div className="admin-card">
          <div className="admin-card-header" style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px'}}>
            <h3 style={{margin: 0}}>Applications Pipeline</h3>
          </div>
          <div style={{height: '300px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '24px 0', borderBottom: '1px solid var(--border-color)'}}>
            {/* Mock Bar Chart */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
              <div style={{width: '100%', height: '80%', background: 'var(--primary-purple)', borderRadius: '4px 4px 0 0', opacity: 0.8}}></div>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Applied</span>
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
              <div style={{width: '100%', height: '60%', background: 'var(--primary-purple)', borderRadius: '4px 4px 0 0', opacity: 0.8}}></div>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Screening</span>
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
              <div style={{width: '100%', height: '40%', background: 'var(--primary-purple)', borderRadius: '4px 4px 0 0', opacity: 0.8}}></div>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Interview</span>
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
              <div style={{width: '100%', height: '20%', background: 'var(--primary-purple)', borderRadius: '4px 4px 0 0', opacity: 0.8}}></div>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Offered</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header" style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px'}}>
            <h3 style={{margin: 0}}>Sources</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {/* Mock Pie Chart Data List */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-purple)'}}></div>
                <span style={{fontSize: '0.875rem', color: 'var(--dark-navy)'}}>Careers Page</span>
              </div>
              <span style={{fontWeight: 600, fontSize: '0.875rem'}}>65%</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#4bc0c0'}}></div>
                <span style={{fontSize: '0.875rem', color: 'var(--dark-navy)'}}>LinkedIn</span>
              </div>
              <span style={{fontWeight: 600, fontSize: '0.875rem'}}>25%</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#ffcd56'}}></div>
                <span style={{fontSize: '0.875rem', color: 'var(--dark-navy)'}}>Referrals</span>
              </div>
              <span style={{fontWeight: 600, fontSize: '0.875rem'}}>10%</span>
            </div>
          </div>
          <div style={{marginTop: '32px', display: 'flex', justifyContent: 'center'}}>
            <PieChart size={120} color="var(--primary-purple)" strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
