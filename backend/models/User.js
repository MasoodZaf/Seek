const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/sqlite');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 255]
    }
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  role: {
    type: DataTypes.ENUM('student', 'instructor', 'admin'),
    defaultValue: 'student'
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      language: 'javascript',
      theme: 'dark',
      notifications: {
        email: true,
        push: true
      }
    }
  },
  progress: {
    type: DataTypes.JSON,
    defaultValue: {
      totalExercises: 0,
      completedExercises: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      level: 1
    }
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refreshTokens: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  aiRequestsThisMonth: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  aiRequestsLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    allowNull: false,
    comment: 'Maximum AI requests allowed per month'
  },
  aiRequestsResetDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date when AI request counter was last reset'
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Virtual fields
User.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.getCompletionRate = function () {
  if (this.progress.totalExercises === 0) return 0;
  return Math.round((this.progress.completedExercises / this.progress.totalExercises) * 100);
};

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

User.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

User.prototype.generateRefreshToken = function () {
  return jwt.sign(
    { id: this.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

User.prototype.addRefreshToken = async function (refreshToken) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const tokens = this.refreshTokens || [];
  tokens.push({
    token: refreshToken,
    createdAt: new Date(),
    expiresAt
  });

  // Clean expired tokens
  const validTokens = tokens.filter((token) => new Date(token.expiresAt) > new Date());

  // Keep only last 5 tokens
  this.refreshTokens = validTokens.slice(-5);

  await this.save();
};

User.prototype.removeRefreshToken = async function (refreshToken) {
  const tokens = this.refreshTokens || [];
  this.refreshTokens = tokens.filter((token) => token.token !== refreshToken);
  await this.save();
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.refreshTokens;

  // Add virtual fields
  values.fullName = this.getFullName();
  values.completionRate = this.getCompletionRate();

  return values;
};

module.exports = User;
