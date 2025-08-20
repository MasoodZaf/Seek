const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('./logger');

// SQLite database setup - much simpler than MongoDB!
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: (msg) => logger.debug(msg),
  define: {
    timestamps: true, // Adds createdAt and updatedAt
    underscored: true // Uses snake_case for column names
  }
});

// Test connection
const connectSQLite = async () => {
  try {
    await sequelize.authenticate();
    logger.info('📁 SQLite database connected successfully');

    // Sync models (create tables if they don't exist)
    await sequelize.sync({
      force: false,
      alter: false
    });
    logger.info('📊 Database tables synchronized');

    return sequelize;
  } catch (error) {
    logger.error('❌ SQLite connection failed:', error);
    throw error;
  }
};

module.exports = { sequelize, connectSQLite };
