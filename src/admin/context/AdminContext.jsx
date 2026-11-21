import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, hasCustomSupabase } from '../../lib/supabase';
import { jobs as staticJobs } from '../../data/jobs';
import { notifyJobsUpdated, subscribeToJobsUpdates } from '../../services/jobsSync';

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

  const normalizeJob = (job, idx = 0) => {
    return {
      ...job,
      id: job.id || job.job_id || `job-${idx + 1}`,
      job_id: job.job_id || job.id || `job-${idx + 1}`,
      title: job.title || 'Untitled Role',
      department: job.department || job.category || 'Engineering',
      location: job.location || 'Hyderabad',
      employment_type: job.employment_type || 'Full Time',
      experience: job.experience || 'Experienced',
      salary_currency: job.salary_currency || 'INR',
      salary_period: job.salary_period || 'LPA',
      salary_min: job.salary_min || job.package?.match(/\d+(?:\.\d+)?/)?.[0] || '3.5',
      salary_max: job.salary_max || job.package?.match(/\d+(?:\.\d+)?–(\d+(?:\.\d+)?)/)?.[1] || '4',
      status: job.status || 'Published',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
      required_skills: Array.isArray(job.required_skills)
        ? job.required_skills
        : Array.isArray(job.requiredSkills)
          ? job.requiredSkills
          : Array.isArray(job.technologies)
            ? job.technologies
            : []
    };
  };

  const getInitialFallbackJobs = () => {
    try {
      const stored = localStorage.getItem('hireheaven_admin_jobs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeJob);
      }
    } catch (e) {}

    return staticJobs.map(normalizeJob);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let loadedJobs = [];
      let loadedApps = [];

      // 1. Fetch from live /api/jobs database endpoint
      try {
        const res = await fetch(`/api/jobs?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        if (res.ok) {
          const apiJobs = await res.json();
          if (Array.isArray(apiJobs) && apiJobs.length > 0) {
            loadedJobs = apiJobs.map(normalizeJob);
            try {
              localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(loadedJobs));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('API /api/jobs fetch error, trying secondary source:', err);
      }

      // 2. Try Supabase if an active production instance is configured
      if (loadedJobs.length === 0 && hasCustomSupabase()) {
        try {
          const { data: jobsData, error: jobsError } = await supabase
            .from('jobs')
            .select('*');
          if (!jobsError && jobsData && jobsData.length > 0) {
            loadedJobs = jobsData.map(normalizeJob);
            try {
              localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(loadedJobs));
            } catch (e) {}
          }
        } catch (e) {
          console.warn('Jobs remote fetch error:', e);
        }
      }

      // 3. Fallback to localStorage or static seed
      if (loadedJobs.length === 0) {
        loadedJobs = getInitialFallbackJobs();
      }

      // 4. Fetch Applications from /api/applications
      try {
        const res = await fetch(`/api/applications?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const apiApps = await res.json();
          if (Array.isArray(apiApps)) {
            loadedApps = apiApps;
          }
        }
      } catch (err) {
        console.warn('API /api/applications fetch error:', err);
      }

      if (loadedApps.length === 0 && hasCustomSupabase()) {
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
      }

      // Merge local applications fallback
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

      // Fetch recruiters and interviews
      try {
        const [recsRes, intRes] = await Promise.all([
          fetch(`/api/recruiters?t=${Date.now()}`).catch(() => null),
          fetch(`/api/interviews?t=${Date.now()}`).catch(() => null)
        ]);
        if (recsRes && recsRes.ok) {
          const recs = await recsRes.json();
          if (Array.isArray(recs)) setRecruiters(recs);
        }
        if (intRes && intRes.ok) {
          const ints = await intRes.json();
          if (Array.isArray(ints)) setInterviews(ints);
        }
      } catch (e) {}

      setJobs(loadedJobs);
      setApplications(formattedApps);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setError("Failed to load dashboard data from database.");
      setJobs(getInitialFallbackJobs());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Subscribe to real-time sync across tabs and windows
  useEffect(() => {
    const unsubscribe = subscribeToJobsUpdates(() => {
      fetchData();
    });
    return unsubscribe;
  }, [fetchData]);

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
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'Published' && !j.archived_at).length.toString(), trend: '+1', trendType: 'positive', icon: 'Calendar' }
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
      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}

    if (hasCustomSupabase()) {
      try {
        await supabase
          .from('applications')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (err) {
        console.warn("Failed to update status in Supabase:", err);
      }
    }
  };

  const addJob = async (job) => {
    const newJobItem = normalizeJob({
      ...job,
      id: job.id || `job_${Date.now()}`,
      created_at: new Date().toISOString()
    });

    let savedJob = newJobItem;

    // 1. Save to backend database API (/api/jobs)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJobItem)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          savedJob = normalizeJob({ ...newJobItem, ...data });
        }
      }
    } catch (err) {
      console.warn("API /api/jobs post error:", err);
    }

    // 2. Save to Supabase if active custom database is configured
    if (hasCustomSupabase()) {
      try {
        const { id, ...jobData } = savedJob;
        await supabase.from('jobs').insert([jobData]);
      } catch (err) {
        console.warn("Supabase insert notice:", err);
      }
    }

    // 3. Update local state and trigger real-time broadcast
    setJobs(prev => {
      const updated = [savedJob, ...prev.filter(j => j.id !== savedJob.id && j.job_id !== savedJob.id)];
      try {
        localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    notifyJobsUpdated({ action: 'create', id: savedJob.id });
    return { success: true, data: savedJob };
  };

  const updateJob = async (id, updatedJob) => {
    const jobPayload = normalizeJob({
      ...updatedJob,
      id: id,
      updated_at: new Date().toISOString()
    });

    // 1. Update in backend database API (/api/jobs/:id)
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload)
      });
      if (!res.ok) {
        // Fallback to PATCH if PUT isn't supported for that resource shape
        await fetch(`/api/jobs/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobPayload)
        });
      }
    } catch (err) {
      console.warn("API /api/jobs put error:", err);
    }

    // 2. Update in Supabase if configured
    if (hasCustomSupabase()) {
      try {
        const { id: jobId, ...updateData } = jobPayload;
        await supabase
          .from('jobs')
          .update(updateData)
          .eq('id', id);
      } catch (err) {
        console.warn("Supabase update notice:", err);
      }
    }

    // 3. Update local state and trigger real-time broadcast
    setJobs(prev => {
      const updated = prev.map(job => (job.id === id || job.job_id === id) ? { ...job, ...jobPayload } : job);
      try {
        localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    notifyJobsUpdated({ action: 'update', id: id });
    return { success: true };
  };

  const deleteJob = async (id) => {
    // 1. Delete from backend database API (/api/jobs/:id)
    try {
      await fetch(`/api/jobs/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("API /api/jobs delete error:", err);
    }

    // 2. Delete from Supabase if configured
    if (hasCustomSupabase()) {
      try {
        await supabase
          .from('jobs')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.warn("Supabase delete notice:", err);
      }
    }

    // 3. Update local state and trigger real-time broadcast
    setJobs(prev => {
      const updated = prev.filter(job => job.id !== id && job.job_id !== id);
      try {
        localStorage.setItem('hireheaven_admin_jobs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    notifyJobsUpdated({ action: 'delete', id: id });
    return { success: true };
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
      deleteJob,
      refreshData: fetchData
    }}>
      {children}
    </AdminContext.Provider>
  );
};
