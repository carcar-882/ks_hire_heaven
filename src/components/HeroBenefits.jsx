import { motion, useReducedMotion } from 'framer-motion';

export default function HeroBenefits({ benefits, icons }) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className="hero-benefits" aria-label="Cloud solution benefits">
      {benefits.map((benefit, index) => {
        const Icon = icons[index];
        const shortTitles = ['Scalable Solutions', 'Enhanced Security', 'Operational Efficiency', 'Business Growth'];
        return (
          <motion.li
            key={benefit.id}
            className="hero-benefit"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.58 + index * 0.09 }}
            whileHover={reduceMotion ? undefined : 'hover'}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            variants={{
              rest: { y: 0, scale: 1 },
              hover: {
                y: -4,
                scale: 1.04,
                transition: { type: 'spring', stiffness: 450, damping: 18 },
              },
            }}
          >
            <motion.span
              className="hero-benefit-icon"
              variants={{
                rest: { scale: 1, rotate: 0 },
                hover: {
                  scale: 1.18,
                  rotate: [0, -6, 6, 0],
                  transition: { duration: 0.4 },
                },
              }}
            >
              <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
            </motion.span>
            <span>{shortTitles[index] || benefit.title}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}