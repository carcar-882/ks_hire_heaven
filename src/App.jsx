import { AboutSection } from './components/AboutSection';
import { Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Careers from './pages/Careers';
import { AdminLayout } from './admin/layouts/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import JobApplications from './admin/pages/JobApplications';
import Jobs from './admin/pages/Jobs';
import Recruiters from './admin/pages/Recruiters';
import Interviews from './admin/pages/Interviews';
import Analytics from './admin/pages/Analytics';
import Settings from './admin/pages/Settings';
import Placeholder from './admin/pages/Placeholder';
import AdminErrorBoundary from './admin/components/AdminErrorBoundary';
import { AdminProvider } from './admin/context/AdminContext';

const platforms = [
  { id: 'azure', type: 'azure', title: 'Microsoft Azure', subtitle: 'Our flagship' },
  { id: 'aws', type: 'aws', title: 'AWS', subtitle: 'Amazon Web Services' },
  { id: 'gcp', type: 'gcp', title: 'Google Cloud', subtitle: 'Google Cloud' },
];

const benefits = [
  { id: 'scalable', title: 'Scalable Infrastructure', icon: 'chart', accent: 'cyan' },
  { id: 'security', title: 'Enhanced Security', icon: 'shield', accent: 'blue' },
  { id: 'efficiency', title: 'Operational Efficiency', icon: 'gear', accent: 'indigo' },
  { id: 'growth', title: 'Business Growth', icon: 'growth', accent: 'sky' },
];

const journey = [
  {
    id: 'adopt',
    number: '01',
    title: 'Adopt',
    description: 'Start your cloud journey with the right strategy.',
    icon: 'rocket',
  },
  {
    id: 'modernize',
    number: '02',
    title: 'Modernize',
    description: 'Migrate and modernize your infrastructure.',
    icon: 'sync',
  },
  {
    id: 'secure',
    number: '03',
    title: 'Secure',
    description: 'Strengthen security, reliability, and compliance.',
    icon: 'shield',
  },
  {
    id: 'optimize',
    number: '04',
    title: 'Optimize',
    description: 'Improve performance and drive continuous growth.',
    icon: 'chart',
  },
];

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<AboutSection platforms={platforms} benefits={benefits} journey={journey} />}
      />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Navigate to="/about#contact" replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={
        <AdminProvider>
          <Login />
        </AdminProvider>
      } />
      <Route path="/admin" element={
        <AdminErrorBoundary>
          <AdminProvider>
            <AdminLayout />
          </AdminProvider>
        </AdminErrorBoundary>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="applications" element={<JobApplications title="Applications" statusFilters={['New', 'Pipeline']} />} />
        <Route path="shortlisted" element={<JobApplications title="Shortlisted" statusFilters={['Shortlisted']} />} />
        <Route path="rejected" element={<JobApplications title="Rejected" statusFilters={['Rejected']} />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="interviews" element={<JobApplications title="Interviews" statusFilters={['Interview']} />} />
        <Route path="selected" element={<JobApplications title="Selected" statusFilters={['Selected']} />} />
        <Route path="recruiters" element={<Recruiters />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
