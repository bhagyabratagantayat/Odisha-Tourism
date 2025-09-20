document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider");

  sliders.forEach(slider => {
    let slides = slider.querySelectorAll(".slide");
    let index = 0;

    setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, 3000); // 3s per slide
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider");

  sliders.forEach((slider) => {
    const images = slider.querySelectorAll("img");
    let index = 0;

    setInterval(() => {
      images[index].classList.remove("active");
      index = (index + 1) % images.length; // loop back after last image
      images[index].classList.add("active");
    }, 2000); // change every 2 seconds
  });
});



// Toggle mobile navbar
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const searchForm = document.getElementById("searchForm");

// Function to fetch Wikipedia suggestions
async function fetchSuggestions(query) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${encodeURIComponent(query)}&limit=10`
    );
    const data = await response.json();
    return data[1]; // data[1] contains the titles
  } catch (err) {
    console.error("Wiki suggestion error:", err);
    return [];
  }
}

// Display suggestions
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (!query) {
    suggestions.style.display = "none";
    suggestions.innerHTML = "";
    return;
  }

  const results = await fetchSuggestions(query);

  if (results.length === 0) {
    suggestions.innerHTML = `<li>No matching place found</li>`;
  } else {
    suggestions.innerHTML = results
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
  suggestions.style.display = "block";
});

// Handle click on suggestion
suggestions.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const selected = e.target.textContent;
    if (selected === "No matching place found") return;
    searchInput.value = selected;
    suggestions.style.display = "none";
    searchForm.submit(); // submit form to server
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!searchForm.contains(e.target)) {
    suggestions.style.display = "none";
  }
});



// contact
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    feedback.textContent = "⏳ Sending...";
    feedback.className = "form-feedback pending";

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        feedback.textContent = "✅ Message sent successfully!";
        feedback.className = "form-feedback success";
        contactForm.reset();
      } else {
        feedback.textContent = `❌ ${data.error || "Failed to send message."}`;
        feedback.className = "form-feedback error";
      }
    } catch (err) {
      feedback.textContent = "❌ Network error. Try again later.";
      feedback.className = "form-feedback error";
    }
  });
});



//   js home

// Hamburger Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', ()=> navLinks.classList.toggle('active'));

// Image Carousel
const carouselImages = document.querySelectorAll('.carousel img');
let currentIndex = 0;
setInterval(()=>{
  carouselImages[currentIndex].classList.remove('active');
  currentIndex = (currentIndex+1)%carouselImages.length;
  carouselImages[currentIndex].classList.add('active');
},4000);

// Fake Visitor Counter Increment
const visitorCount = document.getElementById('visitorCount');
setInterval(()=> {
  visitorCount.textContent = parseInt(visitorCount.textContent)+Math.floor(Math.random()*5);
},3000);

// Scroll to Banner
function scrollToBanner(){
  document.getElementById('envBanner').scrollIntoView({behavior:'smooth'});
}

