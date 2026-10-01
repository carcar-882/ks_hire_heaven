import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  Archive,
  CloudCog,
  Database,
  GitBranch,
  HardDrive,
  Network,
  ShieldCheck,
} from 'lucide-react';

const capabilities = [
  { label: 'Compute', Icon: CloudCog },
  { label: 'Storage', Icon: HardDrive },
  { label: 'Databases', Icon: Database },
  { label: 'Networking', Icon: Network },
  { label: 'Security', Icon: ShieldCheck },
  { label: 'DevOps', Icon: GitBranch },
  { label: 'Monitoring', Icon: Activity },
  { label: 'Backup', Icon: Archive },
];

export default function CloudCapabilities() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="home-platform-capabilities" aria-label="Supported cloud capabilities">
      <span className="home-platform-capabilities-title">Supported cloud capabilities</span>
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: {
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.05,
            },
          },
        }}
      >
        {capabilities.map(({ label, Icon }) => (
          <motion.li
            key={label}
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 12, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
            whileHover={reduceMotion ? undefined : {
              y: -3,
              scale: 1.05,
              transition: { type: 'spring', stiffness: 450, damping: 20 },
            }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            <motion.span
              whileHover={{ rotate: 8, scale: 1.15 }}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <Icon size={16} aria-hidden="true" />
            </motion.span>
            <span>{label}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}