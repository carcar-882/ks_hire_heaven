import {
  ChartNoAxesCombined,
  Cloud,
  CloudCog,
  CloudUpload,
  GitBranch,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

const serviceIcons = {
  cloud: CloudCog,
  migration: CloudUpload,
  security: ShieldCheck,
  devops: GitBranch,
  monitoring: ChartNoAxesCombined,
  consulting: Lightbulb,
};

export default function ServiceIcon({ name }) {
  const Icon = serviceIcons[name] || Cloud;
  return <Icon className="service-icon" size={24} strokeWidth={1.9} aria-hidden="true" />;
}