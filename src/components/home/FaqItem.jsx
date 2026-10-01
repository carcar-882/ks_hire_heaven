import { motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FaqItem({ item, index, isOpen, onToggle }) {
  const answerId = `home-faq-answer-${index}`;
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`home-faq-item${isOpen ? ' is-open' : ''}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.45, delay: reduceMotion ? 0 : index * 0.05, ease: 'easeOut' }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
    >
      <h3>
        <button
          type="button"
          className="home-faq-question"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
        >
          <span>{item.question}</span>
          <motion.span
            className="home-faq-plus-wrap"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus className="home-faq-plus" size={20} aria-hidden="true" />
          </motion.span>
        </button>
      </h3>
      <motion.div
        id={answerId}
        className="home-faq-answer"
        aria-hidden={!isOpen}
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.18 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <p>{item.answer}</p>
      </motion.div>
    </motion.article>
  );
}