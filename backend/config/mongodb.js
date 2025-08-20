const mongoose = require('mongoose');
const logger = require('./logger');

const connectMongoDB = async () => {
  try {
    // MongoDB connection string - using local MongoDB by default
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seek_platform';

    // Connection options for better performance and stability
    const options = {
      maxPoolSize: 10, // Maximum number of connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
    };

    // Connect to MongoDB
    const connection = await mongoose.connect(mongoURI, options);

    logger.info(`🍃 MongoDB connected: ${connection.connection.host}:${connection.connection.port}`);
    logger.info(`📚 Database: ${connection.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('👋 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return connection;
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);

    // For development, we'll continue without MongoDB and log the error
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      logger.warn('⚠️ Continuing without MongoDB in development mode');
      logger.warn('💡 To use tutorials, please install and start MongoDB:');
      logger.warn('   brew install mongodb/brew/mongodb-community');
      logger.warn('   brew services start mongodb/brew/mongodb-community');
    }
  }
};

// Health check function
const checkMongoDBHealth = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy', connected: true };
    }
    return { status: 'disconnected', connected: false };
  } catch (error) {
    return { status: 'error', connected: false, error: error.message };
  }
};

module.exports = {
  connectMongoDB,
  checkMongoDBHealth
};
