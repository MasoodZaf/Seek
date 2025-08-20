const codeExecutionService = require('../services/codeExecutionService');
const logger = require('../config/logger');

const executeCode = async (req, res) => {
  try {
    const {
      code, language, input, tutorialId, lessonId
    } = req.body;
    const userId = req.user.id;

    const validationErrors = codeExecutionService.validateCode(code, language);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Code validation failed',
        errors: validationErrors
      });
    }

    const clientInfo = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    const result = await codeExecutionService.executeCode(
      userId,
      code,
      language,
      input,
      null,
      tutorialId,
      lessonId,
      clientInfo
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Code executed successfully',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Code execution failed',
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Execute code controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during code execution'
    });
  }
};

const getExecutionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const result = await codeExecutionService.getUserExecutionHistory(
      userId,
      parseInt(limit, 10),
      parseInt(page, 10)
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Execution history retrieved successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    logger.error('Get execution history controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution history'
    });
  }
};

const getExecutionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await codeExecutionService.getExecutionDetails(id, userId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Execution details retrieved successfully',
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    logger.error('Get execution details controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution details'
    });
  }
};

const getExecutionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 30 } = req.query;

    const result = await codeExecutionService.getUserExecutionStats(
      userId,
      parseInt(timeframe, 10)
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Execution statistics retrieved successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    logger.error('Get execution stats controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution statistics'
    });
  }
};

const validateCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const errors = codeExecutionService.validateCode(code, language);

    res.status(200).json({
      success: true,
      data: {
        valid: errors.length === 0,
        errors
      }
    });
  } catch (error) {
    logger.error('Validate code controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Code validation failed'
    });
  }
};

module.exports = {
  executeCode,
  getExecutionHistory,
  getExecutionDetails,
  getExecutionStats,
  validateCode
};
