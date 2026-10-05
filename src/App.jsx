import { AboutSection } from './components/AboutSection';
import { Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Careers from './pages/Careers';
import { AdminLayout } from './admin/layouts/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import JobApplications from './admin/pages/JobApplications';
import Placeholder from './admin/pages/Placeholder';

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
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="applications" element={<JobApplications />} />
        <Route path="shortlisted" element={<Placeholder title="Shortlisted" />} />
        <Route path="rejected" element={<Placeholder title="Rejected" />} />
        <Route path="jobs" element={<Placeholder title="Jobs" />} />
        <Route path="interviews" element={<Placeholder title="Interviews" />} />
        <Route path="recruiters" element={<Placeholder title="Recruiters" />} />
        <Route path="analytics" element={<Placeholder title="Analytics" />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
