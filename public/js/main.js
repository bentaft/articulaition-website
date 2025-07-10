// Main JavaScript File

document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations
  initializeAnimations();

  // Initialize navigation
  initializeNavigation();

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Initialize form handling
  initializeForms();

  // Initialize coaching cards
  initializeCoachingCards();
});

// Initialize all animations
function initializeAnimations() {
  // Initialize scroll animations
  animationController.initScrollAnimations();

  // Initialize parallax effects
  animationController.initParallax();

  // Stagger coaching cards animation
  animationController.staggerAnimation(".coaching-card", 150);

  // Stagger benefits animation
  animationController.staggerAnimation(".benefit-item", 100);

  // Initialize magnetic buttons
  animationController.initMagneticButtons();

  // Add animate-on-scroll class to elements
  const animateElements = document.querySelectorAll(
    ".coaching-card, .benefit-item"
  );
  animateElements.forEach((el) => el.classList.add("animate-on-scroll"));
}

// Navigation functionality
function initializeNavigation() {
  const header = document.getElementById("header");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.querySelector(".nav-links");

  // Header scroll effect with performance optimization
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll);

  // Mobile menu toggle
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when clicking outside (with performance optimization)
  const handleOutsideClick = (e) => {
    if (!e.target.closest(".nav") && navLinks.classList.contains("active")) {
      mobileMenuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    }
  };
  document.addEventListener("click", handleOutsideClick, { passive: true });

  // Close mobile menu when clicking on a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = document.getElementById("header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Form handling (for future implementation)
function initializeForms() {
  const ctaButtons = document.querySelectorAll(".cta-button");

  ctaButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (button.getAttribute("href") === "#") {
        e.preventDefault();
        // Show modal or redirect to signup page
        showSignupModal();
      }
    });
  });
}

// Coaching cards interaction
function initializeCoachingCards() {
  const cards = document.querySelectorAll(".coaching-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Use CSS class for better performance
      cards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.add('dimmed');
        }
      });
    });

    card.addEventListener("mouseleave", () => {
      // Reset using CSS class
      cards.forEach((otherCard) => {
        otherCard.classList.remove('dimmed');
      });
    });

    // Click handler for future functionality
    card.addEventListener("click", () => {
      const style = card.dataset.style;
      console.log(`Selected coaching style: ${style}`);
      // Future: Navigate to coaching session or show more details
    });
  });
}

// Placeholder for signup modal (to be implemented)
function showSignupModal() {
  console.log("Signup modal would appear here");
  // Future implementation: Show a modal with signup form
  // For now, just log the action

  // Track button clicks for analytics
  if (typeof gtag !== "undefined") {
    gtag("event", "click", {
      event_category: "CTA",
      event_label: "Start Free Trial",
    });
  }
}

// Performance monitoring
if ("PerformanceObserver" in window) {
  const perfObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log(`${entry.name}: ${entry.duration}ms`);
    }
  });

  perfObserver.observe({ entryTypes: ["measure"] });
}

// Page visibility handling for performance
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause expensive operations when page is not visible
    if (typeof animationController !== "undefined") {
      animationController.pause();
    }
  } else {
    // Resume operations when page becomes visible
    if (typeof animationController !== "undefined") {
      animationController.resume();
    }
  }
});


// Clean up on page unload
window.addEventListener("beforeunload", () => {
  // Clean up any running animations or observers
  if (typeof animationController !== "undefined") {
    animationController.destroy();
  }
});
