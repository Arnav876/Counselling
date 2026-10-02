import React from 'react';

interface ChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onReset }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#c6c6cd]/30 bg-[#eff4ff]/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0051d5] text-white flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">school</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0b1c30]">College Advisor</h3>
          <p className="text-xs text-[#45464d]">AI-powered admission guidance</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded-lg text-[#45464d] hover:bg-[#eff4ff] transition-colors"
          title="Reset conversation"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#45464d] hover:bg-[#eff4ff] transition-colors"
          title="Close chat"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
};
