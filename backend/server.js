const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const { connectSQLite } = require('./config/sqlite');
const { connectMongoDB } = require('./config/mongodb');
const logger = require('./config/logger');
const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');
const routes = require('./routes');
const SocketService = require('./services/socketService');
const { createDefaultUsers } = require('./scripts/createDefaultUsers');
const { createTutorials } = require('./scripts/populateTutorials');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const {
  generalRateLimit,
  corsOptions,
  securityHeaders,
  requestLogging,
  validateContentType,
  sanitizeInput
} = require('./middleware/security');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const PORT = process.env.PORT || 5001;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  }
}));

app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(compression());
app.use(generalRateLimit);

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}
app.use(requestLogging);

// Body parsing middleware
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Input validation and sanitization
app.use(validateContentType);
app.use(sanitizeInput);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Health check endpoint (before rate limiting)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/v1', routes);

// Direct test endpoint
app.get('/test-tutorials', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const MongoTutorial = require('./models/MongoTutorial');

    // Debug connection info
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    const dbPort = mongoose.connection.port;

    const tutorials = await MongoTutorial.find({ isPublished: true }).limit(20);
    res.json({
      success: true,
      count: tutorials.length,
      dbInfo: { name: dbName, host: dbHost, port: dbPort },
      tutorials: tutorials.map((t) => ({ title: t.title, language: t.language, slug: t.slug }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Seek Learning Platform API 🎯',
    version: '1.0.0',
    status: 'running',
    documentation: '/api-docs',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      test: '/test-tutorials'
    }
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      const { sequelize } = require('./config/sqlite');
      await sequelize.close();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error during database disconnection:', error);
    }

    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

// Start server
const startServer = async () => {
  try {
    // Connect to SQLite database
    await connectSQLite();

    // Connect to MongoDB for tutorials
    await connectMongoDB();

    // Create default users if they don't exist
    await createDefaultUsers().catch((err) => {
      logger.warn('Failed to create default users:', err.message);
    });

    // Seed MongoDB tutorials if needed
    try {
      const { seedTutorials } = require('./seeds/tutorialSeeds');
      await seedTutorials();
    } catch (err) {
      logger.warn('Failed to seed MongoDB tutorials:', err.message);
    }

    // Initialize Socket.IO service
    const socketService = new SocketService(io);

    // Make socket service available to routes
    app.locals.socketService = socketService;

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info('🔌 WebSocket server initialized');
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const server = startServer();
}

module.exports = app;
