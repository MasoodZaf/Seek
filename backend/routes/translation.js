const express = require('express');

const router = express.Router();

const codeTranslationController = require('../controllers/codeTranslationController');
const { protect } = require('../middleware/auth');
const { codeExecutionRateLimit } = require('../middleware/security');

// Translation endpoints
router.post('/translate', protect, codeExecutionRateLimit, codeTranslationController.translateCode);

router.get('/languages', codeTranslationController.getSupportedLanguages);

router.get('/history', protect, codeTranslationController.getTranslationHistory);

module.exports = router;
