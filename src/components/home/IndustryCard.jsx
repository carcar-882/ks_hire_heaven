import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function IndustryCard({ industry, index }) {
  const reduceMotion = useReducedMotion();
  const Icon = industry.Icon;

  return (
    <motion.article
      className="home-industry-card"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 34, scale: reduceMotion ? 1 : 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reduceMotion ? 0.22 : 0.52,
        delay: reduceMotion ? 0 : index * 0.08,
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
          className="industry-card-sheen"
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

      <div className="home-industry-card-top">
        <motion.span
          className="home-industry-number"
          variants={{
            rest: { scale: 1, x: 0 },
            hover: { scale: 1.08, x: 2, transition: { duration: 0.2 } },
          }}
        >
          {industry.number}
        </motion.span>
        <motion.span
          className="home-industry-icon"
          variants={{
            rest: { scale: 1, rotate: 0 },
            hover: {
              scale: 1.15,
              rotate: 5,
              transition: { type: 'spring', stiffness: 420, damping: 18 },
            },
          }}
        >
          <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
        </motion.span>
      </div>

      <motion.h3
        variants={{
          rest: { color: '#10244d' },
          hover: { color: '#086ad8', transition: { duration: 0.2 } },
        }}
      >
        {industry.title}
      </motion.h3>
      <p>{industry.description}</p>

      <motion.a
        href="/#cloud-platforms"
        aria-label={`Explore cloud platforms for ${industry.title}`}
        variants={{
          rest: { scale: 1 },
          hover: {
            scale: 1.12,
            transition: { type: 'spring', stiffness: 450, damping: 18 },
          },
        }}
      >
        <motion.span
          className="industry-arrow-wrap"
          variants={{
            rest: { x: 0 },
            hover: { x: 3, transition: { type: 'spring', stiffness: 500, damping: 18 } },
          }}
        >
          <ArrowRight size={19} aria-hidden="true" />
        </motion.span>
      </motion.a>

      <motion.span
        className="home-industry-card-glow"
        aria-hidden="true"
        variants={{
          rest: { opacity: 0, scale: 0.9 },
          hover: { opacity: 1, scale: 1.15, transition: { duration: 0.35 } },
        }}
      />
    </motion.article>
  );
}