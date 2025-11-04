const express = require('express');

const router = express.Router();

const authRoutes = require('./auth');
const tutorialRoutes = require('./tutorials');
const mongoTutorialRoutes = require('./mongoTutorials');
const databaseTutorialRoutes = require('./databaseTutorials');
const codeRoutes = require('./code');
const progressRoutes = require('./progress');
const translationRoutes = require('./translation');
const gamesRoutes = require('./games');
const gameSessionRoutes = require('./gameSessions');
const challengesRoutes = require('./challenges');
const feedbackRoutes = require('./feedback');
const bugReportsRoutes = require('./bugReports');
// Temporarily comment out AI Tutor routes to start server
// const aiTutorRoutes = require('./aiTutor');

router.use('/auth', authRoutes);
router.use('/tutorials', tutorialRoutes);
router.use('/mongo-tutorials', mongoTutorialRoutes);
router.use('/database-tutorials', databaseTutorialRoutes);
router.use('/code', codeRoutes);
router.use('/progress', progressRoutes);
router.use('/translation', translationRoutes);
router.use('/games', gamesRoutes);
router.use('/game-sessions', gameSessionRoutes);
router.use('/challenges', challengesRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/bug-reports', bugReportsRoutes);
// Temporarily disabled
// router.use('/ai-tutor', aiTutorRoutes);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Seek Learning Platform API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    features: [
      'User Authentication & Authorization',
      'Tutorial Management',
      'Interactive Learning Games',
      'Game Session Management',
      'Code Execution',
      'Code Translation',
      'AI-Powered Tutoring',
      'Intelligent Code Review',
      'Personalized Learning',
      'Progress Tracking',
      'Real-time Learning Analytics'
    ],
    endpoints: {
      auth: '/api/v1/auth',
      tutorials: '/api/v1/tutorials',
      databaseTutorials: '/api/v1/database-tutorials',
      games: '/api/v1/games',
      gameSessions: '/api/v1/game-sessions',
      challenges: '/api/v1/challenges',
      codeExecution: '/api/v1/code',
      codeTranslation: '/api/v1/translation',
      aiTutor: '/api/v1/ai-tutor',
      progress: '/api/v1/progress',
      feedback: '/api/v1/feedback',
      bugReports: '/api/v1/bug-reports'
    }
  });
});

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
