const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { authenticate, authorize } = require('../middleware/auth');
const sequelize = require('../config/sequelize');

// @route   POST /api/v1/feedback
// @desc    Submit feedback
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      type,
      category,
      subject,
      message,
      rating,
      page
    } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message'
      });
    }

    // Get user info from token if authenticated
    const userId = req.user ? req.user.id : null;

    // Get client info
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const feedback = await Feedback.create({
      userId,
      name,
      email,
      type: type || 'general',
      category,
      subject,
      message,
      rating,
      page,
      userAgent,
      ipAddress
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We appreciate your input.',
      data: {
        id: feedback.id,
        type: feedback.type,
        subject: feedback.subject,
        status: feedback.status
      }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

// @route   GET /api/v1/feedback
// @desc    Get all feedback (Admin only)
// @access  Private/Admin
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      priority,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    const offset = (page - 1) * parseInt(limit);

    const { count, rows: feedback } = await Feedback.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      attributes: { exclude: ['ipAddress'] }
    });

    res.json({
      success: true,
      data: feedback,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// @route   GET /api/v1/feedback/stats
// @desc    Get feedback statistics (Admin only)
// @access  Private/Admin
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const total = await Feedback.count();

    const byStatus = await Feedback.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const byType = await Feedback.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type']
    });

    const byPriority = await Feedback.findAll({
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['priority']
    });

    const avgRating = await Feedback.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'average']],
      where: {
        rating: { [sequelize.Op.ne]: null }
      }
    });

    res.json({
      success: true,
      data: {
        total,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.get('count'));
          return acc;
        }, {}),
        byType: byType.reduce((acc, item) => {
          acc[item.type] = parseInt(item.get('count'));
          return acc;
        }, {}),
        byPriority: byPriority.reduce((acc, item) => {
          acc[item.priority] = parseInt(item.get('count'));
          return acc;
        }, {}),
        averageRating: avgRating ? parseFloat(avgRating.get('average')).toFixed(2) : null
      }
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error.message
    });
  }
});

// @route   GET /api/v1/feedback/:id
// @desc    Get single feedback (Admin only)
// @access  Private/Admin
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/feedback/:id
// @desc    Update feedback (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    const { status, priority, adminNotes } = req.body;

    if (status) feedback.status = status;
    if (priority) feedback.priority = priority;
    if (adminNotes !== undefined) feedback.adminNotes = adminNotes;

    if (status === 'completed') {
      feedback.resolvedBy = req.user.id;
      feedback.resolvedAt = new Date();
    }

    await feedback.save();

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
});

// @route   DELETE /api/v1/feedback/:id
// @desc    Delete feedback (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    await feedback.destroy();

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
});

module.exports = router;
