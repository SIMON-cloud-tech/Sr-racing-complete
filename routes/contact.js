const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { sanitizeInput, logContactSubmission } = require('../src/utils');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Validation rules
const validateContact = [
  body('competition').notEmpty(),
  body('name').notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('knowUs').notEmpty(),
  body('phone').notEmpty(),
  body('comments').notEmpty(),
  body('checkbox').equals('on')
];

router.post('/', validateContact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const data = {};
  for (let key in req.body) {
    data[key] = sanitizeInput(req.body[key]);
  }

  logContactSubmission(data);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const businessMail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: `New Contact Message from ${data.name}`,
    text: `
Subject: ${data.competition}
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
How they knew us: ${data.knowUs}
Comments: ${data.comments}
    `
  };

  const clientMail = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: 'Thank you for contacting STEM Racing',
    text: `Hi ${data.name},\n\nThank you for reaching out. We’ve received your message and will respond shortly.\n\nSTEM Racing Ltd.`
  };

  try {
    await transporter.sendMail(businessMail);
    await transporter.sendMail(clientMail);
    res.json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;
