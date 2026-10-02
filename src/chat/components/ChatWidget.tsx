import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from '../../components/ui/motion';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { chatbotService } from '../services/chatbotService';
import type { ChatMessage, SuggestedQuestion } from '../types/chat';
import type { StudentPreferences } from '../types/preferences';

// Helper function to extract preferences (same logic as in service)
const extractPreferences = (message: string, current: StudentPreferences): StudentPreferences => {
  const updated = { ...current };
  const lowerMessage = message.toLowerCase();

  // Extract exam type
  if (lowerMessage.includes('jee main')) updated.examType = 'JEE_MAIN';
  else if (lowerMessage.includes('jee advanced')) updated.examType = 'JEE_ADVANCED';
  else if (lowerMessage.includes('neet')) updated.examType = 'NEET';
  else if (lowerMessage.includes('kcet')) updated.examType = 'KCET';
  else if (lowerMessage.includes('comedk')) updated.examType = 'COMEDK';
  else if (lowerMessage.includes('mht-cet') || lowerMessage.includes('mht cet')) updated.examType = 'MHT_CET';
  else if (lowerMessage.includes('tnea')) updated.examType = 'TNEA';
  else if (lowerMessage.includes('bitsat')) updated.examType = 'BITSAT';
  else if (lowerMessage.includes('viteee')) updated.examType = 'VITEEE';

  // Extract course type
  if (lowerMessage.includes('medical') || lowerMessage.includes('mbbs') || lowerMessage.includes('bds')) {
    updated.courseType = 'MEDICAL';
    if (lowerMessage.includes('mbbs')) updated.preferredBranches = ['MBBS'];
  } else if (lowerMessage.includes('engineering') || lowerMessage.includes('b.tech') || lowerMessage.includes('b.e')) {
    updated.courseType = 'ENGINEERING';
    if (lowerMessage.includes('cse') || lowerMessage.includes('computer science')) {
      updated.preferredBranches = ['CSE'];
    } else if (lowerMessage.includes('ece') || lowerMessage.includes('electronics')) {
      updated.preferredBranches = ['ECE'];
    } else if (lowerMessage.includes('mech') || lowerMessage.includes('mechanical')) {
      updated.preferredBranches = ['MECH'];
    }
  } else if (lowerMessage.includes('management') || lowerMessage.includes('mba')) {
    updated.courseType = 'MANAGEMENT';
  }

  // Extract rank/percentile
  const rankMatch = message.match(/rank\s*(\d+)/i);
  if (rankMatch) {
    updated.rank = parseInt(rankMatch[1], 10);
  }
  const percentileMatch = message.match(/percentile\s*(\d+)/i);
  if (percentileMatch) {
    updated.percentile = parseInt(percentileMatch[1], 10);
  }

  // Extract state
  const states = ['karnataka', 'maharashtra', 'tamil nadu', 'telangana', 'delhi', 'kerala', 'punjab', 'rajasthan', 'uttar pradesh'];
  for (const state of states) {
    if (lowerMessage.includes(state)) {
      updated.homeState = state.charAt(0).toUpperCase() + state.slice(1);
      updated.preferredStates = [updated.homeState];
      updated.locationPreference = 'HOME_STATE';
      break;
    }
  }

  // Extract college type
  if (lowerMessage.includes('government') && !lowerMessage.includes('private')) {
    updated.collegeType = 'GOVERNMENT';
  } else if (lowerMessage.includes('private') && !lowerMessage.includes('government')) {
    updated.collegeType = 'PRIVATE';
  }

  // Extract budget
  const budgetMatch = message.match(/(\d+)\s*(lakhs?|l)/i);
  if (budgetMatch) {
    updated.budgetMax = parseInt(budgetMatch[1], 10) * 100000;
  } else {
    const directBudget = message.match(/(\d+)\s*(rupees?|₹)/i);
    if (directBudget) {
      updated.budgetMax = parseInt(directBudget[1], 10);
    }
  }

  // Extract placement importance
  if (lowerMessage.includes('placement') || lowerMessage.includes('job') || lowerMessage.includes('salary')) {
    updated.placementImportant = true;
  }

  // Extract research importance
  if (lowerMessage.includes('research') || lowerMessage.includes('innovation') || lowerMessage.includes('r&d')) {
    updated.researchImportant = true;
  }

  return updated;
};

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [preferences, setPreferences] = useState<StudentPreferences>(
    chatbotService.resetConversation()
  );
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>(
    chatbotService.getInitialSuggestions()
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Process message
    try {
      const updatedPreferences = extractPreferences(content, preferences);
      setPreferences(updatedPreferences);
      const response = await chatbotService.processMessage(content, updatedPreferences);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: SuggestedQuestion) => {
    handleSendMessage(question.text);
  };

  const handleReset = () => {
    setMessages([]);
    setPreferences(chatbotService.resetConversation());
    setSuggestedQuestions(chatbotService.getInitialSuggestions());
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleChat}
            className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-50 w-14 h-14 rounded-full bg-[#0051d5] text-white shadow-lg hover:bg-[#316bf3] transition-all flex items-center justify-center cursor-pointer"
            aria-label="Open chat"
          >
            <span className="material-symbols-outlined text-[28px]">chat</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 z-50 w-full sm:w-[400px] h-[600px] sm:h-[650px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#c6c6cd]/40 flex flex-col"
          >
            <ChatHeader onClose={toggleChat} onReset={handleReset} />

            <ChatMessageList
              messages={messages}
              isTyping={isTyping}
              suggestedQuestions={messages.length === 0 ? suggestedQuestions : []}
              onSuggestedQuestion={handleSuggestedQuestion}
            />

            <div ref={messagesEndRef} />

            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
