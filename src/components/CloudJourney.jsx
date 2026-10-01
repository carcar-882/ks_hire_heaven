import { motion, useReducedMotion } from 'framer-motion';
import JourneyStep from './JourneyStep';

export default function CloudJourney({ items }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="cloud-journey"
      className="cloud-journey"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0.25 : 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="journey-header"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <h2>
          OUR CLOUD JOURNEY
          <span>WITH YOU</span>
        </h2>
      </motion.div>

      <motion.div
        className="journey-steps"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: {
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.08,
            },
          },
        }}
      >
        {items.map((item, index) => (
          <JourneyStep key={item.id} item={item} index={index} />
        ))}
      </motion.div>
    </motion.section>
  );
}
