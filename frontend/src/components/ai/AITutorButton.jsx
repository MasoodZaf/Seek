import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui';
import AITutorChat from './AITutorChat';

const AITutorButton = ({ 
  variant = 'floating',
  context = {},
  code = '',
  language = 'javascript',
  size = 'md',
  className = '',
  children,
  ...props 
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => {
    // For now, show premium feature notice
    alert('🚀 AI Tutor is a Premium Feature!\n\nGet personalized coding help, code reviews, and debugging assistance.\n\nComing soon in Seek Premium!');
    // setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  if (variant === 'floating') {
    return (
      <>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`fixed bottom-6 right-6 z-40 ${className}`}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={openChat}
            className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 bg-gradient-to-r from-primary-600 to-purple-600"
            aria-label="Open AI Tutor"
            {...props}
          >
            <SparklesIcon className="h-6 w-6 text-white" />
          </Button>
          
          {/* Premium Badge */}
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            PRO
          </div>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-20" />
        </motion.div>

        <AITutorChat
          isOpen={isChatOpen}
          onClose={closeChat}
          initialContext={context}
          code={code}
          language={language}
        />
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <>
        <Button
          variant="primary"
          size={size}
          onClick={openChat}
          className={`flex items-center space-x-2 ${className}`}
          {...props}
        >
          <SparklesIcon className="h-4 w-4" />
          <span>{children || 'AI Tutor (Premium)'}</span>
        </Button>

        <AITutorChat
          isOpen={isChatOpen}
          onClose={closeChat}
          initialContext={context}
          code={code}
          language={language}
        />
      </>
    );
  }

  if (variant === 'ghost') {
    return (
      <>
        <Button
          variant="ghost"
          size={size}
          onClick={openChat}
          className={`flex items-center space-x-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 ${className}`}
          {...props}
        >
          <ChatBubbleLeftRightIcon className="h-4 w-4" />
          <span>{children || 'Get Help (Premium)'}</span>
        </Button>

        <AITutorChat
          isOpen={isChatOpen}
          onClose={closeChat}
          initialContext={context}
          code={code}
          language={language}
        />
      </>
    );
  }

  if (variant === 'icon') {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={openChat}
          className={`p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full ${className}`}
          aria-label="Ask AI Tutor"
          {...props}
        >
          <SparklesIcon className="h-5 w-5" />
        </Button>

        <AITutorChat
          isOpen={isChatOpen}
          onClose={closeChat}
          initialContext={context}
          code={code}
          language={language}
        />
      </>
    );
  }

  return null;
};

export default AITutorButton;