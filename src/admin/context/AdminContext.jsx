import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hireheaven_admin_auth') === 'true';
  });
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, jobsRes, recsRes] = await Promise.all([
        fetch(`${API_URL}/applications`),
        fetch(`${API_URL}/jobs`),
        fetch(`${API_URL}/recruiters`)
      ]);
      
      const apps = await appsRes.json();
      const jbs = await jobsRes.json();
      const recs = await recsRes.json();
      
      setApplications(apps);
      setJobs(jbs);
      setRecruiters(recs);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const login = () => {
    localStorage.setItem('hireheaven_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('hireheaven_admin_auth');
    setIsAuthenticated(false);
  };

  const kpis = [
    { label: 'Total Applications', value: applications.length.toString(), trend: '+5%', trendType: 'positive', icon: 'Users' },
    { label: 'New Applications', value: applications.filter(a => a.status === 'New').length.toString(), trend: '+2%', trendType: 'positive', icon: 'FileText' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted').length.toString(), trend: '-1%', trendType: 'neutral', icon: 'UserCheck' },
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'Published').length.toString(), trend: '+1', trendType: 'positive', icon: 'Calendar' }
  ];

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      const appToUpdate = applications.find(a => a.id === id);
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...appToUpdate, status: newStatus })
      });
      if (res.ok) {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        ));
      }
    } catch(err) {
      console.error("Failed to update status", err);
    }
  };

  const addJob = async (job) => {
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      if (res.ok) {
        const newJob = await res.json();
        setJobs(prev => [...prev, newJob]);
      }
    } catch(err) {
      console.error("Failed to add job", err);
    }
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      applications,
      jobs,
      recruiters,
      kpis,
      loading,
      error,
      updateApplicationStatus,
      addJob
    }}>
      {children}
    </AdminContext.Provider>
  );
};
