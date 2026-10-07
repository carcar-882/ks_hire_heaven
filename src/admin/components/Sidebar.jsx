import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  UserX, 
  Briefcase, 
  CalendarDays, 
  UserCog, 
  BarChart3, 
  Settings,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import brandLogo from '../../assets/logo.png';

const Sidebar = () => {
  const { applications, logout } = useAdmin();
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <NavLink to="/admin/dashboard" style={{ display: 'block' }}>
          <img src={brandLogo} alt="KS Hire Heaven" className="admin-sidebar-logo" />
        </NavLink>
      </div>
      
      <div className="admin-nav">
        <div className="admin-nav-group">
          <NavLink to="/admin/dashboard" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard /> Dashboard
          </NavLink>
        </div>

        <div className="admin-nav-group">
          <div className="admin-nav-group-title">Recruitment</div>
          <NavLink to="/admin/applications" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><Users size={20} /> Applications</div>
              <span className="sidebar-count">{applications.filter(a => !a.status || a.status === 'New' || a.status === 'Pipeline').length}</span>
            </div>
          </NavLink>
          <NavLink to="/admin/shortlisted" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><UserCheck size={20} /> Shortlisted</div>
              <span className="sidebar-count">{applications.filter(a => a.status === 'Shortlisted').length}</span>
            </div>
          </NavLink>
          <NavLink to="/admin/rejected" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><UserX size={20} /> Rejected</div>
              <span className="sidebar-count">{applications.filter(a => a.status === 'Rejected').length}</span>
            </div>
          </NavLink>
        </div>

        <div className="admin-nav-group">
          <div className="admin-nav-group-title">Hiring</div>
          <NavLink to="/admin/jobs" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><Briefcase size={20} /> Jobs</div>
          </NavLink>
          <NavLink to="/admin/interviews" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><CalendarDays size={20} /> Interviews</div>
              <span className="sidebar-count">{applications.filter(a => a.status === 'Interview').length}</span>
            </div>
          </NavLink>
          <NavLink to="/admin/selected" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle size={20} /> Selected</div>
              <span className="sidebar-count">{applications.filter(a => a.status === 'Selected').length}</span>
            </div>
          </NavLink>
          <NavLink to="/admin/recruiters" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><UserCog size={20} /> Recruiters</div>
          </NavLink>
        </div>

        <div className="admin-nav-group">
          <div className="admin-nav-group-title">System</div>
          <NavLink to="/admin/analytics" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <BarChart3 /> Analytics
          </NavLink>
          <NavLink to="/admin/settings" className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Settings /> Settings
          </NavLink>
        </div>
      </div>

      <div className="admin-profile-footer">
        <div className="admin-profile-info">
          <div className="admin-avatar">A</div>
          <div>
            <div style={{fontWeight: 600, fontSize: '0.875rem'}}>Admin Name</div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Super Admin</div>
          </div>
        </div>
        <button className="icon-btn" title="Logout" onClick={logout}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
