const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const logger = require('../config/logger');
const { User } = require('../models');

class SocketService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> {socketId, userInfo}
    this.activeRooms = new Map(); // roomId -> {participants, codeState}
    this.collaborationSessions = new Map(); // sessionId -> {participants, code, language}

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        // Try to get token from cookies first, then fallback to auth header
        let token = null;

        if (socket.handshake.headers.cookie) {
          const cookies = cookie.parse(socket.handshake.headers.cookie);
          token = cookies.accessToken;
        }

        if (!token) {
          token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        }

        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user in SQLite database
        const user = await User.findByPk(decoded.id);
        if (!user) {
          return next(new Error('User session expired'));
        }

        socket.userId = user.id;
        socket.userInfo = {
          id: user.id,
          username: user.username,
          email: user.email
        };

        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.userInfo.username} (${socket.id})`);

      // Store user connection
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        userInfo: socket.userInfo,
        connectedAt: new Date()
      });

      // Handle user going online
      this.broadcastUserStatus(socket.userId, 'online');

      // Collaboration events
      socket.on('join-collaboration', (data) => this.handleJoinCollaboration(socket, data));
      socket.on('leave-collaboration', (data) => this.handleLeaveCollaboration(socket, data));
      socket.on('code-change', (data) => this.handleCodeChange(socket, data));
      socket.on('cursor-move', (data) => this.handleCursorMove(socket, data));
      socket.on('selection-change', (data) => this.handleSelectionChange(socket, data));

      // Code execution events
      socket.on('start-execution', (data) => this.handleStartExecution(socket, data));
      socket.on('execution-result', (data) => this.handleExecutionResult(socket, data));

      // Chat events
      socket.on('send-message', (data) => this.handleSendMessage(socket, data));
      socket.on('typing-start', (data) => this.handleTypingStart(socket, data));
      socket.on('typing-stop', (data) => this.handleTypingStop(socket, data));

      // Presence events
      socket.on('user-activity', (data) => this.handleUserActivity(socket, data));

      // File sharing events
      socket.on('share-code', (data) => this.handleShareCode(socket, data));
      socket.on('request-help', (data) => this.handleRequestHelp(socket, data));

      // Learning events
      socket.on('achievement-earned', (data) => this.handleAchievementEarned(socket, data));
      socket.on('challenge-completed', (data) => this.handleChallengeCompleted(socket, data));

      // Disconnect handler
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  // Collaboration handlers
  handleJoinCollaboration(socket, data) {
    const { sessionId, language } = data;

    socket.join(`collaboration:${sessionId}`);

    if (!this.collaborationSessions.has(sessionId)) {
      this.collaborationSessions.set(sessionId, {
        participants: new Map(),
        code: '',
        language: language || 'javascript',
        createdAt: new Date(),
        cursors: new Map(),
        selections: new Map()
      });
    }

    const session = this.collaborationSessions.get(sessionId);
    session.participants.set(socket.userId, {
      socketId: socket.id,
      userInfo: socket.userInfo,
      joinedAt: new Date()
    });

    // Send current code state to new participant
    socket.emit('collaboration-state', {
      code: session.code,
      language: session.language,
      participants: Array.from(session.participants.values()).map((p) => p.userInfo),
      cursors: Object.fromEntries(session.cursors),
      selections: Object.fromEntries(session.selections)
    });

    // Notify other participants
    socket.to(`collaboration:${sessionId}`).emit('user-joined', {
      user: socket.userInfo,
      participantCount: session.participants.size
    });

    logger.info(`User ${socket.userInfo.username} joined collaboration session ${sessionId}`);
  }

  handleLeaveCollaboration(socket, data) {
    const { sessionId } = data;

    socket.leave(`collaboration:${sessionId}`);

    if (this.collaborationSessions.has(sessionId)) {
      const session = this.collaborationSessions.get(sessionId);
      session.participants.delete(socket.userId);
      session.cursors.delete(socket.userId);
      session.selections.delete(socket.userId);

      // Notify other participants
      socket.to(`collaboration:${sessionId}`).emit('user-left', {
        user: socket.userInfo,
        participantCount: session.participants.size
      });

      // Clean up empty sessions
      if (session.participants.size === 0) {
        this.collaborationSessions.delete(sessionId);
        logger.info(`Collaboration session ${sessionId} cleaned up`);
      }
    }
  }

  handleCodeChange(socket, data) {
    const {
      sessionId, code, delta, version
    } = data;

    if (this.collaborationSessions.has(sessionId)) {
      const session = this.collaborationSessions.get(sessionId);
      session.code = code;
      session.lastModified = new Date();
      session.lastModifiedBy = socket.userId;

      // Broadcast to other participants
      socket.to(`collaboration:${sessionId}`).emit('code-changed', {
        code,
        delta,
        version,
        author: socket.userInfo,
        timestamp: new Date()
      });
    }
  }

  handleCursorMove(socket, data) {
    const { sessionId, position } = data;

    if (this.collaborationSessions.has(sessionId)) {
      const session = this.collaborationSessions.get(sessionId);
      session.cursors.set(socket.userId, {
        position,
        user: socket.userInfo,
        timestamp: new Date()
      });

      socket.to(`collaboration:${sessionId}`).emit('cursor-moved', {
        userId: socket.userId,
        position,
        user: socket.userInfo
      });
    }
  }

  handleSelectionChange(socket, data) {
    const { sessionId, selection } = data;

    if (this.collaborationSessions.has(sessionId)) {
      const session = this.collaborationSessions.get(sessionId);
      session.selections.set(socket.userId, {
        selection,
        user: socket.userInfo,
        timestamp: new Date()
      });

      socket.to(`collaboration:${sessionId}`).emit('selection-changed', {
        userId: socket.userId,
        selection,
        user: socket.userInfo
      });
    }
  }

  // Code execution handlers
  handleStartExecution(socket, data) {
    const { sessionId, language } = data;

    // Broadcast execution start to collaboration participants
    if (sessionId) {
      socket.to(`collaboration:${sessionId}`).emit('execution-started', {
        by: socket.userInfo,
        language,
        timestamp: new Date()
      });
    }
  }

  handleExecutionResult(socket, data) {
    const {
      sessionId, result, success, executionTime
    } = data;

    // Broadcast execution result to collaboration participants
    if (sessionId) {
      socket.to(`collaboration:${sessionId}`).emit('execution-completed', {
        result,
        success,
        executionTime,
        by: socket.userInfo,
        timestamp: new Date()
      });
    }
  }

  // Chat handlers
  handleSendMessage(socket, data) {
    const { sessionId, message, type = 'text' } = data;

    const messageData = {
      id: Date.now(),
      message,
      type,
      author: socket.userInfo,
      timestamp: new Date()
    };

    if (sessionId) {
      // Send to collaboration session
      this.io.to(`collaboration:${sessionId}`).emit('message-received', messageData);
    } else {
      // Broadcast to all connected users
      this.io.emit('global-message', messageData);
    }

    // TODO: Store message in database
  }

  handleTypingStart(socket, data) {
    const { sessionId } = data;

    if (sessionId) {
      socket.to(`collaboration:${sessionId}`).emit('user-typing', {
        user: socket.userInfo,
        typing: true
      });
    }
  }

  handleTypingStop(socket, data) {
    const { sessionId } = data;

    if (sessionId) {
      socket.to(`collaboration:${sessionId}`).emit('user-typing', {
        user: socket.userInfo,
        typing: false
      });
    }
  }

  // Presence handlers
  handleUserActivity(socket, data) {
    const { activity, metadata } = data;

    // Update user's last activity
    if (this.connectedUsers.has(socket.userId)) {
      const user = this.connectedUsers.get(socket.userId);
      user.lastActivity = new Date();
      user.currentActivity = activity;
    }

    // Broadcast activity to interested parties (friends, collaborators, etc.)
    socket.broadcast.emit('user-activity-update', {
      user: socket.userInfo,
      activity,
      metadata,
      timestamp: new Date()
    });
  }

  // Sharing handlers
  handleShareCode(socket, data) {
    const {
      code, language, title, description, visibility = 'public'
    } = data;

    const sharedCode = {
      id: Date.now(),
      code,
      language,
      title,
      description,
      author: socket.userInfo,
      visibility,
      createdAt: new Date()
    };

    // Broadcast to relevant users based on visibility
    if (visibility === 'public') {
      socket.broadcast.emit('code-shared', sharedCode);
    }

    // TODO: Store in database
  }

  handleRequestHelp(socket, data) {
    const {
      code, language, problem, urgency = 'normal'
    } = data;

    const helpRequest = {
      id: Date.now(),
      code,
      language,
      problem,
      urgency,
      requester: socket.userInfo,
      createdAt: new Date()
    };

    // Broadcast to available mentors/helpers
    socket.broadcast.emit('help-requested', helpRequest);

    // TODO: Store in database and match with available mentors
  }

  // Learning event handlers
  handleAchievementEarned(socket, data) {
    const { achievementId, achievementName, points } = data;

    // Broadcast achievement to friends or public feed
    socket.broadcast.emit('achievement-earned', {
      user: socket.userInfo,
      achievement: {
        id: achievementId,
        name: achievementName,
        points
      },
      timestamp: new Date()
    });
  }

  handleChallengeCompleted(socket, data) {
    const {
      challengeId, challengeName, difficulty, timeToComplete, score
    } = data;

    // Broadcast challenge completion
    socket.broadcast.emit('challenge-completed', {
      user: socket.userInfo,
      challenge: {
        id: challengeId,
        name: challengeName,
        difficulty,
        timeToComplete,
        score
      },
      timestamp: new Date()
    });
  }

  // Disconnect handler
  handleDisconnect(socket) {
    logger.info(`User disconnected: ${socket.userInfo?.username} (${socket.id})`);

    // Remove from connected users
    this.connectedUsers.delete(socket.userId);

    // Broadcast user going offline
    this.broadcastUserStatus(socket.userId, 'offline');

    // Clean up collaboration sessions
    Array.from(this.collaborationSessions.entries()).forEach(([sessionId, session]) => {
      if (session.participants.has(socket.userId)) {
        session.participants.delete(socket.userId);
        session.cursors.delete(socket.userId);
        session.selections.delete(socket.userId);

        // Notify other participants
        socket.to(`collaboration:${sessionId}`).emit('user-left', {
          user: socket.userInfo,
          participantCount: session.participants.size
        });

        // Clean up empty sessions
        if (session.participants.size === 0) {
          this.collaborationSessions.delete(sessionId);
        }
      }
    });
  }

  // Utility methods
  broadcastUserStatus(userId, status) {
    this.io.emit('user-status-change', {
      userId,
      status,
      timestamp: new Date()
    });
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.values()).map((user) => ({
      ...user.userInfo,
      connectedAt: user.connectedAt,
      lastActivity: user.lastActivity,
      currentActivity: user.currentActivity
    }));
  }

  getActiveCollaborations() {
    return Array.from(this.collaborationSessions.entries()).map(([id, session]) => ({
      id,
      participantCount: session.participants.size,
      language: session.language,
      createdAt: session.createdAt,
      lastModified: session.lastModified
    }));
  }

  // Admin methods
  broadcastAnnouncement(message, type = 'info') {
    this.io.emit('system-announcement', {
      message,
      type,
      timestamp: new Date()
    });
  }

  kickUser(userId, reason) {
    if (this.connectedUsers.has(userId)) {
      const user = this.connectedUsers.get(userId);
      this.io.to(user.socketId).emit('force-disconnect', { reason });
      this.io.sockets.sockets.get(user.socketId)?.disconnect(true);
    }
  }
}

module.exports = SocketService;
