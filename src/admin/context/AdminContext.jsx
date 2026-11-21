import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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

  const getInitialFallbackJobs = () => {
    try {
      const stored = localStorage.getItem('hireheaven_admin_jobs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    return staticJobs.map((job, idx) => ({
      ...job,
      id: job.id || `job-${idx + 1}`,
      job_id: job.id,
      department: job.category || 'Engineering',
      salary_min: job.package?.match(/\d+(?:\.\d+)?/)?.[0] || '3.5',
      salary_max: job.package?.match(/\d+(?:\.\d+)?–(\d+(?:\.\d+)?)/)?.[1] || '4',
      salary_currency: 'INR',
      salary_period: 'LPA',
      employment_type: 'Full Time',
      required_skills: job.requiredSkills || [],
      responsibilities: job.responsibilities || [],
      status: 'Published'
    }));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let loadedJobs = [];
      let loadedApps = [];

      // 1. Try fetching from Supabase
      try {
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*');
        if (!jobsError && jobsData && jobsData.length > 0) {
          loadedJobs = jobsData;
          try {
            localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(jobsData));
          } catch (e) {}
        }
      } catch (e) {
        console.warn('Jobs remote fetch error, falling back:', e);
      }

      if (loadedJobs.length === 0) {
        loadedJobs = getInitialFallbackJobs();
      }

      try {
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('*');
        if (!appsError && appsData) {
          loadedApps = appsData;
        }
      } catch (e) {
        console.warn('Applications remote fetch error:', e);
      }

      // Merge local applications
      try {
        const localApps = JSON.parse(localStorage.getItem('hireheaven_local_applications') || '[]');
        if (Array.isArray(localApps) && localApps.length > 0) {
          const appIds = new Set(loadedApps.map(a => a.id));
          localApps.forEach(la => {
            if (!appIds.has(la.id)) loadedApps.unshift(la);
          });
        }
      } catch (e) {}

      const formattedApps = loadedApps.map(app => ({
        ...app,
        currentCTC: app.currentctc || app.currentCTC,
        expectedCTC: app.expectedctc || app.expectedCTC,
        noticePeriod: app.noticeperiod || app.noticePeriod,
        dateApplied: app.created_at || app.dateApplied
      }));

      setJobs(loadedJobs);
      setApplications(formattedApps);
      setRecruiters([]);
      setInterviews([]);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setError("Failed to load dashboard data from database.");
      setJobs(getInitialFallbackJobs());
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
    setApplications(prev => prev.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    ));

    try {
      const localApps = JSON.parse(localStorage.getItem('hireheaven_local_applications') || '[]');
      const updatedLocal = localApps.map(a => a.id === id ? { ...a, status: newStatus } : a);
      localStorage.setItem('hireheaven_local_applications', JSON.stringify(updatedLocal));
    } catch (e) {}

    try {
      await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);
    } catch(err) {
      console.warn("Failed to update status remotely:", err);
    }
  };

  const addJob = async (job) => {
    const newJobItem = {
      ...job,
      id: job.id || `job_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    setJobs(prev => {
      const updated = [newJobItem, ...prev];
      try {
        localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const { id, ...jobData } = job;
      await supabase.from('jobs').insert([jobData]);
    } catch(err) {
      console.warn("Failed to add job remotely, saved locally:", err);
    }
  };

  const updateJob = async (id, updatedJob) => {
    setJobs(prev => {
      const updated = prev.map(job => (job.id === id || job.job_id === id) ? { ...job, ...updatedJob } : job);
      try {
        localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const { id: jobId, ...updateData } = updatedJob;
      await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id);
    } catch(err) {
      console.warn("Failed to update job remotely, updated locally:", err);
    }
  };

  const deleteJob = async (id) => {
    setJobs(prev => {
      const updated = prev.filter(job => job.id !== id && job.job_id !== id);
      try {
        localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
    } catch(err) {
      console.warn("Failed to delete job remotely, deleted locally:", err);
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
