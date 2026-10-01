import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './home-stats.css';

const StatCounter = ({ value, label, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      if (start === end) return;

      const totalDuration = 2000;
      const incrementTime = (totalDuration / end) * 1.5; // slow down slightly

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div className="home-stat-card" ref={ref}>
      <div className="stat-number">
        {count}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default function HomeStats() {
  return (
    <section className="home-stats-section">
      <div className="home-stats-grid">
        <StatCounter value="30" suffix="+" label="Projects Delivered" />
        <StatCounter value="15" suffix="+" label="Technology Experts" />
        <StatCounter value="98" suffix="%" label="Client Satisfaction Rate" />
        <StatCounter value="5" suffix="+" label="Years Of Experience" />
      </div>
    </section>
  );
}
