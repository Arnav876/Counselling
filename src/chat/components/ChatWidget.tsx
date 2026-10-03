import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from '../../components/ui/motion';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { chatbotService } from '../services/chatbotService';
import type { ChatMessage, SuggestedQuestion } from '../types/chat';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeCollegeIds, setActiveCollegeIds] = useState<string[]>([]);
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

    try {
      // Build conversation history for context
      const history: { role: 'user' | 'assistant'; content: string }[] = messages
        .slice(-6)
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const res = await chatbotService.processMessage(content, history, activeCollegeIds);

      // Track newly returned colleges
      let newAttachments: any[] | undefined = undefined;
      if (res.colleges && res.colleges.length > 0) {
        const returnedIds = res.colleges.map((c: any) => c.id).filter(Boolean);
        if (returnedIds.length > 0) {
          setActiveCollegeIds(returnedIds);
        }
        newAttachments = [
          {
            type: 'college_recommendation',
            data: res.colleges,
          },
        ];
      }

      // Update suggested follow-up questions
      if (res.suggestions && res.suggestions.length > 0) {
        setSuggestedQuestions(
          res.suggestions.map((text, idx) => ({
            id: `sug-${Date.now()}-${idx}`,
            text,
          }))
        );
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.message,
        timestamp: new Date(),
        attachments: newAttachments,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I could not connect to the database. Please ensure your network is connected or contact our counselor helpline at +91 78790 84889.',
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
    setActiveCollegeIds([]);
    setSuggestedQuestions(chatbotService.getInitialSuggestions());
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button - Teal Accent as per visual direction */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleChat}
            className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-50 w-14 h-14 rounded-full bg-[#159EAE] text-white shadow-xl hover:bg-[#087C8B] transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Open Admission AI Advisor"
          >
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
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
            className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 z-50 w-full sm:w-[420px] h-[600px] sm:h-[650px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#DCE5EF] flex flex-col overflow-hidden"
          >
            <ChatHeader onClose={toggleChat} onReset={handleReset} />

            <ChatMessageList
              messages={messages}
              isTyping={isTyping}
              suggestedQuestions={suggestedQuestions}
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

