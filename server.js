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


// ✅ Add your touristPlaces array here
const touristPlaces = [
  {
    name: "Puri Jagannath Temple",
    description: "One of the Char Dham pilgrimage sites, Puri is famous for the Jagannath Temple and Rath Yatra.",
    images: [
      "https://iili.io/K7tTNu1.md.jpg",
      "https://iili.io/K7tTOwF.md.jpg",
      "https://iili.io/K7tTjyP.md.jpg"
    ],
    badge: "Must Visit"
  },
  {
    name: "Konark Sun Temple",
    description: "A UNESCO World Heritage Site, the 13th-century Sun Temple is known for its magnificent stone carvings.",
    images: [
      "https://iili.io/K7taINp.jpg",
      "https://iili.io/K7taTDN.jpg",
      "https://iili.io/K7tazRR.jpg"
    ],
    badge: "UNESCO Site"
  },
  {
    name: "Chilika Lake",
    description: "Asia’s largest brackish water lagoon, famous for migratory birds and dolphin sightings.",
    images: [
      "https://iili.io/K7pRfuR.jpg",
      "https://iili.io/K7pR9G1.jpg",
      "https://iili.io/K7pRBZN.jpg"
    ],
    badge: "Nature"
  },
  {
    name: "Lingaraj Temple",
    description: "One of the oldest temples in Bhubaneswar, dedicated to Lord Shiva, showcasing Kalinga architecture.",
    images: [
      "https://iili.io/K7p05gI.jpg",
      "https://iili.io/K7p0lbs.jpg",
      "https://iili.io/K7p0IWv.jpg"
    ]
  },
  {
    name: "Udayagiri & Khandagiri Caves",
    description: "Ancient Jain rock-cut caves near Bhubaneswar, rich in carvings and history.",
    images: [
      "https://iili.io/K7pEfAF.jpg",
      "https://iili.io/K7pEnoJ.jpg",
      "https://iili.io/K7pEoMv.jpg"
    ]
  },
  {
    name: "Similipal National Park",
    description: "A biosphere reserve famous for tigers, elephants, and beautiful waterfalls.",
    images: [
      "https://iili.io/K7pGAqx.jpg",
      "https://iili.io/K7pGTsj.jpg",
      "https://iili.io/K7pG5gV.jpg"
    ]
  },
  {
    name: "Nandankanan Zoological Park",
    description: "Located in Bhubaneswar, famous for white tigers and botanical garden.",
    images: [
      "https://iili.io/K7pVxPj.jpg",
      "https://iili.io/K7pVoMb.jpg",
      "https://iili.io/K7pVIKx.jpg"
    ]
  },
  {
    name: "Hirakud Dam",
    description: "One of the longest dams in the world, built on the Mahanadi River near Sambalpur.",
    images: [
      "https://iili.io/K7pXRZF.jpg",
      "https://iili.io/K7pX7Cg.jpg",
      "https://iili.io/K7pXuTP.jpg"
    ]
  },
  {
    name: "Satkosia Gorge",
    description: "A scenic wildlife sanctuary with river Mahanadi cutting through mountains.",
    images: [
      "https://iili.io/K7pjUBe.jpg",
      "https://iili.io/K7pjrrb.jpg",
      "https://iili.io/K7pjgEu.jpg"
    ]
  },
  {
    name: "Raghurajpur Heritage Village",
    description: "Known as the heritage crafts village, famous for Pattachitra paintings and handicrafts.",
    images: [
      "https://iili.io/K7pN2cb.jpg",
      "https://iili.io/K7pNdKu.jpg",
      "https://iili.io/K7pN9V9.jpg"
    ]
  },
  {
    name: "Chandrabhaga Beach",
    description: "A serene beach near Konark, famous for sunrise views and cultural festivals.",
    images: [
      "https://iili.io/K7pePP1.jpg",
      "https://iili.io/K7pesKF.jpg",
      "https://iili.io/K7pe4oB.jpg"
    ]
  },
  {
    name: "Gopalpur Beach",
    description: "Peaceful beach town on the Bay of Bengal, ideal for relaxation and seafood.",
    images: [
      "https://iili.io/K7pSdKP.jpg",
      "https://iili.io/K7pSfRa.jpg",
      "https://iili.io/K7pSKHg.jpg"
    ]
  },
  {
    name: "Bhitarkanika National Park",
    description: "Famous for saltwater crocodiles, mangrove forests, and rich biodiversity.",
    images: [
      "https://iili.io/K7prEfp.jpg",
      "https://iili.io/K7prlWv.jpg",
      "https://iili.io/K7pr0sR.jpg"
    ]
  },
  {
    name: "Taratarini Temple",
    description: "Sacred shrine of Goddess Tara Tarini, located on Kumari hills near Berhampur.",
    images: [
      "https://iili.io/KYd5NoJ.jpg",
      "https://iili.io/KYd5jta.jpg",
      "https://iili.io/KYd5OMv.jpg"
    ]
  },
  {
    name: "Khandadhar Waterfall",
    description: "One of the highest waterfalls in Odisha, surrounded by dense forests.",
    images: [
      "https://iili.io/KYdE7CF.jpg",
      "https://iili.io/KYdERQ1.jpg",
      "https://iili.io/KYdEAhP.jpg"
    ]
  },
  {
    name: "Duduma Waterfall",
    description: "Located in Koraput, this majestic waterfall is also a hydroelectric power source.",
    images: [
      "https://iili.io/KYdWuSa.jpg",
      "https://iili.io/KYdWIKF.jpg",
      "https://iili.io/KYdWTcg.jpg"
    ]
  },
  {
    name: "Harishankar Temple & Gandhamardan Hills",
    description: "A religious and natural spot, known for scenic hills, caves, and medicinal plants.",
    images: [
      "https://iili.io/KYdSWtn.md.jpg",
      "https://iili.io/KYdQ7ef.jpg",
      "https://iili.io/KYdQYb4.jpg"
    ]
  },
  {
    name: "Gupteswar Cave Temple",
    description: "Famous Shiva temple inside a limestone cave in Koraput district.",
    images: [
      "https://iili.io/KY29GHP.jpg",
      "https://iili.io/KY29MR1.jpg",
      "https://iili.io/KY29VOF.jpg"
    ]
  },
  {
    name: "Kapilash Temple",
    description: "Situated on a hill in Dhenkanal, dedicated to Lord Shiva with panoramic views.",
    images: [
      "https://iili.io/KY2dPsa.jpg",
      "https://iili.io/KY2d6Wg.jpg",
      "https://iili.io/KY2d4zF.jpg"
    ]
  },
  {
    name: "Samaleswari Temple",
    description: "Famous temple in Sambalpur, dedicated to Goddess Samaleswari, the presiding deity of the region.",
    images: [
      "https://iili.io/KY23Ann.jpg",
      "https://iili.io/KY23TZX.jpg",
      "https://iili.io/KY23zuI.jpg"
    ]
  },
  {
    name: "Chandipur Beach",
    description: "Unique beach where the sea recedes up to 5 km during low tide.",
    images: [
      "https://iili.io/KY2fFn9.jpg",
      "https://iili.io/KY2fKGe.jpg",
      "https://iili.io/KY2f2Z7.jpg"
    ]
  },
  {
    name: "Tikarpada Wildlife Sanctuary",
    description: "Known for gharial crocodile conservation and scenic Satkosia gorge views.",
    images: [
      "https://iili.io/KY2zmmb.jpg",
      "https://iili.io/KY2I2EB.jpg",
      "https://iili.io/KY2IBpa.jpg"
    ]
  },
  {
    name: "Mahendragiri Hill",
    description: "Part of the Eastern Ghats in Odisha, known for its scenic views, mythological significance, and trekking opportunities.",
    images: [
      "https://iili.io/KYTgPS4.md.jpg",
      "https://iili.io/KYTgLR2.md.jpg",
      "https://iili.io/KYTg6lf.md.jpg",
      "https://iili.io/KYTgsHl.md.jpg"
    ]
  },
  {
    name: "Deomali Hill",
    description: "The highest peak in Odisha, located in the Eastern Ghats, famous for trekking, lush greenery, and panoramic valley views.",
    images: [
      "https://iili.io/KYGsGwl.md.jpg",
      "https://iili.io/KYGsWnS.md.jpg",
      "https://iili.io/KYGsEu4.md.jpg",
      "https://iili.io/KYGsMt2.md.jpg",
      "https://iili.io/KYGsXM7.md.jpg"
    ]
  }
];

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

// Express route to render spin result
// Spin result route
app.get('/spinresult/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const place = touristPlaces[id];
  if (!place) return res.redirect('/');
  res.render('spinresult', { place });
});


// Start
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
