import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ProcessStep({ step, index }) {
  const reduceMotion = useReducedMotion();
  const Icon = step.Icon;

  return (
    <motion.article
      className="home-process-step"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 32, scale: reduceMotion ? 1 : 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.5,
        delay: reduceMotion ? 0 : index * 0.085,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduceMotion ? undefined : 'hover'}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      variants={{
        rest: { y: 0, scale: 1 },
        hover: {
          y: -9,
          scale: 1.025,
          transition: { type: 'spring', stiffness: 380, damping: 22 },
        },
      }}
    >
      {!reduceMotion && (
        <motion.div
          className="process-step-sheen"
          variants={{
            rest: { opacity: 0, x: '-100%' },
            hover: {
              opacity: 0.8,
              x: '120%',
              transition: { duration: 0.85, ease: 'easeInOut' },
            },
          }}
          aria-hidden="true"
        />
      )}

      <div className="home-process-step-top">
        <motion.span
          className="home-process-number"
          variants={{
            rest: { scale: 1, x: 0 },
            hover: { scale: 1.1, x: 2, transition: { duration: 0.2 } },
          }}
        >
          {step.number}
        </motion.span>
        <motion.span
          className="home-process-icon"
          variants={{
            rest: { scale: 1, rotate: 0 },
            hover: {
              scale: 1.15,
              rotate: -4,
              transition: { type: 'spring', stiffness: 420, damping: 18 },
            },
          }}
        >
          <Icon size={22} aria-hidden="true" />
        </motion.span>
      </div>

      <motion.span
        className="home-process-kicker"
        variants={{
          rest: { letterSpacing: '0.13em' },
          hover: { letterSpacing: '0.16em', color: '#0878ff', transition: { duration: 0.2 } },
        }}
      >
        {step.kicker}
      </motion.span>

      <motion.h3
        variants={{
          rest: { color: '#10244d' },
          hover: { color: '#086ad8', transition: { duration: 0.2 } },
        }}
      >
        {step.title}
      </motion.h3>
      <p>{step.description}</p>

      <motion.span
        className="home-process-arrow"
        aria-hidden="true"
        variants={{
          rest: { x: 0 },
          hover: { x: 6, transition: { type: 'spring', stiffness: 500, damping: 18 } },
        }}
      >
        <ArrowRight size={17} />
      </motion.span>
    </motion.article>
  );
}