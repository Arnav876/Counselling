import React from 'react';
import { useCompare } from '../../context/CompareContext';
import { AnimatePresence, motion } from '../ui/motion';

export const Toast: React.FC = () => {
  const { toastMessage } = useCompare();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 right-4 z-50 max-w-sm px-4 py-3 rounded-xl bg-[#12305A] text-white shadow-2xl border border-white/10 text-xs sm:text-sm font-medium flex items-center gap-2.5 backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-[#159EAE] text-[20px]">
            check_circle
          </span>
          <span className="flex-1">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
