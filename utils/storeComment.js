const fs = require('fs');
const path = require('path');
const rateMap = new Map();
const logPath = path.join(__dirname, '..', 'src', 'data', 'comments.json');

// Basic XSS sanitization
function sanitize(input) {
  return String(input)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Rate limit: 1 comment per email per 5 minutes
function isRateLimited(email) {
  const now = Date.now();
  const last = rateMap.get(email);
  if (last && now - last < 5 * 60 * 1000) return true;
  rateMap.set(email, now);
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
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(data, null, 2));
}

module.exports = async function storeComment(req) {
  const { name, email, website, comment, notify } = req.body;

  if (!name || !email || !comment) {
    throw new Error('Name, email, and comment are required.');
  }

  if (isRateLimited(email)) {
    throw new Error('Please wait before commenting again.');
  }

  const sanitized = {
    timestamp: new Date().toISOString(),
    name: sanitize(name),
    email: sanitize(email),
    website: sanitize(website || ''),
    comment: sanitize(comment),
    notify: notify === 'on'
  };

  const log = readLog();
  log.push(sanitized);
  writeLog(log);

  return sanitized;
};
