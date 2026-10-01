import { motion, useReducedMotion } from 'framer-motion';

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
          <span className="core-mark">KS</span>
          <span className="core-caption">HIRE HEAVEN</span>
          <span className="core-subcaption">SOFTWARE INDIA PVT LTD</span>
        </div>
      </div>
    </motion.div>
  );
}
