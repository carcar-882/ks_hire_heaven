import { motion, useReducedMotion } from 'framer-motion';
import { Activity, CloudCog, Compass, Network, ShieldCheck } from 'lucide-react';
import ProcessStep from './ProcessStep';
import './home-how-we-work.css';

const process = [
  { number: '01', title: 'DISCOVER', kicker: 'UNDERSTAND', description: 'Understand your business goals, existing infrastructure, workloads, challenges, and cloud requirements.', Icon: Compass },
  { number: '02', title: 'PLAN', kicker: 'ARCHITECT', description: 'Design a practical cloud architecture aligned with scalability, security, performance, and operational requirements.', Icon: Network },
  { number: '03', title: 'BUILD', kicker: 'IMPLEMENT', description: 'Set up and deploy the required cloud infrastructure, applications, services, networking, storage, and databases.', Icon: CloudCog },
  { number: '04', title: 'SECURE', kicker: 'PROTECT', description: 'Apply security-focused configurations, access controls, backup strategies, monitoring, and resilience practices.', Icon: ShieldCheck },
  { number: '05', title: 'OPTIMIZE', kicker: 'IMPROVE', description: 'Monitor performance, improve operational efficiency, and continuously optimize your cloud environment as requirements evolve.', Icon: Activity },
];

export default function HomeHowWeWork() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-we-work" className="home-how-we-work" aria-labelledby="home-how-we-work-title">
      <div className="home-how-we-work-inner">
        <motion.header
          className="services-heading home-how-we-work-heading"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="services-section-label">
            <motion.span
              className="services-label-line"
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <motion.span
              className="services-label-pill"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
              <span>05</span><i aria-hidden="true">/</i> How We Work
            </motion.span>
            <motion.span
              className="services-label-line"
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>
          <h2 id="home-how-we-work-title">A clearer path<br />from <span>idea to cloud.</span></h2>
          <p>We follow a practical, structured approach to understand your requirements, build the right cloud environment, secure it, and continuously improve it as your business grows.</p>
        </motion.header>

        <div className="home-process-track">
          <svg className="home-process-connector" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M90 58 C180 58 180 58 300 58 S420 58 510 58 S690 58 780 58 S900 58 1110 58"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              initial={{ pathLength: 0, opacity: 0.2 }}
              whileInView={{ pathLength: 1, opacity: 0.8 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: reduceMotion ? 0.2 : 1.2, ease: 'easeInOut' }}
            />
          </svg>
          <div className="home-process-grid">
            {process.map((step, index) => <ProcessStep key={step.number} step={step} index={index} />)}
          </div>
        </div>
      </div>
    </section>
  );
}