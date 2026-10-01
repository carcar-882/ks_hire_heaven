import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AboutIntro() {
  return (
    <motion.div
      className="about-intro"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="eyebrow-pill" aria-label="Who we are">
        <span className="eyebrow-dot" aria-hidden="true" />
        WHO WE ARE
      </div>

      <h1 className="about-heading">
        Cloud technology
        <br />
        that moves your
        <br />
        <span className="gradient-text">business forward.</span>
      </h1>

      <p className="about-description">
        KS Hire Heaven Software India Pvt Ltd is a cloud solutions company helping
        businesses adopt, manage, and optimize modern cloud infrastructure with
        Microsoft Azure, AWS, and Google Cloud — driving scalability, security,
        reliability, and operational efficiency.
      </p>

      <motion.a
        href="#how-we-work"
        className="primary-cta"
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        Discover Our Approach
        <ArrowRight size={18} />
      </motion.a>
    </motion.div>
  );
}
