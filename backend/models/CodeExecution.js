const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sqlite');

const CodeExecution = sequelize.define('CodeExecution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tutorialId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lessonId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  language: {
    type: DataTypes.ENUM('javascript', 'python', 'java', 'typescript'),
    allowNull: false
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 10000]
    }
  },
  input: {
    type: DataTypes.STRING(1000),
    defaultValue: ''
  },
  output: {
    type: DataTypes.JSON,
    defaultValue: {
      stdout: '',
      stderr: '',
      exitCode: null,
      executionTime: 0,
      memoryUsage: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'running', 'completed', 'error', 'timeout', 'memory_limit'),
    defaultValue: 'pending'
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  executionStartTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  executionEndTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {
      codeLength: 0,
      linesOfCode: 0,
      complexity: 'low'
    }
  }
}, {
  tableName: 'code_executions',
  hooks: {
    beforeSave: async (execution) => {
      if (execution.changed('code')) {
        const metadata = execution.metadata || { codeLength: 0, linesOfCode: 0, complexity: 'low' };
        metadata.codeLength = execution.code.length;
        metadata.linesOfCode = execution.code.split('\n').length;

        const complexityScore = execution.calculateComplexity();
        if (complexityScore > 20) {
          metadata.complexity = 'high';
        } else if (complexityScore > 10) {
          metadata.complexity = 'medium';
        } else {
          metadata.complexity = 'low';
        }

        execution.metadata = metadata;
      }
    }
  }
});

// Virtual fields
CodeExecution.prototype.getTotalExecutionTime = function () {
  if (!this.executionStartTime || !this.executionEndTime) return 0;
  return new Date(this.executionEndTime).getTime() - new Date(this.executionStartTime).getTime();
};

CodeExecution.prototype.getIsSuccessful = function () {
  return this.status === 'completed' && this.output?.exitCode === 0;
};

// Instance methods
CodeExecution.prototype.calculateComplexity = function () {
  const code = this.code.toLowerCase();
  let score = 0;

  const patterns = {
    loops: /(for|while|do)\s*\(/g,
    conditionals: /(if|else|switch|case)\s*\(/g,
    functions: /(function|def|class)/g,
    recursion: /(\w+)\s*\([^)]*\)\s*{[^}]*\1\s*\(/g,
    nestedStructures: /{[^{}]*{[^{}]*}/g
  };

  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = code.match(pattern) || [];
    switch (type) {
      case 'loops':
        score += matches.length * 3;
        break;
      case 'conditionals':
        score += matches.length * 2;
        break;
      case 'functions':
        score += matches.length * 2;
        break;
      case 'recursion':
        score += matches.length * 5;
        break;
      case 'nestedStructures':
        score += matches.length * 4;
        break;
      default:
        // No additional score for unknown pattern types
        break;
    }
  });

  return score;
};

CodeExecution.prototype.markAsRunning = async function () {
  this.status = 'running';
  this.executionStartTime = new Date();
  await this.save();
};

CodeExecution.prototype.markAsCompleted = async function (output, executionTime = 0, memoryUsage = 0) {
  this.status = 'completed';
  this.output = {
    ...this.output,
    ...output,
    executionTime,
    memoryUsage
  };
  this.executionEndTime = new Date();
  await this.save();
};

CodeExecution.prototype.markAsError = async function (error) {
  this.status = 'error';
  this.error = error;
  this.executionEndTime = new Date();
  await this.save();
};

// Static methods
CodeExecution.getUserExecutionStats = async function (userId, timeframe = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeframe);

  const executions = await this.findAll({
    where: {
      userId,
      createdAt: {
        [sequelize.Sequelize.Op.gte]: startDate
      }
    }
  });

  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter((e) => e.status === 'completed').length;
  const executionTimes = executions
    .filter((e) => e.output?.executionTime)
    .map((e) => e.output.executionTime);
  const averageExecutionTime = executionTimes.length > 0
    ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length
    : 0;
  const languageDistribution = executions.map((e) => e.language);

  return {
    totalExecutions,
    successfulExecutions,
    averageExecutionTime,
    languageDistribution
  };
};

CodeExecution.prototype.toJSON = function () {
  const values = { ...this.get() };
  values.totalExecutionTime = this.getTotalExecutionTime();
  values.isSuccessful = this.getIsSuccessful();
  return values;
};

module.exports = CodeExecution;
