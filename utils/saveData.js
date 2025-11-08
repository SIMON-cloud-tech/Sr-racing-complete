const fs = require('fs');
const path = require('path');
const rateLimitMap = new Map();
const logPath = path.join(__dirname, '..', 'src', 'data', 'newsletters.json');


// Simple XSS sanitization
function sanitize(input) {
  return String(input)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Rate limiting: max 1 submission per email per 10 minutes
function isRateLimited(email) {
  const now = Date.now();
  const last = rateLimitMap.get(email);
  if (last && now - last < 10 * 60 * 1000) return true;
  rateLimitMap.set(email, now);
  return false;
}

// Read log
function readLog() {
  if (!fs.existsSync(logPath)) return [];
  const raw = fs.readFileSync(logPath);
  return JSON.parse(raw);
}

// Write log
function writeLog(data) {
  fs.writeFileSync(logPath, JSON.stringify(data, null, 2));
}

module.exports = async function saveData(req) {
  const { name, email, organisation, country, comments } = req.body;

  if (!name || !email || !organisation || !country || !comments) {
    throw new Error('All fields are required.');
  }

  if (isRateLimited(email)) {
    throw new Error('Please wait before submitting again.');
  }

  const sanitized = {
    timestamp: new Date().toISOString(),
    name: sanitize(name),
    email: sanitize(email),
    organisation: sanitize(organisation),
    country: sanitize(country),
    comments: sanitize(comments)
  };

  const log = readLog();
  log.push(sanitized);
  writeLog(log);

  return sanitized;
};
