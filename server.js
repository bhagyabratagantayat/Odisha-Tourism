const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

const nodemailer = require("nodemailer");
require("dotenv").config(); // if using .env file



// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // 👈 for JSON (contact form AJAX)
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

app.post('/search', async (req, res) => {
  const city = req.body.city;
  if (!city) {
    return res.render('index', { error: "Please enter a place to search." });
  }

  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`;
    const response = await axios.get(wikiUrl);
    const data = response.data;

    // If Wikipedia does not have a page
    if (data.type === "disambiguation" || !data.extract) {
      return res.render('index', { error: "No results found. Try another place." });
    }

    res.render('result', { data });
  } catch (err) {
    res.render('index', { error: "Error fetching data. Try again later." });
  }
});

// Tourist places page
app.get('/places', (req, res) => {
  res.render('places');
});

// conact 
app.get('/contact', (req, res) => {
  res.render('contact', { error: null });
});

app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message are required." });
  }

  // log for now (can replace with Nodemailer or DB later)
  console.log("📩 Contact form:", { name, email, subject, message });

  return res.json({ success: true });
});
 
// test  
/* OPTIONAL: Nodemailer example (commented)
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: '"Odisha Tourism" <no-reply@odishatourism.example>',
  to: 'info@odishatourism.example',
  subject: `Contact Form: ${subject}`,
  text: `From: ${name} <${email}>\n\n${message}`
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('Mail error', err);
    return res.status(500).json({ success:false, error:'Email sending failed' });
  }
  res.json({ success:true });
});
*/

// test  





// Run server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
