import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
  PlayIcon,
  PaperAirplaneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button, Badge, Card, Input } from '../ui';
import CodeEditor from '../editor/CodeEditor/CodeEditor';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CollaborativeEditor = ({
  initialCode = '',
  language = 'javascript',
  sessionId,
  onCodeChange,
  onExecute
}) => {
  const { user } = useAuth();
  const {
    isConnected,
    joinCollaboration,
    leaveCollaboration,
    sendCodeChange,
    sendCursorMove,
    sendSelectionChange,
    sendMessage,
    startTyping,
    stopTyping,
    collaborationSession,
    messages,
    broadcastExecutionStart
  } = useSocket();

  const [code, setCode] = useState(initialCode);
  const [participants, setParticipants] = useState([]);
  const [cursors, setCursors] = useState({});
  const [selections, setSelections] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const editorRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Join collaboration session on mount
  useEffect(() => {
    if (isConnected && sessionId) {
      const callbacks = {
        onCodeChange: handleRemoteCodeChange,
        onCursorMove: handleRemoteCursorMove,
        onSelectionChange: handleRemoteSelectionChange
      };
      
      joinCollaboration(sessionId, language, callbacks);
      
      return () => {
        leaveCollaboration();
      };
    }
  }, [isConnected, sessionId, language, joinCollaboration, leaveCollaboration, handleRemoteCodeChange, handleRemoteCursorMove, handleRemoteSelectionChange]);

  // Update participants when collaboration session changes
  useEffect(() => {
    if (collaborationSession) {
      setParticipants(collaborationSession.participants || []);
      setCursors(collaborationSession.cursors || {});
      setSelections(collaborationSession.selections || {});
      
      if (collaborationSession.code && collaborationSession.code !== code) {
        setCode(collaborationSession.code);
      }
    }
  }, [collaborationSession, code]);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle remote code changes
  const handleRemoteCodeChange = useCallback((data) => {
    if (data.author.id !== user.id) {
      setCode(data.code);
      if (onCodeChange) {
        onCodeChange(data.code);
      }
    }
  }, [user.id, onCodeChange]);

  // Handle remote cursor movements
  const handleRemoteCursorMove = useCallback((data) => {
    if (data.userId !== user.id) {
      setCursors(prev => ({
        ...prev,
        [data.userId]: data.position
      }));
    }
  }, [user.id]);

  // Handle remote selection changes
  const handleRemoteSelectionChange = useCallback((data) => {
    if (data.userId !== user.id) {
      setSelections(prev => ({
        ...prev,
        [data.userId]: data.selection
      }));
    }
  }, [user.id]);

  // Handle local code changes
  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    
    // Send code change to other participants
    if (isConnected && collaborationSession) {
      sendCodeChange(newCode, null, Date.now());
    }
    
    // Handle typing indicators
    if (!isTyping) {
      setIsTyping(true);
      startTyping();
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping();
    }, 1000);
    
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  }, [isConnected, collaborationSession, isTyping, sendCodeChange, startTyping, stopTyping, onCodeChange]);

  // Handle cursor position changes
  const handleCursorPositionChange = useCallback((position) => {
    if (isConnected && collaborationSession) {
      sendCursorMove(position);
    }
  }, [isConnected, collaborationSession, sendCursorMove]);

  // Handle text selection changes
  const handleSelectionChange = useCallback((selection) => {
    if (isConnected && collaborationSession) {
      sendSelectionChange(selection);
    }
  }, [isConnected, collaborationSession, sendSelectionChange]);

  // Handle code execution
  const handleExecute = useCallback(() => {
    if (isConnected && collaborationSession) {
      broadcastExecutionStart(language);
    }
    
    if (onExecute) {
      onExecute(code, language);
    }
  }, [isConnected, collaborationSession, broadcastExecutionStart, language, onExecute, code]);

  // Handle sending chat messages
  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    
    if (newMessage.trim() && isConnected) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  }, [newMessage, isConnected, sendMessage]);

  // Get participant color
  const getParticipantColor = (userId) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    
    const hash = userId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Generate session invitation link
  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/playground?session=${sessionId}`;
    
    navigator.clipboard.writeText(inviteUrl).then(() => {
      toast.success('Invitation link copied to clipboard! 📋');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Collaboration Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-secondary-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-secondary-700">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          
          {isConnected && (
            <Badge variant="primary" className="flex items-center space-x-1">
              <UsersIcon className="w-4 h-4" />
              <span>{participants.length} participants</span>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            icon={UsersIcon}
          >
            Participants
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={generateInviteLink}
            icon={ShareIcon}
          >
            Invite
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            icon={ChatBubbleLeftIcon}
            className={showChat ? 'bg-primary-100 text-primary-700' : ''}
          >
            Chat
            {messages.length > 0 && (
              <Badge variant="error" size="sm" className="ml-1">
                {messages.length}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleExecute}
            icon={PlayIcon}
            disabled={!code.trim()}
          >
            Run Code
          </Button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Code Editor */}
        <div className="flex-1 relative">
          <CodeEditor
            ref={editorRef}
            value={code}
            language={language}
            theme="vs-dark"
            onChange={handleCodeChange}
            onCursorPositionChange={handleCursorPositionChange}
            onSelectionChange={handleSelectionChange}
            height="100%"
            options={{
              fontSize: 14,
              wordWrap: 'on',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: false
            }}
          />
          
          {/* Participant Cursors Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {Object.entries(cursors).map(([userId, position]) => {
              const participant = participants.find(p => p.id === userId);
              if (!participant || userId === user.id) return null;
              
              return (
                <motion.div
                  key={userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none"
                  style={{
                    left: position?.column * 7 || 0, // Approximate character width
                    top: position?.lineNumber * 19 || 0, // Approximate line height
                    zIndex: 1000
                  }}
                >
                  <div className={`w-0.5 h-5 ${getParticipantColor(userId)}`} />
                  <div className={`px-2 py-1 text-xs text-white rounded ${getParticipantColor(userId)} mt-1`}>
                    {participant.username}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Participants Panel */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l border-secondary-200 overflow-hidden"
            >
              <Card className="h-full border-0 rounded-none">
                <div className="p-4 border-b border-secondary-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-secondary-900">Participants</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowParticipants(false)}
                      icon={XMarkIcon}
                    />
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${getParticipantColor(participant.id)} flex items-center justify-center text-white text-sm font-medium`}>
                        {participant.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-secondary-900">
                          {participant.username}
                          {participant.id === user.id && (
                            <span className="text-xs text-secondary-500 ml-2">(You)</span>
                          )}
                        </div>
                        <div className="text-xs text-secondary-500">
                          {typingUsers.has(participant.id) ? 'Typing...' : 'Active'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l border-secondary-200 overflow-hidden"
            >
              <Card className="h-full border-0 rounded-none flex flex-col">
                <div className="p-4 border-b border-secondary-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-secondary-900">Chat</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowChat(false)}
                      icon={XMarkIcon}
                    />
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.author.id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.author.id === user.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-secondary-100 text-secondary-900'
                        }`}
                      >
                        {message.author.id !== user.id && (
                          <div className="text-xs font-medium mb-1">
                            {message.author.username}
                          </div>
                        )}
                        <div className="text-sm">{message.message}</div>
                        <div className={`text-xs mt-1 ${
                          message.author.id === user.id ? 'text-primary-100' : 'text-secondary-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-secondary-200">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      icon={PaperAirplaneIcon}
                      disabled={!newMessage.trim()}
                    />
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollaborativeEditor;