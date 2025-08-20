const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sqlite');

const UserProgress = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tutorialId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'paused'),
    defaultValue: 'not_started'
  },
  enrolledAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  currentLesson: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lessonsProgress: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  overallProgress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  totalTimeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  certificate: {
    type: DataTypes.JSON,
    defaultValue: {
      issued: false,
      issuedAt: null,
      certificateId: null
    }
  },
  rating: {
    type: DataTypes.JSON,
    defaultValue: {
      score: null,
      review: null,
      ratedAt: null
    }
  }
}, {
  tableName: 'user_progress',
  hooks: {
    beforeSave: async (progress) => {
      if (progress.changed('lessonsProgress')) {
        const lessons = progress.lessonsProgress || [];
        const completedLessons = lessons.filter((lesson) => lesson.status === 'completed');
        const totalLessons = lessons.length;

        progress.overallProgress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

        progress.totalTimeSpent = lessons.reduce((total, lesson) => total + (lesson.timeSpent || 0), 0);
        progress.totalAttempts = lessons.reduce((total, lesson) => total + (lesson.attempts || 0), 0);

        const scoresWithValues = lessons.filter((lesson) => lesson.bestScore > 0);
        if (scoresWithValues.length > 0) {
          progress.averageScore = Math.round(
            scoresWithValues.reduce((total, lesson) => total + lesson.bestScore, 0) / scoresWithValues.length
          );
        }

        if (progress.overallProgress === 100 && progress.status !== 'completed') {
          progress.status = 'completed';
          progress.completedAt = new Date();
        }
      }

      if (progress.changed('status')) {
        if (progress.status === 'in_progress' && !progress.startedAt) {
          progress.startedAt = new Date();
        }
      }

      progress.lastAccessedAt = new Date();
    }
  }
});

// Virtual fields
UserProgress.prototype.getCompletedLessons = function () {
  return (this.lessonsProgress || []).filter((lesson) => lesson.status === 'completed').length;
};

UserProgress.prototype.getTotalLessons = function () {
  return (this.lessonsProgress || []).length;
};

UserProgress.prototype.getIsCompleted = function () {
  return this.status === 'completed';
};

// Instance methods
UserProgress.prototype.updateLessonProgress = async function (lessonId, progressData) {
  const lessons = this.lessonsProgress || [];
  const lessonIndex = lessons.findIndex(
    (lesson) => lesson.lessonId === lessonId
  );

  if (lessonIndex === -1) {
    lessons.push({
      lessonId,
      ...progressData
    });
  } else {
    Object.assign(lessons[lessonIndex], progressData);
  }

  this.lessonsProgress = lessons;
  await this.save();
};

UserProgress.prototype.markLessonCompleted = async function (lessonId, submittedCode = '', score = 100) {
  const lessons = this.lessonsProgress || [];
  const existingLesson = lessons.find((l) => l.lessonId === lessonId);

  await this.updateLessonProgress(lessonId, {
    status: 'completed',
    completedAt: new Date(),
    lastAttemptAt: new Date(),
    submittedCode,
    bestScore: Math.max(score, existingLesson?.bestScore || 0),
    attempts: (existingLesson?.attempts || 0) + 1
  });
};

UserProgress.prototype.addRating = async function (score, review = null) {
  this.rating = {
    score,
    review,
    ratedAt: new Date()
  };
  await this.save();
};

UserProgress.prototype.toJSON = function () {
  const values = { ...this.get() };
  values.completedLessons = this.getCompletedLessons();
  values.totalLessons = this.getTotalLessons();
  values.isCompleted = this.getIsCompleted();
  return values;
};

module.exports = UserProgress;
