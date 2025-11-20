const express = require('express');
const router = express.Router();
const databaseTranslationService = require('../services/databaseTranslationService');
const { body, validationResult } = require('express-validator');

/**
 * @route   POST /api/v1/database-translation/translate
 * @desc    Translate database query from one syntax to another
 * @access  Public
 */
router.post('/translate',
  [
    body('sourceQuery').notEmpty().withMessage('Source query is required'),
    body('sourceDB').notEmpty().withMessage('Source database is required'),
    body('targetDB').notEmpty().withMessage('Target database is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { sourceQuery, sourceDB, targetDB, options = {} } = req.body;

      // Perform translation
      const result = await databaseTranslationService.translateQuery(
        sourceQuery,
        sourceDB,
        targetDB,
        options
      );

      res.json({
        success: true,
        data: {
          sourceQuery,
          sourceDB,
          targetDB,
          ...result
        }
      });

    } catch (error) {
      console.error('Database translation error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Translation failed'
      });
    }
  }
);

/**
 * @route   GET /api/v1/database-translation/supported
 * @desc    Get list of supported databases
 * @access  Public
 */
router.get('/supported', (req, res) => {
  res.json({
    success: true,
    data: {
      databases: databaseTranslationService.supportedDatabases,
      count: databaseTranslationService.supportedDatabases.length
    }
  });
});

/**
 * @route   GET /api/v1/database-translation/patterns/:database
 * @desc    Get common query patterns for a specific database
 * @access  Public
 */
router.get('/patterns/:database', (req, res) => {
  try {
    const { database } = req.params;
    const patterns = databaseTranslationService.getCommonPatterns(database);

    if (!patterns || patterns.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No patterns found for database: ${database}`
      });
    }

    res.json({
      success: true,
      data: {
        database,
        patterns
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/database-translation/info/:database
 * @desc    Get information about a specific database
 * @access  Public
 */
router.get('/info/:database', (req, res) => {
  try {
    const { database } = req.params;
    const info = databaseTranslationService.getDatabaseInfo(database);

    if (!info) {
      return res.status(404).json({
        success: false,
        message: `No information found for database: ${database}`
      });
    }

    res.json({
      success: true,
      data: {
        database,
        ...info
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/v1/database-translation/batch-translate
 * @desc    Translate multiple queries at once
 * @access  Public
 */
router.post('/batch-translate',
  [
    body('queries').isArray().withMessage('Queries must be an array'),
    body('sourceDB').notEmpty().withMessage('Source database is required'),
    body('targetDB').notEmpty().withMessage('Target database is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { queries, sourceDB, targetDB, options = {} } = req.body;

      // Limit batch size
      if (queries.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 queries per batch'
        });
      }

      // Translate all queries
      const results = await Promise.all(
        queries.map(query =>
          databaseTranslationService.translateQuery(query, sourceDB, targetDB, options)
        )
      );

      res.json({
        success: true,
        data: {
          sourceDB,
          targetDB,
          translations: results.map((result, index) => ({
            sourceQuery: queries[index],
            ...result
          }))
        }
      });

    } catch (error) {
      console.error('Batch translation error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Batch translation failed'
      });
    }
  }
);

module.exports = router;
