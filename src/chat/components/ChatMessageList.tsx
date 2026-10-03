import React from 'react';
import { AnimatePresence, motion } from '../../components/ui/motion';
import type { ChatMessage, SuggestedQuestion } from '../types/chat';
import { CollegeRecommendationCard } from './CollegeRecommendationCard';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  suggestedQuestions: SuggestedQuestion[];
  onSuggestedQuestion: (question: SuggestedQuestion) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isTyping,
  suggestedQuestions,
  onSuggestedQuestion,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white">
      {/* Welcome message */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#159EAE]/10 text-[#159EAE] flex items-center justify-center mx-auto mb-4 border border-[#159EAE]/20">
            <span className="material-symbols-outlined text-[32px]">smart_toy</span>
          </div>
          <h3 className="text-lg font-bold text-[#12305A] mb-1.5">Welcome to College Advisor AI</h3>
          <p className="text-xs sm:text-sm text-[#5F6F82] max-w-xs mx-auto mb-6 leading-relaxed">
            Tell me about your entrance exam, percentile/rank, and preferences to discover best-match colleges.
          </p>

          {/* Suggested Questions */}
          <div className="space-y-2 text-left">
            <p className="text-xs font-bold text-[#12305A] mb-2 px-1">Try asking:</p>
            {suggestedQuestions.map((question) => (
              <button
                key={question.id}
                type="button"
                onClick={() => onSuggestedQuestion(question)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl border border-[#DCE5EF] bg-[#F7FAFD] hover:bg-white hover:border-[#159EAE] transition-all text-xs font-medium text-[#12305A] shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-between group"
              >
                <span>{question.text}</span>
                <span className="material-symbols-outlined text-[16px] text-[#159EAE] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-2xs ${
                message.role === 'user'
                  ? 'bg-[#0757C9] text-white'
                  : 'bg-[#F7FAFD] text-[#12305A] border border-[#DCE5EF]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

              {/* Attachments (College Recommendations) */}
              {message.attachments?.map((attachment, idx) => (
                <div key={idx} className="mt-3">
                  {attachment.type === 'college_recommendation' && (
                    <CollegeRecommendationCard recommendations={attachment.data} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start"
          >
            <div className="bg-[#F7FAFD] border border-[#DCE5EF] rounded-2xl px-4 py-3 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#159EAE] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#159EAE] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#159EAE] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
