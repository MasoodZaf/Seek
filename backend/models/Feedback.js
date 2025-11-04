const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sqlite');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  type: {
    type: DataTypes.ENUM('feature_request', 'improvement', 'general', 'praise', 'other'),
    allowNull: false,
    defaultValue: 'general'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  page: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Page where feedback was submitted'
  },
  status: {
    type: DataTypes.ENUM('new', 'reviewed', 'in_progress', 'completed', 'rejected'),
    defaultValue: 'new'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'feedbacks',
  timestamps: true
  // Indexes removed to avoid conflicts with existing table
});

module.exports = Feedback;
