const express = require('express');

const router = express.Router();

const codeExecutionController = require('../controllers/codeExecutionController');
const { protect } = require('../middleware/auth');
const { codeExecutionRateLimit } = require('../middleware/security');
const {
  validateCodeExecution,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

router.post('/execute', protect, codeExecutionRateLimit, validateCodeExecution, codeExecutionController.executeCode);

router.post('/validate', protect, validateCodeExecution, codeExecutionController.validateCode);

router.get('/history', protect, validatePagination, codeExecutionController.getExecutionHistory);

router.get('/stats', protect, codeExecutionController.getExecutionStats);

router.get('/:id', validateObjectId('id'), protect, codeExecutionController.getExecutionDetails);

module.exports = router;
