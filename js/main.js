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

  // Active nav link — compare file names so ../blog.html matches blog.html,
  // and map section pages back to the menu item that owns them: any article
  // under /posts/ belongs to Blog, and the coaching destinations belong to
  // Coaching (they have no menu entry of their own since the dropdown went).
  const COACHING_PAGES = [
    'coaching.html',
    'coaching-personal.html',
    'coaching-grupal.html',
    'coaching-empresas.html',
    'programa.html',
    'mi-metodo.html'
  ];

  const inPosts = window.location.pathname.includes('/posts/');
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  let target = currentFile;
  if (inPosts) target = 'blog.html';
  else if (COACHING_PAGES.includes(currentFile)) target = 'coaching.html';

  document.querySelectorAll('.nav-links a').forEach(link => {
    const file = (link.getAttribute('href') || '').split('/').pop();
    link.classList.toggle('active', file === target);
  });

  // Press quote rotator (hero)
  const slides = document.querySelectorAll('#press-rotator .quote-slide');
  const dotWrap = document.getElementById('press-dots');
  if (slides.length && dotWrap) {
    let active = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ver aparición ' + (i + 1));
      dot.addEventListener('click', () => { show(i); restart(); });
      dotWrap.appendChild(dot);
    });

    const dots = dotWrap.querySelectorAll('.quote-dot');

    function show(i) {
      active = i;
      slides.forEach((s, n) => s.classList.toggle('active', n === i));
      dots.forEach((d, n) => d.classList.toggle('active', n === i));
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(() => show((active + 1) % slides.length), 6000);
    }

    restart();
  }

  // Featured video — click to play, swaps the poster for the real player
  const frame = document.getElementById('tve-video');
  if (frame) {
    frame.addEventListener('click', function () {
      if (frame.classList.contains('is-playing')) return;

      const url = frame.dataset.video || window.TVE_VIDEO_URL || '';
      if (!url) {
        const cap = frame.querySelector('.video-caption');
        if (cap) cap.textContent = 'Añade la URL del vídeo en index.html (TVE_VIDEO_URL)';
        console.warn('[castiyuste] No hay URL de vídeo configurada. ' +
          'Define window.TVE_VIDEO_URL en index.html o data-video en #tve-video.');
        return;
      }

      const isFile = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
      const player = document.createElement(isFile ? 'video' : 'iframe');

      if (isFile) {
        player.src = url;
        player.controls = true;
        player.autoplay = true;
      } else {
        // add autoplay for the common embed providers
        player.src = url + (url.includes('?') ? '&' : '?') + 'autoplay=1';
        player.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
        player.allowFullscreen = true;
      }
      player.title = 'Casti Yuste en 24 Horas · TVE';

      frame.classList.add('is-playing');
      frame.appendChild(player);
    });
  }

  // El badge flotante es un «empieza por aquí»: en la página a la que apunta
  // no haría nada, así que se retira en lugar de quedarse como control muerto.
  const badge = document.querySelector('.badge-fab');
  if (badge) {
    const dest = (badge.getAttribute('href') || '').split('/').pop();
    if (dest && dest === currentFile) badge.remove();
  }

  // Reseñas — «Leer más» sólo cuando el texto se está recortando de verdad,
  // así una reseña corta no muestra un botón que no hace nada.
  document.querySelectorAll('.review-card').forEach(card => {
    const text = card.querySelector('.review-text');
    const btn = card.querySelector('.review-more');
    if (!text || !btn) return;

    if (text.scrollHeight <= text.clientHeight + 2) {
      btn.remove();
      text.classList.remove('clamped');
      return;
    }

    btn.addEventListener('click', () => {
      const collapsed = text.classList.toggle('clamped');
      btn.textContent = collapsed ? 'Leer más' : 'Leer menos';
      btn.setAttribute('aria-expanded', String(!collapsed));
    });
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
