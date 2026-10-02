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
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {/* Welcome message */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 rounded-full bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">school</span>
          </div>
          <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Welcome to College Advisor</h3>
          <p className="text-sm text-[#45464d] mb-6">
            Tell me about your exam, rank, preferences, and I'll help you find the best colleges.
          </p>

          {/* Suggested Questions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#45464d] mb-3">Try asking:</p>
            {suggestedQuestions.map((question) => (
              <button
                key={question.id}
                type="button"
                onClick={() => onSuggestedQuestion(question)}
                className="w-full text-left px-4 py-3 rounded-lg border border-[#c6c6cd] bg-white hover:bg-[#eff4ff] hover:border-[#0051d5] transition-all text-sm text-[#0b1c30]"
              >
                {question.text}
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
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-[#0051d5] text-white'
                  : 'bg-[#eff4ff] text-[#0b1c30]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

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
            <div className="bg-[#eff4ff] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0051d5] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#0051d5] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#0051d5] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
