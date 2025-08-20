const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sqlite');

const Tutorial = sequelize.define('Tutorial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      len: [1, 1000]
    }
  },
  language: {
    type: DataTypes.ENUM('javascript', 'python', 'java', 'typescript'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('fundamentals', 'web-development', 'data-structures', 'algorithms', 'frameworks'),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  prerequisites: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  lessons: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stats: {
    type: DataTypes.JSON,
    defaultValue: {
      enrollments: 0,
      completions: 0,
      averageRating: 0,
      totalRatings: 0
    }
  }
}, {
  tableName: 'tutorials',
  hooks: {
    beforeSave: async (tutorial) => {
      if (tutorial.changed('lessons')) {
        const lessons = tutorial.lessons || [];
        tutorial.estimatedDuration = lessons.reduce((total, lesson) => total + (lesson.estimatedTime || 15), 0);
      }

      if (tutorial.changed('isPublished') && tutorial.isPublished && !tutorial.publishedAt) {
        tutorial.publishedAt = new Date();
      }
    }
  }
});

// Virtual fields
Tutorial.prototype.getLessonsCount = function () {
  return (this.lessons || []).length;
};

Tutorial.prototype.getCompletionRate = function () {
  if (this.stats.enrollments === 0) return 0;
  return Math.round((this.stats.completions / this.stats.enrollments) * 100);
};

// Instance methods
Tutorial.prototype.updateRating = async function (newRating) {
  const stats = this.stats || {
    enrollments: 0, completions: 0, averageRating: 0, totalRatings: 0
  };
  const totalRatings = stats.totalRatings + 1;
  const currentTotal = stats.averageRating * stats.totalRatings;
  const newAverage = (currentTotal + newRating) / totalRatings;

  this.stats = {
    ...stats,
    averageRating: Math.round(newAverage * 10) / 10,
    totalRatings
  };

  await this.save();
};

Tutorial.prototype.incrementEnrollment = async function () {
  const stats = this.stats || {
    enrollments: 0, completions: 0, averageRating: 0, totalRatings: 0
  };
  this.stats = {
    ...stats,
    enrollments: stats.enrollments + 1
  };
  await this.save();
};

Tutorial.prototype.incrementCompletion = async function () {
  const stats = this.stats || {
    enrollments: 0, completions: 0, averageRating: 0, totalRatings: 0
  };
  this.stats = {
    ...stats,
    completions: stats.completions + 1
  };
  await this.save();
};

Tutorial.prototype.toJSON = function () {
  const values = { ...this.get() };
  values.lessonsCount = this.getLessonsCount();
  values.completionRate = this.getCompletionRate();
  return values;
};

module.exports = Tutorial;
