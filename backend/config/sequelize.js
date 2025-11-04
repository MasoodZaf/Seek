const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ SQLite database connection established successfully');
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error);
  }
};

// Sync database (create tables if they don't exist)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized successfully');
  } catch (error) {
    console.error('✗ Error synchronizing database:', error);
  }
};

module.exports = { sequelize, testConnection, syncDatabase };
