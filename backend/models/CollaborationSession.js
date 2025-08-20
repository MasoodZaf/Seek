const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sqlite');

const CollaborationSession = sequelize.define('CollaborationSession', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  language: {
    type: DataTypes.ENUM('javascript', 'python', 'java', 'typescript'),
    defaultValue: 'javascript'
  },
  code: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lastActivity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'collaboration_sessions'
});

module.exports = CollaborationSession;
