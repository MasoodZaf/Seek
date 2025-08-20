const codeTranslationService = require('../services/codeTranslationService');
const logger = require('../config/logger');

const translateCode = async (req, res) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body;
    const userId = req.user?.id;

    if (!code || !fromLanguage || !toLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: code, fromLanguage, toLanguage'
      });
    }

    if (code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Code cannot be empty'
      });
    }

    // Educational system limit: 1000 lines maximum
    const lineCount = code.split('\n').length;
    if (lineCount > 1000) {
      return res.status(400).json({
        success: false,
        message: `Code exceeds educational limit of 1000 lines. Current: ${lineCount} lines. `
          + 'Please use smaller code snippets for learning purposes.',
        error: 'CODE_TOO_LONG',
        data: {
          currentLines: lineCount,
          maxLines: 1000
        }
      });
    }

    const result = await codeTranslationService.translateCode(
      code,
      fromLanguage.toLowerCase(),
      toLanguage.toLowerCase(),
      userId
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Code translated successfully',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Translation failed',
        error: result.error,
        data: {
          originalCode: result.originalCode,
          fromLanguage: result.fromLanguage,
          toLanguage: result.toLanguage
        }
      });
    }
  } catch (error) {
    logger.error('Translation controller error:', { error: error.message, userId: req.user?.id });
    res.status(500).json({
      success: false,
      message: 'Internal server error during translation',
      error: error.message
    });
  }
};

const getSupportedLanguages = async (req, res) => {
  try {
    const languages = codeTranslationService.getSupportedLanguages();

    const languageDetails = {
      javascript: { name: 'JavaScript', extension: 'js', icon: '🟨' },
      python: { name: 'Python', extension: 'py', icon: '🐍' },
      java: { name: 'Java', extension: 'java', icon: '☕' },
      cpp: { name: 'C++', extension: 'cpp', icon: '🔧' },
      c: { name: 'C', extension: 'c', icon: '🔩' },
      typescript: { name: 'TypeScript', extension: 'ts', icon: '🔷' }
    };

    const supportedLanguages = languages.map((lang) => ({
      id: lang,
      ...languageDetails[lang]
    }));

    res.status(200).json({
      success: true,
      message: 'Supported languages retrieved successfully',
      data: {
        languages: supportedLanguages,
        count: supportedLanguages.length
      }
    });
  } catch (error) {
    logger.error('Get supported languages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve supported languages',
      error: error.message
    });
  }
};

const getTranslationHistory = async (req, res) => {
  try {
    // TODO: Implement translation history from database
    // For now, return empty history
    res.status(200).json({
      success: true,
      message: 'Translation history retrieved successfully',
      data: {
        history: [],
        count: 0,
        message: 'Translation history feature coming soon'
      }
    });
  } catch (error) {
    logger.error('Get translation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve translation history',
      error: error.message
    });
  }
};

module.exports = {
  translateCode,
  getSupportedLanguages,
  getTranslationHistory
};
