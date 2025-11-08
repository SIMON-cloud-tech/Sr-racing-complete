const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async function sendEmail(data) {
  const { name, email, organisation, country, comments } = data;

  const clientMsg = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for subscribing to STEM Racing!',
    text: `Hi ${name},\n\nThanks for signing up. We’ll keep you updated with news and events.\n\nSTEM Racing Team`
  };

  const businessMsg = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: 'New Newsletter Signup',
    text: `New signup:\n\nName: ${name}\nEmail: ${email}\nOrganisation: ${organisation}\nCountry: ${country}\nComments: ${comments}`
  };

  await transporter.sendMail(clientMsg);
  await transporter.sendMail(businessMsg);
};
