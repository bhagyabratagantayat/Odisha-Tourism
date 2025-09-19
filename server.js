const express = require('express');
const axios = require('axios');
const nodemailer = require("nodemailer");
require("dotenv").config(); // load .env

const app = express();
const PORT = 5000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for JSON (contact form AJAX)
app.set('view engine', 'ejs');

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

    if (data.type === "disambiguation" || !data.extract) {
      return res.render('index', { error: "No results found. Try another place." });
    }

    res.render('result', { data });
  } catch (err) {
    console.error("❌ Wiki API error:", err.message);
    res.render('index', { error: "Error fetching data. Try again later." });
  }
});

// Tourist Places Page
app.get('/places', (req, res) => {
  res.render('places');
});

// Contact Page (GET)
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us - Odisha Tourism",
  });
});

// Contact Form Submission (POST)
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, error: "Name, email, and message are required." });
  }

  try {
    // Setup mail transporter (using Gmail + App Password)
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER, // Your inbox
      subject: subject || "New Contact Form Message",
      text: `
        📩 New Contact Form Submission:

        Name: ${name}
        Email: ${email}
        Subject: ${subject || "N/A"}
        Message: ${message}
      `,
      html: `
        <h2>📩 New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject || "N/A"}</p>
        <p><b>Message:</b><br>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Email error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to send email. Please try again." });
  }
});

// ================= START SERVER ================= //
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
