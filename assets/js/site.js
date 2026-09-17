(() => {
  const cards = document.querySelectorAll('.card[data-src]');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Lightbox --- */
  const open = (src, title, place) => {
    if (!lightbox) return;
    lbImage.src = src;
    lbImage.alt = title || '';
    lbCaption.textContent = place ? `${title} — ${place}` : (title || '');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      open(card.dataset.src, card.dataset.title, card.dataset.place);
    });
  });

  if (lbClose) lbClose.addEventListener('click', close);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) close();
  });

  /* --- Reveal on scroll --- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* --- Scroll-spy nav --- */
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((sec) => spy.observe(sec));
  }

  /* --- Konami code easter egg: rain cute dinosaurs --- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;
  let partying = false;

  const party = () => {
    if (partying) return;
    partying = true;
    const dinos = ['🦕', '🦖'];

    if (!reduceMotion) {
      const rain = document.createElement('div');
      rain.className = 'dino-rain';
      for (let i = 0; i < 32; i++) {
        const d = document.createElement('span');
        d.className = 'dino-drop';
        d.textContent = dinos[Math.floor(Math.random() * dinos.length)];
        d.style.left = (Math.random() * 100) + 'vw';
        d.style.fontSize = (1.4 + Math.random() * 2.2) + 'rem';
        d.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
        d.style.animationDuration = (3 + Math.random() * 3) + 's';
        d.style.animationDelay = (Math.random() * 1.4) + 's';
        rain.appendChild(d);
      }
      document.body.appendChild(rain);
      setTimeout(() => rain.remove(), 8000);
    }

    const toast = document.createElement('div');
    toast.className = 'konami-toast';
    toast.innerHTML = '1-UP! 🦕<br>you found the secret';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-on'));
    setTimeout(() => toast.classList.remove('is-on'), 3600);
    setTimeout(() => { toast.remove(); partying = false; }, 4200);
  };

  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) { konamiIdx = 0; party(); }
    } else {
      konamiIdx = (key === KONAMI[0]) ? 1 : 0;
    }
  });

})();
