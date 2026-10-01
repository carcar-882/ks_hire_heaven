import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FaqItem from './FaqItem';
import './home-faq.css';

const questions = [
  {
    question: 'Do I need cloud experience before we begin?',
    answer: 'No. We can work with you based on your current technical environment and requirements. We can help explain the available cloud options and guide the implementation process.',
  },
  {
    question: 'Which cloud platforms do you work with?',
    answer: 'Our primary cloud focus is Microsoft Azure. We also work with Amazon Web Services and Google Cloud depending on the project’s requirements.',
  },
  {
    question: 'Can you help migrate existing workloads?',
    answer: 'Yes. We can support cloud migration and modernization planning for existing workloads, including infrastructure, applications, storage, databases, and related cloud services.',
  },
  {
    question: 'How do you approach cloud security?',
    answer: 'We take a security-focused approach that can include access controls, infrastructure configuration, monitoring, backup, disaster recovery, and other security practices based on the project requirements.',
  },
  {
    question: 'Who can work with KS Hire Heaven?',
    answer: 'We work with startups, small and medium-sized businesses, software companies, e-commerce businesses, educational organizations, healthcare and service organizations, and growing enterprises.',
  },
  {
    question: 'What support is available after implementation?',
    answer: 'We can provide ongoing technical support, monitoring, optimization, infrastructure management, and cloud consulting based on the agreed requirements.',
  },
  {
    question: 'How can I discuss my cloud requirements?',
    answer: 'You can contact our team directly to discuss your existing infrastructure, cloud requirements, migration plans, or optimization needs.',
  },
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="home-faq" aria-labelledby="home-faq-title">
      <div className="home-faq-inner">
        <motion.header
          className="home-faq-intro"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: 'easeOut' }}
        >
          <span className="home-faq-eyebrow"><span />COMMON QUESTIONS</span>
          <h2 id="home-faq-title">Questions we get <span>asked most.</span></h2>
          <p>If you don’t see your question here, contact us directly to discuss your cloud requirements.</p>
          <motion.a
            href="mailto:ks.hireheavensoftwareindia@gmail.com"
            className="home-faq-contact"
            whileHover={reduceMotion ? undefined : { scale: 1.05, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          >
            <span>Ask us anything</span>
            <ArrowRight size={16} />
          </motion.a>
        </motion.header>

        <div className="home-faq-list" aria-label="Frequently asked questions" tabIndex={0}>
          {questions.map((item, index) => (
            <FaqItem
              key={item.question}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex((current) => current === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}