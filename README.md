

## 📘 `README.md` Documentation

```markdown
# Tests Project

## 🧠 Overview
A modular Node.js system for handling contact, enrolment, and comment workflows with frontend forms, backend routing, and audit-ready JSON logging. Designed for clarity, scalability, and sovereign deployment.

---

## 📁 Folder Structure

| Folder/File         | Purpose |
|---------------------|---------|
| `src/server.js`     | Main Express server entry point |
| `routes/`           | Backend route handlers (`contact.js`, `enrolment.js`, `comments.js`) |
| `src/utils*.js`     | Modular logic for validation, logging, and response formatting |
| `data/contacts.json`| Stores submitted contact form data |
| `src/data/logs*.json`| Audit logs for each form type |
| `public/html/`      | Frontend HTML pages (e.g. `contact.html`, `enrol.html`) |
| `public/js/`        | Form logic and frontend scripts |
| `public/css/`       | Stylesheets for each page type |
| `public/assets/`    | Images, logos, videos, and media assets |
| `public/reportImages/`| Structured image assets with metadata (`images.json`) |
| `public/docs/`      | PDF regulations and reference documents |
| `readme.md`         | Project documentation |
| `package.json`      | Dependencies and scripts |

---

## 🚀 Setup

```bash
npm install
node src/server.js
```

Ensure `.env` is configured with email credentials, port, and logging paths.

---

## 🌐 API Endpoints

| Method | Route         | Description |
|--------|---------------|-------------|
| POST   | `/contact`    | Submits contact form data |
| POST   | `/enrolment`  | Handles enrolment form submissions |
| POST   | `/comments`   | Logs user comments |
| GET    | `/status`     | (Optional) Health check or dashboard endpoint |

---

## 🔄 System Flow

1. **User Interaction**: HTML forms in `public/html/` trigger JS scripts in `public/js/`
2. **Submission**: Data sent via `fetch()` or form POST to backend routes
3. **Backend Processing**:
   - Validated via `utils*.js`
   - Logged to `data/` or `src/data/`
   - Email sent (if configured)
4. **Audit Trail**: All actions logged in JSON files for traceability

---

## 🛡️ Privacy & Logging

- All form submissions are logged in structured JSON files
- No external database; system is file-based and audit-friendly
- Email logic uses `.env` for secure credentials
- Logging modules are modular and teachable (`utilsEnrolment.js`, etc.)

---

## 📦 Assets & Media

- Images and videos stored in `public/assets/` and `public/videos/`
- Report images structured in `reportImages/` with metadata
- PDF regulations available in `public/docs/`

---

## 🧪 Testing & Debugging

- Use `console.log()` in route handlers to trace flow
- Check `logs*.json` for audit verification
- Use `tree -I 'node_modules' -L 5` to visualize structure

---

## 🧱 Future Enhancements

- Add dashboard for viewing logs and submissions
- Migrate to MongoDB or SQLite for scalable storage
- Implement rate limiting via `src/limiter.js`
- Add admin authentication for form access and log viewing

---

## 👤 Author

Simon Mwangangi — Founder, systems architect, and educator  
Building privacy-first, audit-friendly infrastructure for education, logistics, and behavioral trading pilots.

