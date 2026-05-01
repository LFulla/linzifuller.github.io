(() => {
  const cards = document.querySelectorAll('.card[data-src]');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const header = document.querySelector('.site-header');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
