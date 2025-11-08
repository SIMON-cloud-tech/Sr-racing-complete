const xss = require('xss');
const fs = require('fs');
const path = require('path');

const sanitizeInput = (input) => xss(input.trim());

const logContactSubmission = (data) => {
  const logPath = path.join(__dirname, 'data', 'logs.json');
  const timestamp = new Date().toISOString();
  const entry = { timestamp, ...data };

  fs.readFile(logPath, 'utf8', (err, fileData) => {
    let logs = [];
    if (!err && fileData) {
      try {
        logs = JSON.parse(fileData);
      } catch {
        logs = [];
      }
    }
    logs.push(entry);
    fs.writeFile(logPath, JSON.stringify(logs, null, 2), (err) => {
      if (err) console.error('Failed to write contact log:', err);
    });
  });
};

module.exports = { sanitizeInput, logContactSubmission };
