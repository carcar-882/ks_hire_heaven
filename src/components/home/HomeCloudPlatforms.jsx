import { useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Cloud } from 'lucide-react';
import CloudCore from '../CloudCore';
import CloudPlatformCard from '../CloudPlatformCard';
import CloudOrbit from './CloudOrbit';
import CloudCapabilities from './CloudCapabilities';
import './HomeCloudPlatforms.css';

const cloudPlatforms = [
  {
    id: 'azure',
    type: 'azure',
    title: 'Microsoft Azure',
    label: 'PRIMARY CLOUD PLATFORM',
    description: 'Azure-first expertise for secure, scalable, and future-ready cloud environments.',
    className: 'home-platform-azure',
  },
  {
    id: 'aws',
    type: 'aws',
    title: 'Amazon Web Services',
    label: 'CLOUD PLATFORM',
    description: 'Flexible cloud infrastructure and services for scalable business workloads.',
    className: 'home-platform-aws',
  },
  {
    id: 'gcp',
    type: 'gcp',
    title: 'Google Cloud',
    label: 'CLOUD PLATFORM',
    description: 'Modern cloud capabilities for applications, infrastructure, data, and digital growth.',
    className: 'home-platform-gcp',
  },
];

export default function HomeCloudPlatforms() {
  const reduceMotion = useReducedMotion();
  const [activePlatform, setActivePlatform] = useState(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 80, damping: 22, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 80, damping: 22, mass: 0.7 });
  const backgroundX = useTransform(springX, (value) => value * 0.12);
  const backgroundY = useTransform(springY, (value) => value * 0.12);
  const coreX = useTransform(springX, (value) => value * 0.36);
  const coreY = useTransform(springY, (value) => value * 0.36);
  const cardsX = useTransform(springX, (value) => value * 0.62);
  const cardsY = useTransform(springY, (value) => value * 0.62);

  const updatePointer = (event) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 14);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 12);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section id="cloud-platforms" className="home-cloud-platforms" aria-labelledby="home-cloud-platforms-title">
      <div className="home-platforms-inner">
        <motion.header
          className="services-heading home-platforms-heading"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: reduceMotion ? 0.22 : 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              <span>03</span><i aria-hidden="true">/</i> Cloud Platforms
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
          <h2 id="home-cloud-platforms-title">One cloud strategy.<br /><span>Multiple possibilities.</span></h2>
          <p>Build, migrate, secure, and optimize your cloud environment with the flexibility of Azure, AWS, and Google Cloud.</p>
        </motion.header>

        <div className="home-platform-ecosystem" onMouseMove={updatePointer} onMouseLeave={resetPointer}>
          <motion.div className="home-platform-atmosphere" style={{ x: backgroundX, y: backgroundY }} aria-hidden="true" />
          <CloudOrbit activePlatform={activePlatform} reduced={reduceMotion} />

          <motion.div
            className="home-platform-core-anchor"
            style={{ x: coreX, y: coreY }}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: reduceMotion ? 0.22 : 0.7, delay: reduceMotion ? 0 : 0.12, ease: 'easeOut' }}
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            whileHover={reduceMotion ? undefined : { scale: 1.015 }}
          >
            <CloudCore />
          </motion.div>

          <div className="home-platform-cards">
            {cloudPlatforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                className={`home-platform-card-anchor ${platform.className}`}
                style={{ x: cardsX, y: cardsY }}
                initial={{ opacity: 0, ...(reduceMotion ? {} : index === 0 ? { y: -34 } : index === 1 ? { x: -38 } : { x: 38 }) }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: reduceMotion ? 0.22 : 0.62, delay: reduceMotion ? 0 : 0.2 + index * 0.1, ease: 'easeOut' }}
              >
                <CloudPlatformCard
                  item={{ ...platform, href: '/#services' }}
                  className="home-platform-card"
                  onSelect={setActivePlatform}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="home-platform-capabilities-wrap"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : 0.15, ease: 'easeOut' }}
        >
          <CloudCapabilities />
        </motion.div>

        <motion.div
          className="home-platform-more"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.a
            href="/about#cloud-expertise"
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          >
            <span>Explore our cloud approach</span>
            <ArrowRight size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}