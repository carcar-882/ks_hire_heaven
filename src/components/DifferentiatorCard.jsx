import { motion } from 'framer-motion';
import { ArrowRight, CloudCog, ShieldCheck, BarChart3, Layers3 } from 'lucide-react';

const iconMap = {
  azure: CloudCog,
  multi: Layers3,
  shield: ShieldCheck,
  stats: BarChart3,
};

export default function DifferentiatorCard({ item, index }) {
  const Icon = iconMap[item.icon] || CloudCog;

  return (
    <motion.article
      className="differentiator-card"
      initial={{ opacity: 0, y: 30, x: 0 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
    >
      <div className="differentiator-icon-shell">
        <Icon size={24} />
      </div>

      <h3>{item.title}</h3>
      <p>{item.description}</p>

      <button type="button" className="differentiator-arrow" aria-label={`Learn more about ${item.title}`}>
        <ArrowRight size={18} />
      </button>
    </motion.article>
  );
}
