/* ==========================================================================
   GNARLIE.CTH - MOBILE HAMBURGER MENU ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  // Targeted #mainNav directly (works with or without an internal <ul>)
  const navMenu = document.getElementById('mainNav');

  if (hamburger && navMenu) {
    // 1. Toggle Menu Open/Close
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('hamreveal');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      
      // Prevent background scrolling when full-screen drawer is active
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // 2. Close Menu when clicking outside of navigation area
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('hamreveal') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        toggleMenu();
      }
    });

    // 3. Close Menu on 'Escape' key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('hamreveal')) {
        toggleMenu();
      }
    });

    // 4. Close Menu automatically when a link is tapped
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('hamreveal')) {
          toggleMenu();
        }
      });
    });
  }
});