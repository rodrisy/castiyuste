/* ============================================
   CASTI YUSTE COACH - Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // Testimonial carousel
  const cards = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let current = 0;

  function showTestimonial(index) {
    cards.forEach((c, i) => c.style.display = i === index ? 'block' : 'none');
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  if (cards.length > 0) {
    showTestimonial(0);
    dots.forEach((dot, i) => dot.addEventListener('click', () => showTestimonial(i)));
    if (cards.length > 1) {
      setInterval(() => showTestimonial((current + 1) % cards.length), 5500);
    }
  }

  // Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Newsletter form
  const nlForm = document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      this.innerHTML = '<p style="color:var(--green-dark);font-weight:600;padding:12px 0;">✓ ¡Gracias! Te has suscrito correctamente.</p>';
    });
  }

  // Contact form
  const cForm = document.querySelector('#contact-form');
  if (cForm) {
    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const s = document.querySelector('#contact-success');
      if (s) { cForm.style.display = 'none'; s.style.display = 'block'; }
    });
  }

});
