// HAMBURGER MENU TOGGLE FOR MOBILE NAVIGATION
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('#mainNav ul');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('hamreveal');
      navMenu.classList.toggle('hamreveal');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    });
  }
});


