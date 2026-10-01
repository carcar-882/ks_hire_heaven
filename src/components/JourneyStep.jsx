import { motion } from 'framer-motion';
import { CloudCog, Rocket, ShieldCheck, TrendingUp } from 'lucide-react';

const iconMap = {
  rocket: Rocket,
  sync: CloudCog,
  shield: ShieldCheck,
  chart: TrendingUp,
};

export default function JourneyStep({ item, index }) {
  const Icon = iconMap[item.icon] || Rocket;

  return (
    <motion.div
      className="journey-step"
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      variants={{
        rest: { y: 0, scale: 1 },
        hover: {
          y: -8,
          scale: 1.03,
          transition: { type: 'spring', stiffness: 360, damping: 22 },
        },
      }}
    >
      <div className="timeline-node-wrap">
        <motion.div
          className="timeline-node"
          variants={{
            rest: {
              scale: 1,
              boxShadow: '0 0 0 4px rgba(255,255,255,0.6), 0 0 18px rgba(77,164,255,0.3)',
            },
            hover: {
              scale: 1.25,
              boxShadow: '0 0 0 6px rgba(255,255,255,0.85), 0 0 28px rgba(8,120,255,0.65)',
              transition: { type: 'spring', stiffness: 450, damping: 16 },
            },
          }}
        >
          <div className="timeline-number">{item.number}</div>
        </motion.div>
      </div>

      <motion.div
        className="journey-icon-shell"
        variants={{
          rest: { scale: 1, rotate: 0 },
          hover: {
            scale: 1.16,
            rotate: 6,
            transition: { type: 'spring', stiffness: 420, damping: 16 },
          },
        }}
      >
        <Icon size={18} />
      </motion.div>

      <motion.h3
        variants={{
          rest: { color: '#143867' },
          hover: { color: '#086ad8', transition: { duration: 0.2 } },
        }}
      >
        {item.title}
      </motion.h3>
      <p>{item.description}</p>
    </motion.div>
  );
}
