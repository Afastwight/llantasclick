export function initNavigationHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 80) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = '#fff';
      }
    });
  });
}
