import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Cloud, ShieldCheck, ChartNoAxesCombined, Settings2, Lightbulb } from 'lucide-react';
import HeroBenefits from './HeroBenefits';

const contactHref = 'mailto:?subject=Cloud%20solutions%20enquiry%20-%20KS%20Hire%20Heaven';

export default function HeroContent({ benefits }) {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay, distance = 24) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : distance },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0.25 : 0.68,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });

  return (
    <div id="about" className="hero-content">
      <motion.div
        className="hero-eyebrow"
        {...fadeUp(0.1, 16)}
        whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
          transition={reduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <Cloud size={16} fill="currentColor" strokeWidth={1.6} aria-hidden="true" />
        </motion.span>
        <span>Cloud solutions for a smarter tomorrow</span>
      </motion.div>

      <motion.h1 className="hero-headline" {...fadeUp(0.2, 32)}>
        <motion.span
          className="hero-headline-line"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          Build. Scale. Secure.
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          with the <span className="hero-headline-cloud">Cloud.</span>
        </motion.span>
      </motion.h1>

      <motion.p className="hero-description" {...fadeUp(0.32, 20)}>
        We help businesses adopt, manage, and optimize modern cloud infrastructure with Microsoft Azure, AWS, and Google Cloud — driving scalability, security, reliability, and operational efficiency.
      </motion.p>

      <motion.div className="hero-ctas" {...fadeUp(0.44, 18)}>
        <motion.a
          className="hero-primary-cta"
          href={contactHref}
          whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        >
          <span>Get Started</span>
          <motion.span
            whileHover={{ x: 4 }}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <ArrowRight size={18} />
          </motion.span>
        </motion.a>

        <motion.a
          className="hero-secondary-cta"
          href="#services"
          whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        >
          <span>Explore Services</span>
          <motion.span
            whileHover={{ x: 4 }}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <ArrowRight size={18} />
          </motion.span>
        </motion.a>
      </motion.div>

      <HeroBenefits benefits={benefits} icons={[ChartNoAxesCombined, ShieldCheck, Settings2, Lightbulb]} />
    </div>
  );
}