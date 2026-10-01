import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import './home-stats.css';

const stats = [
  { id: 'projects',      value: 30,  suffix: '+', label: 'Projects Delivered',      duration: 1.8 },
  { id: 'experts',       value: 15,  suffix: '+', label: 'Technology Experts',       duration: 1.4 },
  { id: 'satisfaction',  value: 98,  suffix: '%', label: 'Client Satisfaction Rate', duration: 2.0 },
  { id: 'experience',    value: 5,   suffix: '+', label: 'Years of Experience',      duration: 1.2 },
];

function CountUp({ target, suffix, duration, start }) {
  const [display, setDisplay] = useState(0);
  const reduceMotion = useReducedMotion();
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) { setDisplay(target); return; }

    const startTime = performance.now();
    const durationMs = duration * 1000;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target, duration, reduceMotion]);

  return <>{display}{suffix}</>;
}

export default function HomeStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  return (
    <section className="home-stats" ref={ref} aria-label="Key statistics">
      <div className="home-stats-inner">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            className="home-stat-card"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 32, scale: reduceMotion ? 1 : 0.94 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: reduceMotion ? 0.2 : 0.55,
              delay: reduceMotion ? 0 : i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Glow accent */}
            <span className="home-stat-glow" aria-hidden="true" />

            <motion.span
              className="home-stat-number"
              animate={inView && !reduceMotion ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.4 }}
            >
              <CountUp
                target={stat.value}
                suffix={stat.suffix}
                duration={stat.duration}
                start={inView}
              />
            </motion.span>

            <span className="home-stat-divider" aria-hidden="true" />
            <span className="home-stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
