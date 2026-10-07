import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*');
        
      if (jobsError) throw jobsError;

      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('*');
        
      const formattedApps = (appsData || []).map(app => ({
        ...app,
        currentCTC: app.currentctc,
        expectedCTC: app.expectedctc,
        noticePeriod: app.noticeperiod,
        dateApplied: app.created_at
      }));
      
      setJobs(jobsData || []);
      setApplications(formattedApps);
      setRecruiters([]);
      setInterviews([]);
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
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (!error) {
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        ));
      } else {
        console.error(error);
      }
    } catch(err) {
      console.error("Failed to update status", err);
    }
  };

  const addJob = async (job) => {
    try {
      // Remove local ID if present, let DB generate UUID
      const { id, ...jobData } = job;
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select();
        
      if (!error && data) {
        setJobs(prev => [...prev, data[0]]);
      } else {
        console.error(error);
      }
    } catch(err) {
      console.error("Failed to add job", err);
    }
  };

  const updateJob = async (id, updatedJob) => {
    try {
      // Don't update the ID
      const { id: jobId, ...updateData } = updatedJob;
      const { data, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id)
        .select();
        
      if (!error && data) {
        setJobs(prev => prev.map(job => job.id === id ? data[0] : job));
      } else {
        console.error(error);
      }
    } catch(err) {
      console.error("Failed to update job", err);
    }
  };

  const deleteJob = async (id) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
        
      if (!error) {
        setJobs(prev => prev.filter(job => job.id !== id));
      } else {
        console.error(error);
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
