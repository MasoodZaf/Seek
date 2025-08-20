import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  CodeBracketIcon,
  BugAntIcon,
  LightBulbIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Input, Badge, Loading } from '../ui';
import { useAuth } from '../../context/AuthContext';

const AITutorChat = ({ 
  isOpen, 
  onClose, 
  initialContext = {}, 
  code = '', 
  language = 'javascript' 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [contextType, setContextType] = useState(initialContext.type || 'general');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Icon mapping function to prevent object rendering
  const getIconComponent = (iconType) => {
    const iconMap = {
      chat: ChatBubbleLeftRightIcon,
      code: CodeBracketIcon,
      bug: BugAntIcon,
      bulb: LightBulbIcon,
    };
    return iconMap[iconType] || ChatBubbleLeftRightIcon;
  };

  const contextTypes = [
    { value: 'general', label: 'General Help', iconType: 'chat', color: 'primary' },
    { value: 'codeReview', label: 'Code Review', iconType: 'code', color: 'success' },
    { value: 'debugging', label: 'Debug Help', iconType: 'bug', color: 'error' },
    { value: 'hints', label: 'Get Hints', iconType: 'bulb', color: 'warning' }
  ];

  useEffect(() => {
    if (isOpen && !sessionId) {
      const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      // Add welcome message
      setMessages([{
        id: 'welcome',
        type: 'ai',
        content: `Hi ${user?.firstName || 'there'}! I'm your AI programming tutor. I'm here to help you learn, review your code, debug issues, or answer any programming questions. How can I assist you today?`,
        timestamp: new Date().toISOString(),
        context: { type: 'general' }
      }]);
    }
  }, [isOpen, sessionId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      context: { type: contextType }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = {
        type: contextType,
        sessionId,
        language,
        ...(code && { hasCode: true }),
        ...initialContext
      };

      const response = await fetch('/api/v1/ai-tutor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: inputMessage.trim(),
          context
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: `ai_${Date.now()}`,
          type: 'ai',
          content: data.data.response,
          timestamp: data.data.timestamp,
          context: data.data.context,
          fallback: data.data.fallback
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Tutor error:', error);
      
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: 'I apologize, but I\'m having technical difficulties right now. Please try again in a moment, or feel free to ask your question in a different way.',
        timestamp: new Date().toISOString(),
        context: { type: contextType },
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const requestCodeReview = async () => {
    if (!code || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/ai-tutor/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code,
          language,
          exerciseContext: initialContext
        })
      });

      const data = await response.json();

      if (data.success) {
        const reviewMessage = {
          id: `review_${Date.now()}`,
          type: 'ai',
          content: data.data.review,
          timestamp: data.data.timestamp,
          context: { type: 'codeReview' },
          metadata: {
            score: data.data.score,
            suggestions: data.data.suggestions,
            strengths: data.data.strengths
          }
        };

        setMessages(prev => [...prev, reviewMessage]);
        setContextType('codeReview');
      } else {
        throw new Error(data.message || 'Failed to review code');
      }
    } catch (error) {
      console.error('Code review error:', error);
      
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: 'I\'m having trouble reviewing your code right now. Please try again later.',
        timestamp: new Date().toISOString(),
        context: { type: 'codeReview' },
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async () => {
    try {
      await fetch('/api/v1/ai-tutor/conversation/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ sessionId })
      });

      setMessages([{
        id: 'welcome_new',
        type: 'ai',
        content: 'Conversation cleared! How can I help you with your programming today?',
        timestamp: new Date().toISOString(),
        context: { type: 'general' }
      }]);
      
      setContextType('general');
    } catch (error) {
      console.error('Clear conversation error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  };

  const currentContextType = contextTypes.find(ct => ct.value === contextType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary-200 bg-primary-50 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <SparklesIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-secondary-900">AI Programming Tutor</h2>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={currentContextType?.color} 
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <currentContextType.icon className="h-3 w-3" />
                  <span>{currentContextType?.label}</span>
                </Badge>
                {language && (
                  <Badge variant="secondary" size="sm">
                    {language}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={clearConversation}>
              <ArrowPathIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Context Type Selector */}
        <div className="border-b border-secondary-200 bg-secondary-50 px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {contextTypes.map((type) => (
              <Button
                key={type.value}
                variant={contextType === type.value ? type.color : 'ghost'}
                size="sm"
                onClick={() => setContextType(type.value)}
                className="flex items-center space-x-1"
              >
                {(() => {
                  const IconComponent = getIconComponent(type.iconType);
                  return <IconComponent className="h-3 w-3" />;
                })()}
                <span>{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : message.error
                      ? 'bg-error-50 border border-error-200 text-error-800'
                      : 'bg-secondary-100 text-secondary-800'
                  }`}>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    
                    {message.metadata && (
                      <div className="mt-3 space-y-2">
                        {message.metadata.score && (
                          <div className="text-xs">
                            <strong>Code Score:</strong> {message.metadata.score.overall}/100
                          </div>
                        )}
                        {message.metadata.suggestions && message.metadata.suggestions.length > 0 && (
                          <div className="text-xs">
                            <strong>Suggestions:</strong>
                            <ul className="mt-1 list-disc list-inside">
                              {message.metadata.suggestions.map((suggestion, idx) => (
                                <li key={idx}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                      {message.fallback && (
                        <span className="ml-2 text-warning-600">(Fallback response)</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-lg bg-secondary-100 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loading size="sm" />
                    <span className="text-sm text-secondary-600">AI Tutor is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        {code && (
          <div className="border-b border-secondary-200 px-6 py-3">
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={requestCodeReview}
                disabled={isLoading}
                className="flex items-center space-x-1"
              >
                <CodeBracketIcon className="h-4 w-4" />
                <span>Review My Code</span>
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-secondary-200 px-6 py-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask your AI tutor anything about ${language} programming...`}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <Button
              variant="primary"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="flex items-center space-x-1"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AITutorChat;