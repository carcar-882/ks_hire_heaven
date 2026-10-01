import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ServiceDecoration from './ServiceDecoration';
import ServiceIcon from './ServiceIcon';

export default function ServiceCard({ service, index, reduceMotion }) {
  return (
    <motion.article
      className={`service-card${index === 0 ? ' service-card-featured' : ''}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 38, scale: reduceMotion ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reduceMotion ? 0.22 : 0.55,
        delay: reduceMotion ? 0 : index * 0.085,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduceMotion ? undefined : 'hover'}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      variants={{
        rest: { y: 0, scale: 1 },
        hover: {
          y: -9,
          scale: 1.02,
          transition: { type: 'spring', stiffness: 360, damping: 22 },
        },
      }}
    >
      {/* Dynamic ambient glass shimmer on hover */}
      {!reduceMotion && (
        <motion.div
          className="service-card-sheen"
          variants={{
            rest: { opacity: 0, x: '-100%' },
            hover: {
              opacity: 1,
              x: '120%',
              transition: { duration: 0.85, ease: 'easeInOut' },
            },
          }}
          aria-hidden="true"
        />
      )}

      <div className="service-card-topline">
        <motion.span
          className="service-number"
          variants={{
            rest: { scale: 1, x: 0 },
            hover: { scale: 1.08, x: 2, transition: { duration: 0.2 } },
          }}
        >
          {service.number}
        </motion.span>
        <motion.span
          className="service-icon-frame"
          variants={{
            rest: { scale: 1, rotate: 0 },
            hover: {
              scale: 1.14,
              rotate: 4,
              transition: { type: 'spring', stiffness: 400, damping: 18 },
            },
          }}
        >
          <ServiceIcon name={service.icon} />
        </motion.span>
      </div>

      <div className="service-card-copy">
        <motion.h3
          variants={{
            rest: { color: '#10244d' },
            hover: { color: '#086ad8', transition: { duration: 0.2 } },
          }}
        >
          {service.title}
        </motion.h3>
        <p>{service.description}</p>
      </div>

      <a className="service-explore" href="#how-we-work" aria-label={`Explore ${service.title}`}>
        <span>Explore</span>
        <motion.span
          className="service-explore-arrow"
          variants={{
            rest: { x: 0 },
            hover: { x: 5, transition: { type: 'spring', stiffness: 450, damping: 18 } },
          }}
        >
          <ArrowRight size={17} />
        </motion.span>
      </a>

      <motion.div
        variants={{
          rest: { scale: 1, opacity: 0.085, rotate: 0 },
          hover: {
            scale: 1.12,
            opacity: 0.16,
            rotate: 3,
            transition: { duration: 0.35, ease: 'easeOut' },
          },
        }}
      >
        <ServiceDecoration variant={service.decoration} />
      </motion.div>
    </motion.article>
  );
}