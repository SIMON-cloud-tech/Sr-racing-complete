const express = require('express');
const path = require('path');
const contactRoute = require('../routes/contact');
const commentsRoute = require('../routes/comments');
const { contactLimiter } = require('./limiter');
const newsletterRoute = require('../routes/newsletter');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Mount contact route with rate limiter
app.use('/comments', commentsRoute);
app.use('/contact', contactLimiter, contactRoute);
app.use('/newsletter', newsletterRoute);


// Fallback to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));