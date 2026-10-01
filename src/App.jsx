import { AboutSection } from './components/AboutSection';
import { Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/About';

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
      <Route path="/contact" element={<Navigate to="/about#contact" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
