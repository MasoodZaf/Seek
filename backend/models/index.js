const { sequelize } = require('../config/sqlite');
const User = require('./User');
const Tutorial = require('./Tutorial');
const UserProgress = require('./UserProgress');
const CodeExecution = require('./CodeExecution');
const CodeShare = require('./CodeShare');
const CollaborationSession = require('./CollaborationSession');

// Define associations
User.hasMany(Tutorial, { foreignKey: 'authorId', as: 'tutorials' });
Tutorial.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(CodeShare, { foreignKey: 'authorId', as: 'codeShares' });
CodeShare.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(CollaborationSession, { foreignKey: 'createdById', as: 'collaborationSessions' });
CollaborationSession.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });

User.hasMany(UserProgress, { foreignKey: 'userId', as: 'userProgress' });
UserProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Tutorial.hasMany(UserProgress, { foreignKey: 'tutorialId', as: 'progress' });
UserProgress.belongsTo(Tutorial, { foreignKey: 'tutorialId', as: 'tutorial' });

User.hasMany(CodeExecution, { foreignKey: 'userId', as: 'executions' });
CodeExecution.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Tutorial.hasMany(CodeExecution, { foreignKey: 'tutorialId', as: 'executions' });
CodeExecution.belongsTo(Tutorial, { foreignKey: 'tutorialId', as: 'tutorial' });

module.exports = {
  sequelize,
  User,
  Tutorial,
  UserProgress,
  CodeExecution,
  CodeShare,
  CollaborationSession
};
