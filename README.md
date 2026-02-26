# Yaser Ahmmed Ratul — Portfolio

A luxurious, fully animated, single-page portfolio website with a Node.js Express backend for secure email handling using Brevo SMTP.

## Tech Stack
### Frontend
- HTML5
- CSS3 (Vanilla, Custom Properties, Glassmorphism, Grid/Flexbox)
- JavaScript (Vanilla, ES6+, IntersectionObserver, Canvas API, Fetch API)
- No frameworks or external libraries used (except Google Fonts).

### Backend
- Node.js & Express
- Nodemailer with Brevo SMTP for contact form processing
- dotenv for environment variable management
- CORS

## Deployment Instructions on Render.com

This project requires two separate services on Render.

### 1. Static Site (Frontend)
1. In Render, create a new **Static Site**.
2. Connect this repository.
3. Set **Build Command** to `none` (leave empty).
4. Set **Publish Directory** to `.` (root directory).
5. Deploy.

### 2. Web Service (Backend)
1. In Render, create a new **Web Service**.
2. Connect this repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `node server.js`.
6. Add the following Environment Variables (from your Brevo SMTP settings):
   - `SMTP_SERVER` = smtp-relay.brevo.com
   - `SMTP_PORT` = 587
   - `SMTP_LOGIN` = your-brevo-login-email
   - `SMTP_PASSWORD` = your-brevo-smtp-key
   - `RECEIVER_EMAIL` = ratul41g@gmail.com
7. Deploy.
8. **Important:** Once the backend is deployed, copy its URL and update the `fetch` URL in `script.js` (inside `initContactForm`) to point to the new backend URL instead of `http://localhost:5000`.

## Features
- Custom interactive trailing cursor
- Canvas-based particle background
- Smooth scroll with IntersectionObserver reveal animations
- 3D tilt effects on project cards
- Glassmorphism UI elements
- Secure contact form using backend SMTP relay
