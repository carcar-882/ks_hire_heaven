import React, { createContext, useContext, useState, useEffect } from 'react';
import { jobs as staticJobs } from '../../data/jobs';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hireheaven_admin_auth') === 'true';
  });
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = '/api';

  // Normalize API data to guarantee array fields exist and prevent .map() crashes
  const normalizeJob = (job) => ({
    ...job,
    responsibilities: Array.isArray(job?.responsibilities) ? job.responsibilities : [],
    // Safely migrate old 'requiredSkills' to the new 'required_skills' standard
    required_skills: Array.isArray(job?.required_skills) 
      ? job.required_skills 
      : Array.isArray(job?.requiredSkills) 
        ? job.requiredSkills 
        : Array.isArray(job?.technologies)
          ? job.technologies
          : [],
  });

  const normalizeApplication = (app) => ({
    ...app,
    statusHistory: Array.isArray(app?.statusHistory) ? app.statusHistory : []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      const [appsRes, recsRes, intRes] = await Promise.all([
        fetch(`${API_URL}/applications?t=${timestamp}`),
        fetch(`${API_URL}/recruiters?t=${timestamp}`),
        fetch(`${API_URL}/interviews?t=${timestamp}`)
      ]);
      
      const apps = await appsRes.json();
      const recs = await recsRes.json();
      const ints = await intRes.json();
      
      setApplications(Array.isArray(apps) ? apps.map(normalizeApplication) : []);
      
      // Extract jobs directly from the user-side careers page data
      const formattedStaticJobs = staticJobs.map(job => ({
        id: job.id,
        job_id: job.id,
        title: job.title,
        department: job.category || 'Engineering',
        location: job.location || 'Remote',
        employment_type: 'Full Time',
        salary_min: job.package?.match(/\d+/)?.[0] || '',
        salary_max: job.package?.match(/\d+–(\d+)/)?.[1] || '',
        salary_currency: 'INR',
        salary_period: 'LPA',
        experience: job.experience,
        description: job.shortDescription || job.description,
        responsibilities: job.responsibilities || [],
        required_skills: job.requiredSkills || [],
        status: 'Published' // All jobs on the careers page are published
      }));
      
      setJobs(formattedStaticJobs);
      
      setRecruiters(Array.isArray(recs) ? recs : []);
      setInterviews(Array.isArray(ints) ? ints : []);
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
  const updateJob = async (id, updatedJob) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob)
      });
      if (res.ok) {
        setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      }
    } catch(err) {
      console.error("Failed to update job", err);
    }
  };

  const deleteJob = async (id) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setJobs(prev => prev.filter(job => job.id !== id));
      }
    } catch(err) {
      console.error("Failed to delete job", err);
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
      interviews,
      kpis,
      loading,
      error,
      updateApplicationStatus,
      addJob,
      updateJob,
      deleteJob
    }}>
      {children}
    </AdminContext.Provider>
  );
};
