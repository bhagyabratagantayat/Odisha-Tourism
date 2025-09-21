// server.js
const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

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
  const city = req.body.city?.trim();

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

    // ✅ Always open result page with the data
    res.render('result', { data });
  } catch (err) {
    console.error('❌ Wiki API error:', err?.message || err);
    res.render('index', { error: "Error fetching data. Try again later." });
  }
});

// Tourist Places Page
app.get('/places', (req, res) => {
  res.render('places');
});

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.render('contact', { error: 'Name, email, and message are required.' });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: subject || `New Contact Form Message from ${name}`,
    text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\n${message}`,
    html: `<h3>New Contact Form Submission</h3>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
           <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    // Redirect to feedback page after success
    res.render('feedback', { name });
  } catch (err) {
    console.error('❌ Email error:', err);
    res.render('contact', { error: 'Failed to send email. Please try again.' });
  }
});



//feedback 

app.get('/contact', (req, res) => {
  res.render('contact', { error: null });
});



// Start
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
