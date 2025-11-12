const express = require('express');
const path = require('path');
const contactRoute = require('../routes/contact');
const commentsRoute = require('../routes/comments');
const { contactLimiter } = require('./limiter');
const enrolRoutes = require('../routes/enrol');
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
app.use('/enrol', enrolRoutes);



// Fallback to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));