/* ═══════════════════════════════════════════════
   BOTEZINI — Site Scripts (Professional Version)
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── NAV SCROLL ────────────────────────────
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('[data-spy]');

  function onScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    let current = '';
    sections.forEach(s => {
      const id = s.getAttribute('id');
      const top = s.offsetTop - 120;
      // Only set as current if the scroll is past the top AND the ID exists in the navLinks
      if (window.scrollY >= top) {
        if (Array.from(navLinks).some(a => a.getAttribute('href') === '#' + id)) {
          current = id;
        }
      }
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── HAMBURGER MENU ────────────────────────
  const menuBtn = document.getElementById('menuBtn');
  const navLinksWrap = document.getElementById('navLinks');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      navLinksWrap.classList.toggle('open');
    });
    navLinksWrap.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        navLinksWrap.classList.remove('open');
      });
    });
  }

  // ── FORM SUBMIT → WhatsApp ─────────────────
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.querySelector('#fname').value.trim();
      const empresa = form.querySelector('#fempresa').value.trim();
      const setor = form.querySelector('#fsetor').value;
      const qtd = form.querySelector('#fqtd').value.trim();
      const msg = form.querySelector('#fmsg').value.trim();

      let wppMsg = `*Novo Orçamento — Site Botezini*\n\n*Nome:* ${nome}\n*Empresa:* ${empresa}\n*Setor:* ${setor}\n*Colaboradores:* ${qtd}\n*Mensagem:* ${msg}`;
      const encoded = encodeURIComponent(wppMsg);
      window.open(`https://wa.me/5532999041457?text=${encoded}`, '_blank');

      form.style.display = 'none';
      formSuccess.classList.add('show');
      setTimeout(() => {
        form.reset();
        form.style.display = 'flex';
        formSuccess.classList.remove('show');
      }, 6000);
    });
  }

  // ── SMOOTH SCROLL ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── VARIATION TABS ────────────────────────
  document.querySelectorAll('.var-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const panel = tab.getAttribute('data-panel');
      document.querySelectorAll('.var-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.var-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('panel-' + panel);
      if (target) target.classList.add('active');
    });
  });

  // ── FADE IN ANIMATIONS ────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ── PILLARS 3D CARROUSEL ENGINE ──────────────────────
  function init3DCarrousel(trackId, dotsId, leftId, rightId, autoTimerSpeed = 5000) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);
    const leftArrow = document.getElementById(leftId);
    const rightArrow = document.getElementById(rightId);

    if (!track || !dotsContainer) return;

    const items = Array.from(track.children);
    const total = items.length;
    let active = 0;

    // Generate dots
    items.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'carrousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function getPos(index) {
      let rel = ((index - active) % total + total) % total;
      if (rel > total / 2) rel -= total;
      return rel;
    }

    function update() {
      items.forEach((p, i) => {
        const pos = getPos(i);
        if (Math.abs(pos) > 1) {
          p.setAttribute('data-pos', 'other');
        } else {
          p.setAttribute('data-pos', String(pos));
        }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === active));
    }

    function goTo(index) {
      active = ((index % total) + total) % total;
      update();
    }

    function prev() { goTo(active - 1); }
    function next() { goTo(active + 1); }

    if (leftArrow) leftArrow.addEventListener('click', prev);
    if (rightArrow) rightArrow.addEventListener('click', next);

    items.forEach((p, i) => {
      p.addEventListener('click', () => {
        if (p.getAttribute('data-pos') !== '0') goTo(i);
      });
      p.style.cursor = 'pointer';
    });

    // Keyboard navigation (only for main one if desired, but we'll bind globally)
    // To prevent conflicts with multiple carousels, keyboard arrows will only control the main one.
    if (trackId === 'pillarsTrack') {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      });
    }

    let dragStart = null;
    track.addEventListener('mousedown', e => { dragStart = e.clientX; });
    track.addEventListener('mouseup', e => {
      if (dragStart !== null) {
        const diff = dragStart - e.clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        dragStart = null;
      }
    });
    track.addEventListener('touchstart', e => { dragStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      if (dragStart !== null) {
        const diff = dragStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
        dragStart = null;
      }
    });

    let autoTimer = setInterval(next, autoTimerSpeed);
    const wrap = track.closest('.pillars-container, .var-carousel-wrap');
    if (wrap) {
      wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
      wrap.addEventListener('mouseleave', () => { autoTimer = setInterval(next, autoTimerSpeed); });
    }

    update();
  }

  // Initialize both carousels
  init3DCarrousel('pillarsTrack', 'pillarsDots', 'pillarsLeft', 'pillarsRight', 5000);
  init3DCarrousel('varTrack', 'varDots', 'varLeft', 'varRight', 3500);
});
