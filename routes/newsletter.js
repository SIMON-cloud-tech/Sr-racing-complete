const express = require('express');
const router = express.Router();
const saveData = require('../utils/saveData');
const sendEmail = require('../utils/sendEmail');

router.post('/submit', async (req, res) => {
  try {
    // Sanitize and validate input, apply rate limiting
    const sanitizedData = await saveData(req);

    // Send dual emails: one to client, one to business
    await sendEmail(sanitizedData);

    res.json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Newsletter submission error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
