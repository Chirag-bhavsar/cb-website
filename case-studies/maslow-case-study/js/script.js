// Scroll-reveal for sections
const els = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

els.forEach((el) => io.observe(el));

// Active nav link on scroll
const navLinks = Array.from(document.querySelectorAll('nav ul a[href^="#"]'));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function updateActiveNav() {
  const y = window.scrollY + 120;
  let current = sections[0];
  for (const s of sections) {
    if (s.offsetTop <= y) current = s;
  }
  navLinks.forEach((a) => {
    a.classList.toggle('active', document.querySelector(a.getAttribute('href')) === current);
  });
}
document.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();
