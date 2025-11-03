const express = require('express');
const router = express.Router();
const BugReport = require('../models/BugReport');
const { authenticate, authorize } = require('../middleware/auth');
const sequelize = require('../config/sequelize');

// @route   POST /api/v1/bug-reports
// @desc    Submit bug report
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      severity,
      bugType,
      page,
      title,
      description,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      browser,
      browserVersion,
      os,
      device,
      screenResolution,
      consoleErrors
    } = req.body;

    // Validation
    if (!name || !email || !page || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, page, title, and description'
      });
    }

    // Get user info from token if authenticated
    const userId = req.user ? req.user.id : null;

    // Get client info
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const bugReport = await BugReport.create({
      userId,
      name,
      email,
      severity: severity || 'medium',
      bugType: bugType || 'functionality',
      page,
      title,
      description,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      browser,
      browserVersion,
      os,
      device,
      screenResolution,
      consoleErrors,
      userAgent,
      ipAddress
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reporting this bug! We will investigate it promptly.',
      data: {
        id: bugReport.id,
        title: bugReport.title,
        severity: bugReport.severity,
        status: bugReport.status
      }
    });
  } catch (error) {
    console.error('Submit bug report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit bug report',
      error: error.message
    });
  }
});

// @route   GET /api/v1/bug-reports
// @desc    Get all bug reports (Admin only)
// @access  Private/Admin
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      severity,
      bugType,
      priority,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (bugType) where.bugType = bugType;
    if (priority) where.priority = priority;

    const offset = (page - 1) * parseInt(limit);

    const { count, rows: bugReports } = await BugReport.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      attributes: { exclude: ['ipAddress', 'consoleErrors'] }
    });

    res.json({
      success: true,
      data: bugReports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get bug reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bug reports',
      error: error.message
    });
  }
});

// @route   GET /api/v1/bug-reports/stats
// @desc    Get bug report statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const total = await BugReport.count();

    const byStatus = await BugReport.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const bySeverity = await BugReport.findAll({
      attributes: [
        'severity',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['severity']
    });

    const byType = await BugReport.findAll({
      attributes: [
        'bugType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['bugType']
    });

    const byPriority = await BugReport.findAll({
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['priority']
    });

    res.json({
      success: true,
      data: {
        total,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.get('count'));
          return acc;
        }, {}),
        bySeverity: bySeverity.reduce((acc, item) => {
          acc[item.severity] = parseInt(item.get('count'));
          return acc;
        }, {}),
        byType: byType.reduce((acc, item) => {
          acc[item.bugType] = parseInt(item.get('count'));
          return acc;
        }, {}),
        byPriority: byPriority.reduce((acc, item) => {
          acc[item.priority] = parseInt(item.get('count'));
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get bug report stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bug report statistics',
      error: error.message
    });
  }
});

// @route   GET /api/v1/bug-reports/:id
// @desc    Get single bug report (Admin only)
// @access  Private/Admin
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const bugReport = await BugReport.findByPk(req.params.id);

    if (!bugReport) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }

    res.json({
      success: true,
      data: bugReport
    });
  } catch (error) {
    console.error('Get bug report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bug report',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/bug-reports/:id
// @desc    Update bug report (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const bugReport = await BugReport.findByPk(req.params.id);

    if (!bugReport) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }

    const {
      status,
      priority,
      severity,
      adminNotes,
      assignedTo,
      fixVersion
    } = req.body;

    if (status) bugReport.status = status;
    if (priority) bugReport.priority = priority;
    if (severity) bugReport.severity = severity;
    if (adminNotes !== undefined) bugReport.adminNotes = adminNotes;
    if (assignedTo !== undefined) bugReport.assignedTo = assignedTo;
    if (fixVersion) bugReport.fixVersion = fixVersion;

    if (status === 'fixed') {
      bugReport.fixedBy = req.user.id;
      bugReport.fixedAt = new Date();
    }

    await bugReport.save();

    res.json({
      success: true,
      message: 'Bug report updated successfully',
      data: bugReport
    });
  } catch (error) {
    console.error('Update bug report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bug report',
      error: error.message
    });
  }
});

// @route   DELETE /api/v1/bug-reports/:id
// @desc    Delete bug report (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const bugReport = await BugReport.findByPk(req.params.id);

    if (!bugReport) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }

    await bugReport.destroy();

    res.json({
      success: true,
      message: 'Bug report deleted successfully'
    });
  } catch (error) {
    console.error('Delete bug report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bug report',
      error: error.message
    });
  }
});

module.exports = router;
