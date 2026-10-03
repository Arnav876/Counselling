import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3.5 border-t border-[#DCE5EF] bg-white">
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about colleges, cutoffs, NRI seats..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-[#DCE5EF] px-3.5 py-2.5 text-xs sm:text-sm text-[#12305A] placeholder:text-[#5F6F82]/60 focus:border-[#159EAE] focus:ring-1 focus:ring-[#159EAE] focus:outline-none disabled:opacity-50 max-h-32 bg-[#F7FAFD]"
          style={{ minHeight: '44px' }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="w-11 h-11 rounded-xl bg-[#159EAE] text-white flex items-center justify-center hover:bg-[#087C8B] transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </div>
    </div>
  );
};
