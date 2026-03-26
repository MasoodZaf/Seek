const express = require('express');
const router = express.Router();
const CodeSnippet = require('../models/CodeSnippet');
const { protect } = require('../middleware/auth');

// GET /api/v1/snippets — get all snippets for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const snippets = await CodeSnippet.find({ userId: String(req.user.id) }).sort({ createdAt: -1 });
    res.json({ success: true, data: snippets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load snippets' });
  }
});

// POST /api/v1/snippets — save a new snippet
router.post('/', protect, async (req, res) => {
  try {
    const { name, code, language } = req.body;
    if (!name || !code || !language) {
      return res.status(400).json({ success: false, message: 'name, code and language are required' });
    }
    const snippet = await CodeSnippet.create({ userId: String(req.user.id), name, code, language });
    res.status(201).json({ success: true, data: snippet });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save snippet' });
  }
});

// DELETE /api/v1/snippets/:id — delete a snippet (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findOne({ _id: req.params.id, userId: String(req.user.id) });
    if (!snippet) {
      return res.status(404).json({ success: false, message: 'Snippet not found' });
    }
    await snippet.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete snippet' });
  }
});

module.exports = router;
