/* BOTEZINI — Scroll Narrative v3.0
   Modelo: animações atadas à posição de scroll
   Cards: intensity = |sin(π·progress)| (onda senoidal)
   Texto: ramp linear 0→1, fica fixo após visível        */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* Posição absoluta do topo do elemento na página */
  function pageTop(el) {
    return el.getBoundingClientRect().top + window.scrollY;
  }

  function inCarousel(el) {
    return !!(el.closest(
      '.pillars-track,.pillars-container,' +
      '.var-carousel-track,.var-carousel-wrap,.ticker-wrap'
    ));
  }

  /* ═══ 01. HERO ═══════════════════════════════ */
  function initHero() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    if (reduced) { hero.classList.add('hero--loaded'); return; }
    setTimeout(() => hero.classList.add('hero--loaded'), 200);
    const bg = hero.querySelector('.hero-bg');
    if (bg && window.innerWidth > 900) {
      window.addEventListener('scroll',
        () => { bg.style.transform = `translateY(${window.scrollY * 0.3}px)`; },
        { passive: true }
      );
    }
  }

  /* ═══ 02. TAG sec-label / sec-title / etc. ═══ */
  function tag() {
    if (reduced) return;
    [
      ['.sec-label',         'fade-left'],
      ['.sec-title',         'fade-up'],
      ['.sec-rule',          'wipe-h'],
      ['.body-lg',           'fade-up'],
      ['.sec-divider-title', 'fade-up'],
      ['.sec-divider-sub',   'fade-up'],
    ].forEach(([sel, anim]) => {
      document.querySelectorAll(`${sel}:not([data-anim])`).forEach(el => {
        if (el.closest('#hero') || inCarousel(el)) return;
        el.setAttribute('data-anim', anim);
      });
    });
  }

  /* ═══ 03. CONTENT ITEMS ══════════════════════
     Fade/slide/wipe amarrado ao scroll.
     RAMP_PX = janela de scroll para completar entrada.
     Quando progress ≥ 1: commit permanente.         */
  const RAMP = 260;
  let contentItems = [];

  function buildContentItems() {
    const seen = new Set();
    const sels = [
      '[data-anim]',
      '.processo-step', '.kit-card', '.plan-card',
      '.form-group',
      '.calc-table tbody tr', '.fabric-table tbody tr',
      '.tradicao-img-frame', '.tradicao-bullet',
    ].join(',');

    document.querySelectorAll(sels).forEach(el => {
      if (seen.has(el) || el.closest('#hero') || inCarousel(el)) return;

      /* Stagger container → filhos entram individualmente */
      if (el.dataset.anim === 'stagger') {
        Array.from(el.children).forEach((child, i) => {
          if (seen.has(child)) return;
          seen.add(child);
          contentItems.push({
            el: child,
            anim: 'fade-up',
            triggerAt: pageTop(child) - window.innerHeight * 0.78 + i * 70,
            done: false,
          });
        });
        seen.add(el);
        return;
      }

      seen.add(el);
      const anim = el.dataset.anim || guessAnim(el);
      
      // A foto da tradição é separada via block `10. TRADIÇÃO` agora
      if (el.classList.contains('tradicao-img-frame')) return;

      let elRamp = 260; // Default RAMP value

      contentItems.push({
        el, anim,
        triggerAt: pageTop(el) - window.innerHeight * 0.78,
        ramp: elRamp,
        done: false,
      });
    });

    contentItems.sort((a, b) => a.triggerAt - b.triggerAt);
  }

  function guessAnim(el) {
    if (el.classList.contains('sec-rule') ||
        el.classList.contains('tradicao-img-frame')) return 'wipe-h';
    if (el.classList.contains('sec-label') ||
        el.classList.contains('tradicao-bullet') ||
        el.classList.contains('processo-step')) return 'fade-left';
    return 'fade-up';
  }

  function applyContent(item, p) {
    const { el, anim } = item;
    switch (anim) {
      case 'fade-up':
        el.style.opacity   = p;
        el.style.transform = `translateY(${(1 - p) * 24}px)`;
        break;
      case 'fade-left':
        el.style.opacity   = p;
        el.style.transform = `translateX(${(1 - p) * -16}px)`;
        break;
      case 'wipe-h': {
        const pct = ((1 - p) * 100).toFixed(1);
        const round = el.classList.contains('tradicao-img-frame') ? ' round 50%' : '';
        el.style.clipPath = `inset(0 ${pct}% 0 0${round})`;
        break;
      }
      default:
        el.style.opacity = p;
    }
  }

  function commitContent(item) {
    item.el.style.opacity   = '';
    item.el.style.transform = '';
    item.el.style.clipPath  = '';
    item.el.classList.add('bz--visible');
    item.done = true;
    /* Plan card featured: pulse após entrada */
    if (item.el.classList.contains('featured')) {
      setTimeout(() => {
        item.el.classList.add('bz--pulse');
        setTimeout(() => item.el.classList.remove('bz--pulse'), 2600);
      }, 250);
    }
  }

  /* ═══ 04. CARD ITEMS (OVERLAP E PLATEAU) ═════
     A onda é encurtada e sobreposta. Intensidade
     fixada como plateau. Ambi-direcional infinito. */
  let cardItems = [];

  function buildCardItems() {
    /* Incluindo as grids de features, products e lines */
    const grids = document.querySelectorAll('.products-grid, .features-grid, .lines-grid');
    grids.forEach(grid => {
      let cardClass = '.product-card';
      let type = 'product';
      if (grid.classList.contains('features-grid')) { cardClass = '.feature-card'; type = 'feature'; }
      if (grid.classList.contains('lines-grid'))    { cardClass = '.line-card'; type = 'line'; }
      
      const cards = Array.from(grid.querySelectorAll(cardClass));
      if (!cards.length) return;
      
      const vh = window.innerHeight;
      const gridTop = pageTop(grid);
      const gridHeight = grid.offsetHeight;
      
      /* O hover genérico (products/features) agora aciona os primeiros 'um pouquinho antes' (de vh*0.6 para vh*0.68) */
      let startScroll = (gridTop - vh * 0.68) + (gridHeight * 0.06);
      let endScroll = (gridTop + gridHeight - vh * 0.6) - (gridHeight * 0.06);

      if (type === 'line') {
        /* "id linhas deve começar bem antes" */
        startScroll = gridTop - vh * 0.82;
      }
      
      const totalRange = endScroll - startScroll;
      let spacing = totalRange / cards.length;
      
      if (type === 'line') {
        /* "acontecer mais rápida entre os cards" -> esmaga o spacing em 50% */
        spacing = totalRange / (cards.length * 1.5);
      }
      
      const duration = spacing * 1.6; /* 60% de overlap base */
      
      cards.forEach((card, i) => {
        const item = { card, start: startScroll + i * spacing, duration, type };
        
        /* CACHING DE DOM: Impede milhares de pesquisas (.querySelector) em tempo real durante a rolagem */
        if (type === 'line') {
          item.bg = card.querySelector('.line-card-bg');
          item.arrow = card.querySelector('.line-card-arrow');
          item.bar = card.querySelector('.line-card-bar');
        } else if (type === 'product') {
          item.photo = card.querySelector('.product-photo');
          item.svg = card.querySelector('.product-illus svg');
        }
        
        cardItems.push(item);
      });
    });
  }

  function applyCard(item, intensity) {
    // PROTEÇÃO DE HOVER: Se o usuário estiver com o mouse em cima, o CSS governa (hover priority) e o JS não injeta inline styles briguentos
    if (item.type === 'product' && item.card.matches(':hover')) return;

    const i = intensity;
    const { card, type, bg, arrow, bar, photo, svg } = item;
    
    if (type === 'feature') {
      card.style.transform   = `translateY(${(-8 * i).toFixed(2)}px)`;
      card.style.borderColor = `rgba(201,168,76,${(0.1 + 0.40 * i).toFixed(2)})`;
      card.style.boxShadow   = `0 ${Math.round(4 + 16 * i)}px ${Math.round(10 + 24 * i)}px rgba(0,0,0,${(0.10 + 0.15 * i).toFixed(2)})`;
    } else if (type === 'line') {
      card.style.transform = `translateY(${(-8 * i).toFixed(2)}px)`;
      if (bg) {
        bg.style.transform = `scale(${(1 + 0.05 * i).toFixed(2)})`;
        bg.style.filter = `brightness(${(1 + 0.2 * i).toFixed(2)})`;
      }
      if (arrow) arrow.style.color = i > 0.5 ? 'var(--gold)' : '';
      if (bar) bar.style.opacity = (i * 1.5).toFixed(2);
    } else {
      card.style.transform   = `translateY(${(-5 * i).toFixed(2)}px)`;
      card.style.borderColor = `rgba(201,168,76,${(0.05 + 0.30 * i).toFixed(2)})`;
      card.style.boxShadow   = `0 ${Math.round(4 + 28 * i)}px ${Math.round(10 + 42 * i)}px rgba(0,0,0,${(0.15 + 0.30 * i).toFixed(2)})`;
      if (photo) photo.style.opacity = (i * i).toFixed(2);
      if (svg)   svg.style.opacity   = (1 - i * 0.85).toFixed(2);
    }
  }

  function clearCard(item) {
    const { card, type, bg, arrow, bar, photo, svg } = item;
    card.style.transform = card.style.borderColor = card.style.boxShadow = '';
    if (type === 'line') {
      if (bg) { bg.style.transform = ''; bg.style.filter = ''; }
      if (arrow) arrow.style.color = '';
      if (bar) bar.style.opacity = '';
    } else if (type === 'product') {
      if (photo) photo.style.opacity = '';
      if (svg)   svg.style.opacity = '';
      card.classList.add('bz--done');
    }
  }

  /* ═══ 04 B. CARROUSSELS (SCROLL-STEP) ════════ */
  let carousels = [];
  function buildCarousels() {
    ['#pillarsTrack', '#varTrack'].forEach(id => {
      const track = document.querySelector(id);
      if (!track) return;
      const sec = track.closest('.section') || track.closest('section');
      
      const vh = window.innerHeight;
      const sh = sec.offsetHeight;
      const st = pageTop(sec);
      
      let startScroll = st - vh * 0.5; /* começa na altura dos olhos */
      let endScroll = st + sh - vh * 0.5;

      if (id === '#pillarsTrack') {
        // "carrossel 1 deve ativar apenas depois de 33% do inicio" -> +8% = 41%
        startScroll = st + (sh * 0.41) - vh * 0.5;
        // e finaliza proporcional (ex:"2/3 da div")
        endScroll = startScroll + (sh * 0.666);
      } else if (id === '#varTrack') {
        const offset = sh * 0.15; // 15% cada lado = 30% transbordo total
        const shift = sh * 0.16;  // Mover 16% para cima
        startScroll = (st - offset - shift) - vh * 0.5;
        endScroll = (st + sh + offset - shift) - vh * 0.5;
      }

      carousels.push({
        id,
        track,
        start: startScroll,
        end: endScroll,
        lastIdx: -1
      });
    });
  }

  /* ═══ 10. TRADIÇÃO (CUSTOM BOUNDS) ═══════════ */
  let tradicaoAnim = null;
  function buildTradicao() {
    const el = document.querySelector('.tradicao-img-frame');
    const sec = document.getElementById('tradicao');
    if (!el || !sec || el.closest('#hero')) return;
    tradicaoAnim = { el, sec };
  }

  /* ═══ 05. ROI COUNTERS ═══════════════════════ */
  let roiDone = false, roiAt = Infinity;
  function initROI() {
    const s = document.querySelector('.roi-calc-summary');
    if (s) roiAt = pageTop(s) - window.innerHeight * 0.7;
  }
  function fireROI() {
    if (roiDone || reduced) return;
    roiDone = true;
    const roi = document.getElementById('roi');
    if (!roi) return;
    const bv = roi.querySelector('.roi-calc-side.bad .roi-calc-val');
    const gv = roi.querySelector('.roi-calc-side.good .roi-calc-val');
    const ar = roi.querySelector('.roi-calc-arrow');
    const ec = roi.querySelector('.roi-calc-msg');
    function cnt(set, tgt, dur) {
      const t0 = performance.now();
      (function tick(n) {
        const p = Math.min((n - t0) / dur, 1);
        set(Math.round(tgt * (1 - (1 - p) * (1 - p))));
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }
    if (bv) { bv.textContent = 'R$ 0,00'; cnt(v => { bv.textContent = `R$ ${v},00`; }, 340, 1200); }
    if (ar) setTimeout(() => { ar.classList.add('bz--blink'); setTimeout(() => ar.classList.remove('bz--blink'), 900); }, 500);
    if (gv) setTimeout(() => { gv.textContent = 'R$ 0,00'; cnt(v => { gv.textContent = `R$ ${v},00`; }, 130, 1000); }, 600);
    if (ec) setTimeout(() => { ec.classList.add('bz--glow'); setTimeout(() => ec.classList.remove('bz--glow'), 2000); }, 1600);
  }

  /* ═══ 06. TICK (RAF) ══════════════════════════ */
  function tick(scrollY) {
    /* Content */
    contentItems.forEach(item => {
      if (item.done) return;
      const p = clamp((scrollY - item.triggerAt) / (item.ramp || RAMP), 0, 1);
      if (p <= 0) return;
      if (p >= 1) { commitContent(item); return; }
      applyContent(item, p);
    });
    
    /* Cards (Onda bidirecional com sobreposição) */
    cardItems.forEach(item => {
      const p = clamp((scrollY - item.start) / item.duration, 0, 1);
      /* Se estiver exatamente fora da duração da onda, apenas zere */
      if (p <= 0 || p >= 1) {
        if (!item.isClean) { clearCard(item); item.isClean = true; }
        return;
      }
      item.isClean = false;
      if (item.type === 'product') item.card.classList.remove('bz--done');
      
      /* Seno multiplicado para intensificar cedo e formar um plateau no topo (Math.min) */
      const intensity = Math.min(1, Math.sin(p * Math.PI) * 1.5);
      applyCard(item, intensity);
    });
    
    /* Carousels */
    carousels.forEach(c => {
      // Se tivermos no escopo, desligue autoTimer
      if (c.track.goTo && scrollY >= c.start) {
        if (c.track.stopAuto) { c.track.stopAuto(); c.track.stopAuto = null; }
        
        let idx = 0;
        if (c.id === '#pillarsTrack' || c.id === '#varTrack') {
          // Ambos usam lógica proporcional estrita da área designada (como requisitado)
          let progress = (scrollY - c.start) / (c.end - c.start);
          progress = clamp(progress, 0, 0.999);
          idx = Math.floor(progress * c.track.total);
        }

        if (idx !== c.lastIdx) {
          c.track.goTo(idx);
          c.lastIdx = idx;
        }
      }
    });

    /* Tradição (Foto Sweep Custom) */
    if (tradicaoAnim) {
      const { el, sec } = tradicaoAnim;
      const vh = window.innerHeight;
      const sh = sec.offsetHeight;
      const st = pageTop(sec);
      
      // "começar do inicio e terminar em 60%" -> 10% antes = 50%
      const start = st - vh * 0.6;
      const end = st + (sh * 0.50) - vh * 0.6;
      
      let p = clamp((scrollY - start) / (end - start), 0, 1);
      
      if (p <= 0 && el.style.clipPath !== '') {
        el.style.clipPath = '';
      } else if (p > 0) {
        const pct = ((1 - p) * 100).toFixed(1);
        el.style.clipPath = `inset(0 ${pct}% 0 0 round 50%)`;
        el.style.opacity = '1';
      }
    }

    /* ROI */
    if (!roiDone && scrollY >= roiAt) fireROI();
  }

  /* ═══ 07. SCROLL ENGINE ══════════════════════ */
  function initEngine() {
    if (reduced) {
      contentItems.forEach(commitContent);
      cardItems.forEach(item => { clearCard(item.card, item.isFeature); });
      fireROI();
      return;
    }
    let pending = false;
    window.addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; tick(window.scrollY); });
    }, { passive: true });
    tick(window.scrollY); /* revela o que já está na viewport */
  }

  /* ═══ 08. PARCEIROS TICKER ═══════════════════ */
  function initTicker() {
    const track = document.querySelector('.ticker-track');
    const sec   = document.querySelector('.partners-section');
    if (!track || !sec) return;
    if (reduced) { track.classList.add('bz--playing'); return; }
    
    /* Como os 'carrosséis' ganharam scroll parallax, vamos manter o ticker também reagindo de forma híbrida 
       mas apenas pause/play por IO para não ser super destrutivo, ou scroll paralax nele? 
       Usuário pediu: "os carrosseis deve ter uma animação de giro tambem baseado no scroll"
       Vamos adicionar paralax extra no ticker. */
    let parallax = 0;
    let lastY = window.scrollY;
    
    // O usuário requisitou: "o carrossel de empresas que confiam, ele nao deve parar de girar no hover"
    // Eventos mouseenter/mouseleave que causavam a pausa foram removidos.
    
    new IntersectionObserver(([e]) => {
      track.classList.toggle('bz--playing', e.isIntersecting);
      track.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
    }, { threshold: 0.1 }).observe(sec);
    
    window.addEventListener('scroll', () => {
      if (track.classList.contains('bz--playing')) {
        const delta = window.scrollY - lastY;
        parallax -= delta * 0.4; // Adiciona deslocamento
        /* Ticker já possui transform em animação CSS, não dá pra sobreescrever via JS sem quebrar,
           mas podemos usar CSS vars! */
        track.style.setProperty('--scroll-px', `${parallax}px`);
      }
      lastY = window.scrollY;
    }, { passive: true });
  }

  /* ═══ 09. WPP PULSE ══════════════════════════ */
  function initWPP() {
    const wpp = document.querySelector('.wpp-float');
    const sec = document.getElementById('contato');
    if (!wpp || !sec || reduced) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { wpp.classList.add('bz--pulse-loop'); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(sec);
  }

  /* ═══ INIT ═══════════════════════════════════ */
  function init() {
    initHero();
    tag();
    buildContentItems();
    buildCardItems();
    buildCarousels();
    buildTradicao();
    initROI();
    initEngine();
    initTicker();
    initWPP();
  }

  /* Usa 'load' para garantir posições corretas após imagens */
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);

})();
