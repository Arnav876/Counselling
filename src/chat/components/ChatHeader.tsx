import React from 'react';

interface ChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onReset }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#DCE5EF] bg-gradient-to-r from-[#159EAE]/10 via-[#F7FAFD] to-[#0757C9]/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#159EAE] text-white flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#12305A]">College Advisor AI</h3>
          <p className="text-xs text-[#5F6F82]">Admission by Choice Guidance</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded-lg text-[#5F6F82] hover:text-[#12305A] hover:bg-white/80 transition-colors cursor-pointer"
          title="Reset conversation"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#5F6F82] hover:text-[#12305A] hover:bg-white/80 transition-colors cursor-pointer"
          title="Close chat"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
};
