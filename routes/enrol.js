const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'enrols.json');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function readEnrols() {
  try {
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
  } catch (err) {
    console.error('❌ Error reading enrols.json:', err);
    throw new Error('Failed to read enrols.json');
  }
}

function writeEnrols(data) {
  try {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('✅ Email written to enrols.json');
  } catch (err) {
    console.error('❌ Error writing enrols.json:', err);
    throw new Error('Failed to write enrols.json');
  }
}

function sanitize(str) {
  return typeof str === 'string'
    ? str.trim().replace(/<[^>]*>?/gm, '')
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;')
    : str;
}

// ✅ Route path updated to match app.use('/enrol', enrolRoutes)
router.post('/', async (req, res) => {
  console.log('🔥 Enrolment route hit');
  console.log('📦 Raw body:', req.body);

  try {
    const sanitized = {};
    for (const key in req.body) {
      sanitized[key] = sanitize(req.body[key]);
    }

    const { emailToSend, checkbox } = sanitized;

    if (!checkbox || !emailToSend) {
      console.log('⚠️ Missing checkbox or email');
      return res.status(400).json({ message: 'Missing checkbox or email.' });
    }

    const enrols = readEnrols();
    enrols.push({ email: emailToSend, timestamp: new Date().toISOString() });
    writeEnrols(enrols);

    // ✅ Send confirmation email to client
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailToSend,
        subject: 'STEM Racing Enrolment Confirmation',
        html: `<p>Thank you for enrolling. You will receive updates from STEM Racing Ltd.</p>`
      });
      console.log('📤 Email sent to client');
    } catch (err) {
      console.error('❌ Client email failed:', err);
      return res.status(500).json({ message: 'Failed to send confirmation email.', error: err.message });
    }

    // ✅ Notify business
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New STEM Racing Enrolment',
        html: `<p>New enrolment received from: <strong>${emailToSend}</strong></p>`
      });
      console.log('📤 Email sent to business');
    } catch (err) {
      console.error('❌ Business email failed:', err);
      return res.status(500).json({ message: 'Failed to notify business.', error: err.message });
    }

    return res.json({ message: 'Enrolment successful. Confirmation email sent.' });
  } catch (err) {
    console.error('🔥 Server error:', err);
    res.status(500).json({ message: 'Server error. Try again later.', error: err.message });
  }
});

module.exports = router;
