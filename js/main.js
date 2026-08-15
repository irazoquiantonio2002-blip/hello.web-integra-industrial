/* ═══════════════════════════════════════════════════════════════
   INTEGRA INDUSTRIAL — Interacciones y animaciones
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Datos de contacto — única fuente de verdad */
  const WA_NUMBER = '522223380802';   // +52 222 338 0802

  /* ───────────────────────────────────────────────
     1. PRELOADER — carga con cortina y logo
     ─────────────────────────────────────────────── */
  const loader   = $('#loader');
  const barFill  = $('.loader-bar-fill');
  const MIN_MS   = 2600;              // transición pausada, no abrupta
  const started  = Date.now();
  let progress   = 0;

  document.body.classList.add('is-loading');

  const tick = setInterval(() => {
    progress = Math.min(progress + Math.random() * 11 + 4, 96);
    if (barFill) barFill.style.width = progress + '%';
  }, 150);

  function endLoader() {
    clearInterval(tick);
    if (barFill) barFill.style.width = '100%';
    const wait = Math.max(0, MIN_MS - (Date.now() - started));

    setTimeout(() => {
      if (loader) loader.classList.add('done');
      document.body.classList.remove('is-loading');
      startHero();
      setTimeout(() => loader && loader.classList.add('gone'), 1400);
    }, wait + 260);
  }

  window.addEventListener('load', endLoader);
  setTimeout(endLoader, 7000);        // red de seguridad

  /* ───────────────────────────────────────────────
     2. HERO — entrada del título, subtítulo y CTAs
     ─────────────────────────────────────────────── */
  function startHero() {
    ['#hero-heading', '#hero-sub', '#hero-ctas', '#hero-trust', '#hero-badge']
      .forEach(sel => { const el = $(sel); if (el) el.classList.add('in'); });
    typeLoop();
  }

  /* Máquina de escribir con las 4 líneas de servicio reales */
  const TYPED = [
    'Optimización de Procesos',
    'Manufactura',
    'Cadena de Suministro',
    'Transformación Tecnológica'
  ];
  function typeLoop() {
    const out = $('#typed-out');
    if (!out) return;
    if (reduced) { out.textContent = TYPED.join(' · '); return; }

    let i = 0, j = 0, deleting = false;
    (function step() {
      const word = TYPED[i];
      out.textContent = word.slice(0, j);
      if (!deleting && j < word.length)      { j++;  setTimeout(step, 62); }
      else if (!deleting && j === word.length){ deleting = true; setTimeout(step, 1750); }
      else if (deleting && j > 0)            { j--;  setTimeout(step, 26); }
      else { deleting = false; i = (i + 1) % TYPED.length; setTimeout(step, 340); }
    })();
  }

  /* ───────────────────────────────────────────────
     3. NAVBAR + progreso de lectura
     ─────────────────────────────────────────────── */
  const navbar   = $('#navbar');
  const progBar  = $('#read-progress');

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (progBar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menú móvil */
  const burger = $('#hamburger');
  const mobMenu = $('#mob-menu');
  if (burger && mobMenu) {
    const toggle = (force) => {
      const open = force !== undefined ? force : !mobMenu.classList.contains('open');
      mobMenu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    burger.addEventListener('click', () => toggle());
    $$('a', mobMenu).forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* Enlace activo según la sección visible */
  const navLinks = $$('.nav-links a');
  const targets  = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if (targets.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(t => io.observe(t));
  }

  /* ───────────────────────────────────────────────
     4. REVEAL al hacer scroll
     ─────────────────────────────────────────────── */
  const revealIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => revealIO.observe(el));

  /* ───────────────────────────────────────────────
     5. CONTADORES animados
     ─────────────────────────────────────────────── */
  const countIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      const dur    = 1900;
      const t0     = performance.now();

      (function frame(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);        // easeOutQuart
        el.textContent = Math.round(target * eased).toLocaleString('es-MX') + suffix;
        if (p < 1) requestAnimationFrame(frame);
      })(t0);

      obs.unobserve(el);
    });
  }, { threshold: 0.45 });
  $$('.stat-num').forEach(el => countIO.observe(el));

  /* ───────────────────────────────────────────────
     6. MARQUEE
     ─────────────────────────────────────────────── */
  const marquee = $('#marquee');
  if (marquee) {
    const items = [
      'Optimización de Procesos', 'Manufactura', 'Cadena de Suministro',
      'Certificaciones ISO 9001', 'Capacitación DC-3 · STPS', 'Protección Civil',
      'Gestión Ambiental', 'Sistema SASISOPA', 'Industria 4.0',
      'Mantenimiento Industrial', 'Seguridad Industrial', 'Mejora Continua'
    ];
    const build = () => items.map(t => `<span class="marq-item">${t}</span>`).join('');
    marquee.innerHTML = build() + build();   // duplicado para bucle infinito
  }

  /* ───────────────────────────────────────────────
     7. SPOTLIGHT en tarjetas
     ─────────────────────────────────────────────── */
  $$('.f-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  /* ───────────────────────────────────────────────
     8. TÍTULOS interactivos (letra por letra)
     ─────────────────────────────────────────────── */
  if (!reduced) {
    $$('.section-title').forEach(title => {
      $$('.gold', title).forEach(span => {
        // Se envuelve palabra por palabra: así el texto nunca se parte a mitad
        span.innerHTML = span.textContent.split(/(\s+)/).map(part => {
          if (!part.trim()) return part;
          const chars = part.split('').map(c => `<span class="ch">${c}</span>`).join('');
          return `<span class="wd">${chars}</span>`;
        }).join('');
      });
    });
  }

  /* ───────────────────────────────────────────────
     9. PARTÍCULAS (hero + secciones)
     ─────────────────────────────────────────────── */
  function particles(canvas, opts) {
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    const cfg = Object.assign({ count: 46, maxR: 2.4, speed: 0.28, link: 128, alpha: 0.5 }, opts);
    let w = 0, h = 0, dots = [], raf = null, visible = true;

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.round(cfg.count * Math.min(1, w / 1200 + 0.35));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: (Math.random() - 0.5) * cfg.speed,
        r: Math.random() * cfg.maxR + 0.5,
        a: Math.random() * 0.5 + 0.25
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194,167,107,${d.a * cfg.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const o = dots[j], dx = d.x - o.x, dy = d.y - o.y;
          const dist = Math.hypot(dx, dy);
          if (dist < cfg.link) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y); ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = `rgba(194,167,107,${(1 - dist / cfg.link) * 0.13 * cfg.alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); if (visible) draw(); });

    /* Solo anima cuando está en pantalla (rendimiento en móvil) */
    new IntersectionObserver(es => {
      es.forEach(e => {
        visible = e.isIntersecting;
        if (visible) { cancelAnimationFrame(raf); draw(); }
        else cancelAnimationFrame(raf);
      });
    }, { threshold: 0 }).observe(canvas);
  }

  particles($('#hero-canvas'), { count: 62, link: 140, alpha: 0.72 });
  $$('.fx-particles').forEach(c => particles(c, { count: 34, link: 118, alpha: 0.45, speed: 0.2 }));

  /* ───────────────────────────────────────────────
     10. FORMULARIO → WhatsApp (nunca correo)
     ─────────────────────────────────────────────── */
  const form = $('#wa-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nombre   = $('#f-name').value.trim();
      const empresa  = $('#f-company') ? $('#f-company').value.trim() : '';
      const interes  = $('#f-interest').value;
      const mensaje  = $('#f-msg').value.trim();

      if (!nombre || !mensaje) {
        [$('#f-name'), $('#f-msg')].forEach(i => {
          if (!i.value.trim()) { i.style.borderColor = '#b4483c'; i.focus(); }
        });
        return;
      }

      const texto =
        `Hola Integra Industrial, soy ${nombre}` +
        (empresa ? ` de ${empresa}` : '') + '.\n' +
        `Me interesa: ${interes}.\n` +
        `Detalle: ${mensaje}\n\n` +
        `Quisiera agendar una visita de diagnóstico.`;

      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    });

    /* Restablece el borde al corregir */
    $$('.form-control', form).forEach(i =>
      i.addEventListener('input', () => { i.style.borderColor = ''; })
    );
  }

  /* ───────────────────────────────────────────────
     11. Año en el pie de página
     ─────────────────────────────────────────────── */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

})();
