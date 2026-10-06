import { motion, useReducedMotion } from 'framer-motion';
import brandLogo from '../assets/logo.png';
export default function CloudCore() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="cloud-core-wrap"
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.8, ease: 'easeOut' }}
    >
      <div className="cloud-core-glow" aria-hidden="true" />
      <div className="cloud-core-shell">
        <div className="core-cloud-layer layer-one" aria-hidden="true" />
        <div className="core-cloud-layer layer-two" aria-hidden="true" />
        <div className="core-cloud-layer layer-three" aria-hidden="true" />

        <div className="core-logo">
          <img src={brandLogo} alt="KS Hire Heaven Software India Pvt Ltd" className="core-brand-img" />
        </div>
      </div>
    </motion.div>
  );
}
