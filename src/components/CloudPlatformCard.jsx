import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Cloud } from 'lucide-react';

export default function CloudPlatformCard({ item, className, onSelect }) {
  const reduceMotion = useReducedMotion();
  const initialPosition = item.type === 'azure' ? { y: -28 } : item.type === 'aws' ? { x: -36 } : { x: 36 };

  return (
    <motion.article
      className={`platform-card ${className || ''}`}
      aria-label={item.title}
      initial={{ opacity: 0, ...(reduceMotion ? {} : initialPosition) }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
      whileHover={reduceMotion ? undefined : 'hover'}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      variants={{
        rest: { y: 0, scale: 1 },
        hover: {
          y: -9,
          scale: 1.03,
          transition: { type: 'spring', stiffness: 380, damping: 22 },
        },
      }}
      onMouseEnter={() => onSelect?.(item.id)}
      onMouseLeave={() => onSelect?.(null)}
      onFocus={() => onSelect?.(item.id)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && onSelect?.(null)}
    >
      {!reduceMotion && (
        <motion.div
          className="platform-card-sheen"
          variants={{
            rest: { opacity: 0, x: '-100%' },
            hover: {
              opacity: 0.85,
              x: '120%',
              transition: { duration: 0.8, ease: 'easeInOut' },
            },
          }}
          aria-hidden="true"
        />
      )}
      <div className={`platform-card-inner ${item.description ? 'home-platform-card-inner' : 'hero-platform-inner'}`}>
        <motion.div
          variants={{
            rest: { scale: 1, rotate: 0 },
            hover: {
              scale: 1.15,
              rotate: [0, -3, 3, 0],
              transition: { duration: 0.45, ease: 'easeInOut' },
            },
          }}
        >
          <Cloud className={`hero-provider-mark hero-provider-${item.type}`} size={42} strokeWidth={1.9} aria-hidden="true" />
        </motion.div>
        <div className="home-platform-card-copy">
          <motion.span
            className="hero-platform-name"
            variants={{
              rest: { color: '#0f2756' },
              hover: { color: '#086ad8', transition: { duration: 0.2 } },
            }}
          >
            {item.title}
          </motion.span>
          {item.label && <span className="home-platform-label">{item.label}</span>}
          {item.description && <p>{item.description}</p>}
          {item.href && (
            <a href={item.href} aria-label={`Explore ${item.title}`}>
              <span>Explore</span>
              <motion.span
                className="platform-explore-arrow"
                variants={{
                  rest: { x: 0 },
                  hover: { x: 5, transition: { type: 'spring', stiffness: 450, damping: 18 } },
                }}
              >
                <ArrowRight size={15} />
              </motion.span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
