const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
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

// Run server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
