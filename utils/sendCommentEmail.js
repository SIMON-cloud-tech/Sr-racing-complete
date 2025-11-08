const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async function sendCommentEmail(data) {
  const { name, email, comment } = data;

  const clientMsg = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thanks for your comment!',
    text: `Hi ${name},\n\nThanks for leaving a comment. We appreciate your input!\n\nYour comment:\n"${comment}"\n\nSTEM Racing Team`
  };

  await transporter.sendMail(clientMsg);
};
