// server.js
const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // supports form posts
app.use(express.json()); // supports JSON (AJAX)
app.set('view engine', 'ejs');

// SIMPLE ENV CHECK
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  Warning: EMAIL_USER or EMAIL_PASS is not set in .env. Mailing will fail until you set them.');
} else {
  console.log('✔ EMAIL_USER loaded:', process.env.EMAIL_USER);
}

// Create a reusable transporter using explicit Gmail SMTP (works with App Password)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter at startup
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Mail transporter verify failed:', err);
  } else {
    console.log('✅ Mail server is ready to send messages');
  }
});

// ================= ROUTES ================= //

// Home Page
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

// Search Wikipedia Place
app.post('/search', async (req, res) => {
  const city = req.body.city;
  if (!city) {
    return res.render('index', { error: "Please enter a place to search." });
  }

  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`;
    const response = await axios.get(wikiUrl);
    const data = response.data;

    if (data.type === 'disambiguation' || !data.extract) {
      return res.render('index', { error: "No results found. Try another place." });
    }

    res.render('result', { data });
  } catch (err) {
    console.error('❌ Wiki API error:', err && err.message ? err.message : err);
    res.render('index', { error: "Error fetching data. Try again later." });
  }
});

// Tourist Places Page
app.get('/places', (req, res) => {
  res.render('places');
});

// Contact Page (GET)
app.get('/contact', (req, res) => {
  // If you want server-side success/error messages after form submit (non-AJAX),
  // you can pass success/error into the template here.
  res.render('contact', { title: 'Contact Us - Odisha Tourism' });
});

// Contact Form Submission (POST)
// Accepts both application/x-www-form-urlencoded and JSON (AJAX)
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  // Build mail options
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER, // your inbox (make sure this is set)
    subject: subject || `New Contact Form Message from ${name}`,
    text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\n${message}`,
    html: `<h3>New Contact Form Submission</h3>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
           <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId, 'response:', info.response);
    // For AJAX client we return JSON
    return res.json({ success: true });
  } catch (err) {
    console.error('❌ Email error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email. Check server logs.' });
  }
});

// Optional quick test route - visit /test-email to send a test mail to EMAIL_USER
app.get('/test-email', async (req, res) => {
  if (!process.env.EMAIL_USER) {
    return res.status(400).send('Set EMAIL_USER in .env and restart server.');
  }
  try {
    const info = await transporter.sendMail({
      from: `"Odisha Tourism Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test email from Odisha Tourism app',
      text: 'This is a test email to verify Nodemailer configuration.',
      html: '<p>This is a <strong>test</strong> email to verify Nodemailer configuration.</p>',
    });
    console.log('✅ Test email sent:', info.messageId);
    res.send('Test email sent — check inbox (or spam).');
  } catch (err) {
    console.error('❌ Test email error:', err);
    res.status(500).send('Failed to send test email. Check server logs.');
  }
});

// Start
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
