import { motion } from 'framer-motion';
import DifferentiatorCard from './DifferentiatorCard';

export default function DifferentiatorGrid({ items }) {
  return (
    <motion.section
      id="services"
      className="differentiator-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="differentiator-section-header">
        <span className="differentiator-badge">Why KS Hire Heaven</span>
        <h2>Built around the cloud. Designed around your business.</h2>
      </div>

      <div className="differentiator-grid">
        {items.map((item, index) => (
          <DifferentiatorCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
