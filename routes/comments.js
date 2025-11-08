const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const storeComment = require('../utils/storeComment');
const sendCommentEmail = require('../utils/sendCommentEmail');
const logPath = path.join(__dirname, '..', 'src', 'data', 'comments.json');

router.post('/submit', async (req, res) => {
  try {
    const sanitized = await storeComment(req);
    await sendCommentEmail(sanitized);
    res.json({ success: true, message: 'Comment submitted successfully!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/count', (req, res) => {
  try {
    const raw = fs.existsSync(logPath) ? fs.readFileSync(logPath) : '[]';
    const comments = JSON.parse(raw);
    res.json({ count: comments.length });
  } catch {
    res.json({ count: 0 });
  }
});

module.exports = router;
