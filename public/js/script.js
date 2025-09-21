document.addEventListener("DOMContentLoaded", () => {
  /* =======================
     SLIDERS
  ======================== */
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach(slider => {
    const images = slider.querySelectorAll("img");
    let index = 0;
    setInterval(() => {
      images[index].classList.remove("active");
      index = (index + 1) % images.length;
      images[index].classList.add("active");
    }, 3000);
  });

  /* =======================
     MOBILE NAVBAR
  ======================== */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  /* =======================
     SEARCH (Wikipedia API)
  ======================== */
  const searchInput = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");
  const searchForm = document.getElementById("searchForm");

  async function fetchSuggestions(query) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${encodeURIComponent(query)}&limit=10`
      );
      const data = await res.json();
      return data[1];
    } catch (err) {
      console.error("Wiki suggestion error:", err);
      return [];
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", async () => {
      const query = searchInput.value.trim();
      if (!query) {
        suggestions.style.display = "none";
        suggestions.innerHTML = "";
        return;
      }
      const results = await fetchSuggestions(query);
      suggestions.innerHTML =
        results.length === 0
          ? `<li>No matching place found</li>`
          : results.map(item => `<li>${item}</li>`).join("");
      suggestions.style.display = "block";
    });

    suggestions.addEventListener("click", e => {
      if (e.target.tagName === "LI") {
        const selected = e.target.textContent;
        if (selected === "No matching place found") return;
        searchInput.value = selected;
        suggestions.style.display = "none";
        searchForm.submit();
      }
    });

    document.addEventListener("click", e => {
      if (!searchForm.contains(e.target)) {
        suggestions.style.display = "none";
      }
    });
  }

  /* =======================
     HERO SLIDER
  ======================== */
  const heroSlides = document.querySelectorAll(".hero-slider .slide");
  let currentSlide = 0;
  if (heroSlides.length > 0) {
    setInterval(() => {
      heroSlides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add("active");
    }, 4000);
  }

  /* =======================
     CONTACT FORM
  ======================== */
  const contactForm = document.getElementById("contactForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();
      const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value,
      };
      try {
        const res = await fetch("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          popupMessage.textContent = "✅ Your message has been sent successfully!";
          contactForm.reset();
        } else {
          popupMessage.textContent = "❌ Failed to send message. Try again.";
        }
      } catch (err) {
        popupMessage.textContent = "⚠️ Error: " + err.message;
      }
      popup.classList.remove("hidden");
    });
  }
});

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

/* =======================
   HOME PAGE EXTRAS
======================= */
// Image Carousel
const carouselImages = document.querySelectorAll(".carousel img");
let currentIndex = 0;
if (carouselImages.length > 0) {
  setInterval(() => {
    carouselImages[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % carouselImages.length;
    carouselImages[currentIndex].classList.add("active");
  }, 4000);
}

// Visitor Counter
const visitorCount = document.getElementById("visitorCount");
if (visitorCount) {
  setInterval(() => {
    visitorCount.textContent =
      parseInt(visitorCount.textContent) + Math.floor(Math.random() * 5);
  }, 3000);
}

// Scroll to Banner
function scrollToBanner() {
  document.getElementById("envBanner").scrollIntoView({ behavior: "smooth" });
}
