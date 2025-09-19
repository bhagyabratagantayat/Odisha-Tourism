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


// sugges
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      suggestions.style.display = "none";
      return;
    }

    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      const titles = data[1]; // Wikipedia titles

      suggestions.innerHTML = "";

      if (titles.length > 0) {
        titles.forEach(title => {
          const li = document.createElement("li");
          li.textContent = title;
          li.addEventListener("click", () => {
            searchInput.value = title;
            suggestions.style.display = "none";
          });
          suggestions.appendChild(li);
        });
        suggestions.style.display = "block";
      } else {
        suggestions.style.display = "none";
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchForm")) {
      suggestions.style.display = "none";
    }
  });
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

