import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function DropdownMenu({ items, isOpen, onClose }) {
  if (!items || items.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dropdown-panel"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {items.map((item) => (
            <a key={item.label} href={item.href || '#'} className="dropdown-item" onClick={onClose}>
              <span className="dropdown-icon">{item.icon || <ChevronRight size={14} />}</span>
              <span>{item.label}</span>
              <ArrowRight size={12} className="dropdown-arrow" />
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
