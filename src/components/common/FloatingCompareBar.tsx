import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { AnimatePresence, motion } from '../ui/motion';

export const FloatingCompareBar: React.FC = () => {
  const { compareList, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 128, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 128, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 sm:bottom-4 inset-x-0 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[92%] sm:max-w-3xl z-40 bg-[#0b1c30] text-white p-3.5 sm:rounded-2xl shadow-2xl border border-[#c6c6cd]/30"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar py-1">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="material-symbols-outlined text-[#069669] text-[20px]">compare_arrows</span>
              <span className="text-xs font-semibold">
                Comparison ({compareList.length}/3 colleges)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {compareList.map((college) => (
                <div
                  key={college.id}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/10 border border-white/20"
                >
                  <span className="text-xs font-semibold">{college.shortName}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              className="p-1.5 rounded-lg text-white/60 hover:text-white text-xs hover:bg-white/10 transition-colors"
              title="Clear All"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>
            <Link
              to="/compare"
              className="px-4 py-2 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#316bf3] transition-all active:scale-[0.98] shadow-sm"
            >
              Compare Now ({compareList.length})
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
