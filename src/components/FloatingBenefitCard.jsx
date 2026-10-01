import { motion } from 'framer-motion';
import { BarChart3, CloudCog, ShieldCheck, TrendingUp } from 'lucide-react';

const iconMap = {
  chart: BarChart3,
  gear: CloudCog,
  shield: ShieldCheck,
  growth: TrendingUp,
};

export default function FloatingBenefitCard({ title, iconName, className }) {
  const Icon = iconMap[iconName] || BarChart3;

  return (
    <motion.article
      className={`floating-card ${className || ''}`}
      initial={{ opacity: 0, y: 25, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      variants={{
        rest: { y: 0, scale: 1 },
        hover: {
          y: -10,
          scale: 1.05,
          transition: { type: 'spring', stiffness: 380, damping: 20 },
        },
      }}
    >
      <motion.div
        className="floating-icon-wrap"
        variants={{
          rest: { scale: 1, rotate: 0 },
          hover: {
            scale: 1.2,
            rotate: 6,
            transition: { type: 'spring', stiffness: 450, damping: 16 },
          },
        }}
      >
        <Icon size={18} />
      </motion.div>
      <div className="floating-copy">
        <motion.span
          variants={{
            rest: { color: '#0f2756' },
            hover: { color: '#086ad8', transition: { duration: 0.2 } },
          }}
        >
          {title}
        </motion.span>
      </div>
      <svg className="mini-chart" viewBox="0 0 120 26" aria-hidden="true">
        <motion.path
          d="M 0 18 L 22 12 L 42 15 L 58 7 L 82 11 L 100 4 L 120 9"
          variants={{
            rest: { pathLength: 1, opacity: 0.7 },
            hover: {
              pathLength: [0.3, 1],
              opacity: 1,
              transition: { duration: 0.6, ease: 'easeOut' },
            },
          }}
        />
      </svg>
    </motion.article>
  );
}
