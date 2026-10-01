import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Building2, GraduationCap, HeartPulse, Rocket, ShoppingBag, Workflow } from 'lucide-react';
import IndustryCard from './IndustryCard';
import './home-industries.css';

const industries = [
  { number: '01', title: 'STARTUPS & SMBs', description: 'Build scalable cloud environments that support growth without unnecessary infrastructure complexity.', Icon: Rocket },
  { number: '02', title: 'SOFTWARE & TECHNOLOGY', description: 'Modernize applications, improve deployment workflows, and create reliable cloud infrastructure for software products.', Icon: Workflow },
  { number: '03', title: 'E-COMMERCE', description: 'Support scalable digital commerce infrastructure with reliable cloud computing, storage, security, and monitoring.', Icon: ShoppingBag },
  { number: '04', title: 'EDUCATION', description: 'Support digital learning platforms, institutional applications, data environments, and scalable IT infrastructure.', Icon: GraduationCap },
  { number: '05', title: 'HEALTHCARE & SERVICES', description: 'Build secure and reliable technology environments for service-oriented organizations and digital applications.', Icon: HeartPulse },
  { number: '06', title: 'GROWING ENTERPRISES', description: 'Modernize infrastructure, strengthen cloud operations, and create scalable environments for expanding businesses.', Icon: Building2 },
];

export default function HomeIndustries() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="industries" className="home-industries" aria-labelledby="home-industries-title">
      <div className="home-industries-inner">
        <div className="home-industries-intro">
          <motion.header
            className="services-heading home-industries-heading"
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
                <span>04</span><i aria-hidden="true">/</i> Industries
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
            <h2 id="home-industries-title">Cloud technology<br />for every <span>business journey.</span></h2>
            <p>We help businesses across different industries adopt, manage, secure, and optimize cloud technology around their operational and growth requirements.</p>
          </motion.header>
        </div>

        <div className="home-industries-grid">
          {industries.map((industry, index) => <IndustryCard key={industry.number} industry={industry} index={index} />)}
        </div>

        <motion.div
          className="home-industries-cta"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: 'easeOut' }}
        >
          <div>
            <h3>Your industry is different.<br /><span>Your cloud strategy should be too.</span></h3>
            <p>Let’s build a cloud environment around your business requirements.</p>
          </div>
          <motion.a
            className="hero-primary-cta"
            href="/contact"
            whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          >
            <span>Talk to Our Cloud Team</span>
            <ArrowRight size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}