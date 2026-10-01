import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ServiceCard from './ServiceCard';
import './CloudServices.css';

const services = [
  {
    number: '01',
    title: 'Cloud Infrastructure',
    description: 'Architecture, setup, virtual machines, storage, databases, networking, and infrastructure management.',
    icon: 'cloud',
    decoration: 'cloud',
  },
  {
    number: '02',
    title: 'Migration & Modernization',
    description: 'Move on-premises workloads to cloud environments with practical modernization strategies.',
    icon: 'migration',
    decoration: 'migration',
  },
  {
    number: '03',
    title: 'Cloud Security',
    description: 'Security-focused implementation, access controls, compliance support, backup, and disaster recovery.',
    icon: 'security',
    decoration: 'security',
  },
  {
    number: '04',
    title: 'DevOps & CI/CD',
    description: 'Automated deployment pipelines and application delivery practices that help teams release reliably.',
    icon: 'devops',
    decoration: 'devops',
  },
  {
    number: '05',
    title: 'Monitoring & Optimization',
    description: 'Cloud monitoring, operational visibility, performance tuning, and cost-conscious optimization.',
    icon: 'monitoring',
    decoration: 'monitoring',
  },
  {
    number: '06',
    title: 'Technical Consulting',
    description: 'Cloud and IT consulting tailored to your architecture, delivery, support, and growth requirements.',
    icon: 'consulting',
    decoration: 'consulting',
  },
];

export default function CloudServices() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="services"
      className="cloud-services"
      aria-labelledby="cloud-services-title"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0.25 : 0.65, ease: 'easeOut' }}
    >
      <div className="services-atmosphere" aria-hidden="true">
        <motion.span
          className="services-cloud services-cloud-left"
          animate={reduceMotion ? undefined : { x: [0, 15, 0], y: [0, -10, 0] }}
          transition={reduceMotion ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="services-cloud services-cloud-right"
          animate={reduceMotion ? undefined : { x: [0, -18, 0], y: [0, 12, 0] }}
          transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <svg className="services-orbit" viewBox="0 0 1440 720" preserveAspectRatio="none">
          <motion.path
            d="M-80 540C190 320 400 335 575 510s379 199 522-17S1335 155 1515 250"
            initial={{ pathLength: 0, opacity: 0.3 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0.2 : 1.4, ease: 'easeInOut' }}
          />
          <motion.path
            d="M-55 602C180 422 416 423 600 576s360 183 501-7 259-312 456-225"
            initial={{ pathLength: 0, opacity: 0.3 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0.2 : 1.6, delay: 0.2, ease: 'easeInOut' }}
          />
        </svg>
        <span className="services-dotfield" />
      </div>

      <div className="cloud-services-inner">
        <motion.div
          className="services-heading"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0.25 : 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              <span>02</span><i aria-hidden="true">/</i> Cloud &amp; IT Services
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
          <h2 id="cloud-services-title">Everything your cloud needs to <span>move forward.</span></h2>
          <p>From first migration to ongoing optimization, we provide practical cloud engineering and technical support around your business requirements.</p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.number} service={service} index={index} reduceMotion={reduceMotion} />
          ))}
        </div>

        <motion.div
          className="services-view-all-wrap"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.a
            className="hero-secondary-cta services-view-all"
            href="/about#cloud-approach"
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          >
            <span>View All Services</span>
            <ArrowRight size={17} />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}