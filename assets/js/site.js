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

  /* --- Glitch hero background --- */
  const canvas = document.getElementById('glitch');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>/\\|=+*-_.:;%#@&$'.split('');
    const COLORS = ['#3a2c20', '#4a3a2a', '#6a5640', '#c8b699', '#e9b67a', '#e06a3c'];
    const FONT = 18;          // cell size in px (CSS)
    let cols = 0, rows = 0, cells = [], dpr = 1, raf = 0, last = 0;

    const rand = (n) => Math.floor(Math.random() * n);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(rect.width / FONT);
      rows = Math.ceil(rect.height / FONT);
      cells = new Array(cols * rows).fill(0).map(() => ({
        ch: GLYPHS[rand(GLYPHS.length)],
        color: COLORS[rand(COLORS.length)],
      }));
      ctx.textBaseline = 'top';
      draw();
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = `500 ${FONT - 4}px "JetBrains Mono", monospace`;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const x = (i % cols) * FONT;
        const y = Math.floor(i / cols) * FONT;
        ctx.fillStyle = c.color;
        ctx.fillText(c.ch, x, y);
      }
    };

    const step = (t) => {
      if (t - last > 90) {            // ~11fps flicker — calm, not frantic
        last = t;
        const updates = Math.max(1, Math.floor(cells.length * 0.06));
        for (let n = 0; n < updates; n++) {
          const i = rand(cells.length);
          cells[i] = {
            ch: GLYPHS[rand(GLYPHS.length)],
            color: COLORS[rand(COLORS.length)],
          };
        }
        draw();
      }
      raf = requestAnimationFrame(step);
    };

    const start = () => { if (!raf && !reduceMotion) raf = requestAnimationFrame(step); };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    build();
    window.addEventListener('resize', build, { passive: true });

    // Only animate while the hero is on screen
    const hero = document.getElementById('home');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      }, { threshold: 0 }).observe(hero);
    } else {
      start();
    }
  }

})();
