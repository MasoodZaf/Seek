import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers] = useState([]);
  const [collaborationSession, setCollaborationSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      // Use cookies for auth instead of localStorage token
      const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001', {
        withCredentials: true, // Send cookies with WebSocket connection
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3, // Reduce attempts to avoid spam
        reconnectionDelay: 2000
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        setIsConnected(true);
        toast.success('Connected to live features! 🔌');
      });

      newSocket.on('disconnect', (reason) => {
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          newSocket.connect();
        }
      });

      newSocket.on('connect_error', () => {
        setIsConnected(false);
        // Don't show toast error - WebSocket is optional in demo mode
      });

      // User presence events
      newSocket.on('user-status-change', (data) => {
        const { userId, status } = data;
        setOnlineUsers(prev => {
          const updated = new Set(prev);
          if (status === 'online') {
            updated.add(userId);
          } else {
            updated.delete(userId);
          }
          return updated;
        });
      });

      // Collaboration events
      newSocket.on('collaboration-state', (data) => {
        setCollaborationSession(prev => ({
          ...prev,
          ...data
        }));
      });

      newSocket.on('user-joined', (data) => {
        toast.success(`${data.user.username} joined the session`);
        setCollaborationSession(prev => prev ? {
          ...prev,
          participantCount: data.participantCount
        } : null);
      });

      newSocket.on('user-left', (data) => {
        toast(`${data.user.username} left the session`, { icon: '👋' });
        setCollaborationSession(prev => prev ? {
          ...prev,
          participantCount: data.participantCount
        } : null);
      });

      // Code change events
      newSocket.on('code-changed', (data) => {
        // Handle collaborative code changes
        if (collaborationSession) {
          // Trigger callback if provided
          if (collaborationSession.onCodeChange) {
            collaborationSession.onCodeChange(data);
          }
        }
      });

      newSocket.on('cursor-moved', (data) => {
        // Handle cursor movements from other users
        if (collaborationSession?.onCursorMove) {
          collaborationSession.onCursorMove(data);
        }
      });

      newSocket.on('selection-changed', (data) => {
        // Handle text selection changes from other users
        if (collaborationSession?.onSelectionChange) {
          collaborationSession.onSelectionChange(data);
        }
      });

      // Execution events
      newSocket.on('execution-started', (data) => {
        toast(`${data.by.username} is running ${data.language} code...`, {
          icon: '▶️',
          duration: 2000
        });
      });

      newSocket.on('execution-completed', (data) => {
        const icon = data.success ? '✅' : '❌';
        toast(`${data.by.username}'s code ${data.success ? 'executed successfully' : 'failed'} (${data.executionTime}ms)`, {
          icon,
          duration: 3000
        });
      });

      // Chat events
      newSocket.on('message-received', (data) => {
        setMessages(prev => [...prev, data]);
        
        // Show toast for messages from others
        if (data.author.id !== user.id) {
          toast(`💬 ${data.author.username}: ${data.message}`, {
            duration: 4000
          });
        }
      });

      newSocket.on('user-typing', () => {
        // Handle typing indicators
      });

      // Learning events
      newSocket.on('achievement-earned', (data) => {
        if (data.user.id !== user.id) {
          toast.success(`🏆 ${data.user.username} earned "${data.achievement.name}"!`);
        }
      });

      newSocket.on('challenge-completed', (data) => {
        if (data.user.id !== user.id) {
          toast(`🎯 ${data.user.username} completed "${data.challenge.name}" (${data.challenge.difficulty})!`, {
            icon: '🎉',
            duration: 4000
          });
        }
      });

      // Help and sharing events
      newSocket.on('code-shared', (data) => {
        toast(`📤 ${data.author.username} shared: "${data.title}"`, {
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => {
              // Open shared code modal or navigate to shared code
            }
          }
        });
      });

      newSocket.on('help-requested', (data) => {
        toast(`🆘 ${data.requester.username} needs help with ${data.language}`, {
          duration: 6000,
          action: {
            label: 'Help',
            onClick: () => {
              // Open help interface
            }
          }
        });
      });

      // System events
      newSocket.on('system-announcement', (data) => {
        const toastType = data.type === 'error' ? 'error' : 
                         data.type === 'warning' ? 'error' : 'success';
        toast[toastType](`📢 ${data.message}`);
      });

      newSocket.on('force-disconnect', (data) => {
        toast.error(`You've been disconnected: ${data.reason}`);
        newSocket.disconnect();
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user, collaborationSession]);

  // Collaboration methods
  const joinCollaboration = useCallback((sessionId, language = 'javascript', callbacks = {}) => {
    if (socket && isConnected) {
      socket.emit('join-collaboration', { sessionId, language });
      setCollaborationSession({
        sessionId,
        language,
        participants: [],
        cursors: {},
        selections: {},
        ...callbacks
      });
    }
  }, [socket, isConnected]);

  const leaveCollaboration = useCallback(() => {
    if (socket && isConnected && collaborationSession) {
      socket.emit('leave-collaboration', { sessionId: collaborationSession.sessionId });
      setCollaborationSession(null);
    }
  }, [socket, isConnected, collaborationSession]);

  const sendCodeChange = useCallback((code, delta, version) => {
    if (socket && isConnected && collaborationSession) {
      socket.emit('code-change', {
        sessionId: collaborationSession.sessionId,
        code,
        delta,
        version
      });
    }
  }, [socket, isConnected, collaborationSession]);

  const sendCursorMove = useCallback((position) => {
    if (socket && isConnected && collaborationSession) {
      socket.emit('cursor-move', {
        sessionId: collaborationSession.sessionId,
        position
      });
    }
  }, [socket, isConnected, collaborationSession]);

  const sendSelectionChange = useCallback((selection) => {
    if (socket && isConnected && collaborationSession) {
      socket.emit('selection-change', {
        sessionId: collaborationSession.sessionId,
        selection
      });
    }
  }, [socket, isConnected, collaborationSession]);

  // Execution methods
  const broadcastExecutionStart = useCallback((language) => {
    if (socket && isConnected && collaborationSession) {
      socket.emit('start-execution', {
        sessionId: collaborationSession.sessionId,
        language
      });
    }
  }, [socket, isConnected, collaborationSession]);

  const broadcastExecutionResult = useCallback((result, success, executionTime) => {
    if (socket && isConnected && collaborationSession) {
      socket.emit('execution-result', {
        sessionId: collaborationSession.sessionId,
        result,
        success,
        executionTime
      });
    }
  }, [socket, isConnected, collaborationSession]);

  // Chat methods
  const sendMessage = useCallback((message, type = 'text') => {
    if (socket && isConnected) {
      const sessionId = collaborationSession?.sessionId;
      socket.emit('send-message', { sessionId, message, type });
    }
  }, [socket, isConnected, collaborationSession]);

  const startTyping = useCallback(() => {
    if (socket && isConnected && collaborationSession) {
      socket.emit('typing-start', { sessionId: collaborationSession.sessionId });
    }
  }, [socket, isConnected, collaborationSession]);

  const stopTyping = useCallback(() => {
    if (socket && isConnected && collaborationSession) {
      socket.emit('typing-stop', { sessionId: collaborationSession.sessionId });
    }
  }, [socket, isConnected, collaborationSession]);

  // Activity methods
  const broadcastActivity = useCallback((activity, metadata = {}) => {
    if (socket && isConnected) {
      socket.emit('user-activity', { activity, metadata });
    }
  }, [socket, isConnected]);

  // Sharing methods
  const shareCode = useCallback((code, language, title, description, visibility = 'public') => {
    if (socket && isConnected) {
      socket.emit('share-code', { code, language, title, description, visibility });
      toast.success('Code shared successfully! 📤');
    }
  }, [socket, isConnected]);

  const requestHelp = useCallback((code, language, problem, urgency = 'normal') => {
    if (socket && isConnected) {
      socket.emit('request-help', { code, language, problem, urgency });
      toast.success('Help request sent! Someone will assist you soon. 🆘');
    }
  }, [socket, isConnected]);

  // Learning methods
  const broadcastAchievement = useCallback((achievementId, achievementName, points) => {
    if (socket && isConnected) {
      socket.emit('achievement-earned', { achievementId, achievementName, points });
    }
  }, [socket, isConnected]);

  const broadcastChallengeCompletion = useCallback((challengeId, challengeName, difficulty, timeToComplete, score) => {
    if (socket && isConnected) {
      socket.emit('challenge-completed', { challengeId, challengeName, difficulty, timeToComplete, score });
    }
  }, [socket, isConnected]);

  const value = {
    socket,
    isConnected,
    connectedUsers,
    onlineUsers,
    collaborationSession,
    messages,
    
    // Collaboration methods
    joinCollaboration,
    leaveCollaboration,
    sendCodeChange,
    sendCursorMove,
    sendSelectionChange,
    
    // Execution methods
    broadcastExecutionStart,
    broadcastExecutionResult,
    
    // Chat methods
    sendMessage,
    startTyping,
    stopTyping,
    
    // Activity methods
    broadcastActivity,
    
    // Sharing methods
    shareCode,
    requestHelp,
    
    // Learning methods
    broadcastAchievement,
    broadcastChallengeCompletion
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;