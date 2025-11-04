const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sqlite');

const BugReport = sequelize.define('BugReport', {
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
  severity: {
    type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
    allowNull: false,
    defaultValue: 'medium'
  },
  bugType: {
    type: DataTypes.ENUM('functionality', 'ui', 'performance', 'security', 'compatibility', 'other'),
    allowNull: false,
    defaultValue: 'functionality'
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Page where bug occurred'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  stepsToReproduce: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expectedBehavior: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  actualBehavior: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: true
  },
  browserVersion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true
  },
  screenResolution: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('new', 'confirmed', 'in_progress', 'fixed', 'wont_fix', 'duplicate', 'cannot_reproduce'),
    defaultValue: 'new'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fixedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  fixedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fixVersion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  screenshots: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  consoleErrors: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'bug_reports',
  timestamps: true
  // Indexes removed to avoid conflicts with existing table
});

module.exports = BugReport;
