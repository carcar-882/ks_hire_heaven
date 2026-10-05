import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AdminProvider } from '../context/AdminContext';
import '../styles/admin.css';

export const AdminLayout = () => {
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  return (
    <AdminProvider>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <Header />
          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProvider>
  );
};
