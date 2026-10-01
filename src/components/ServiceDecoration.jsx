import {
  ChartNoAxesCombined,
  Cloud,
  GitBranch,
  Orbit,
  ShieldCheck,
} from 'lucide-react';

const decorationIcons = {
  cloud: Cloud,
  security: ShieldCheck,
  devops: GitBranch,
  monitoring: ChartNoAxesCombined,
  consulting: Orbit,
};

export default function ServiceDecoration({ variant }) {
  if (variant === 'migration') {
    return (
      <svg className="service-decoration service-decoration-migration" viewBox="0 0 150 120" aria-hidden="true">
        <path d="m74 22 32 18-32 18-32-18 32-18Z" />
        <path d="M42 40v37l32 19V58L42 40Zm64 0v37L74 96V58l32-18Z" />
        <path d="m105 69 20 11-20 12-20-12 20-11Zm-20 12v23l20 12V92L85 81Zm40 0v23l-20 12V92l20-11Z" />
      </svg>
    );
  }

  const Icon = decorationIcons[variant] || Cloud;
  return <Icon className={`service-decoration service-decoration-${variant}`} size={118} strokeWidth={0.9} aria-hidden="true" />;
}