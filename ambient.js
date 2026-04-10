/*
  ambient.js
  ----------
  A reactive field that lives beneath the site.
  Responds to cursor position — the visitor's presence
  shapes the environment. The site knows you're here.

  Also handles: custom cursor, scroll-reveal observer,
  mini preview canvases for work list items.
*/

(function () {

  // === REDUCED MOTION CHECK ===
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // === CUSTOM CURSOR ===
  if (!prefersReduced && !isTouch) {
    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    document.body.appendChild(cursor);

    let cursorX = -100, cursorY = -100;
    let targetX = -100, targetY = -100;
    cursor.style.opacity = '0';

    document.addEventListener('mousemove', e => {
      targetX = e.clientX - 4;
      targetY = e.clientY - 4;
    });

    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });

    // Hover state on interactive elements
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button')) cursor.classList.add('hovering');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button')) cursor.classList.remove('hovering');
    });

    function updateCursor() {
      cursorX += (targetX - cursorX) * 0.15;
      cursorY += (targetY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }

  // === REACTIVE AMBIENT CANVAS ===
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse tracking for reactivity
  let mouseX = W / 2, mouseY = H / 2;
  let smoothMouseX = W / 2, smoothMouseY = H / 2;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Particles — they drift, but are attracted to the cursor
  const COUNT = prefersReduced ? 0 : 30;
  const particles = [];

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 1 + Math.random() * 2,
      baseAlpha: 0.04 + Math.random() * 0.06,
      life: Math.random() * 600,
      maxLife: 400 + Math.random() * 400,
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  // Connection distance
  const CONNECT_DIST = 150;

  let lastFrame = 0;
  function render(now) {
    requestAnimationFrame(render);

    // Throttle to ~24fps
    if (now - lastFrame < 42) return;
    lastFrame = now;

    // Smooth mouse
    smoothMouseX += (mouseX - smoothMouseX) * 0.05;
    smoothMouseY += (mouseY - smoothMouseY) * 0.05;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Cursor glow — a soft radial gradient around the mouse
    if (!isTouch) {
      const glow = ctx.createRadialGradient(
        smoothMouseX, smoothMouseY, 0,
        smoothMouseX, smoothMouseY, 250
      );
      glow.addColorStop(0, 'rgba(138, 191, 184, 0.025)');
      glow.addColorStop(1, 'rgba(138, 191, 184, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
    }

    // Update particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Gentle attraction toward cursor
      const dx = smoothMouseX - p.x;
      const dy = smoothMouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 10) {
        const force = Math.min(0.02, 30 / (dist * dist));
        p.vx += dx * force * 0.01;
        p.vy += dy * force * 0.01;
      }

      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      p.life++;
      if (p.life > p.maxLife) {
        particles[i] = makeParticle();
        continue;
      }

      // Proximity to cursor increases alpha
      const cursorDist = Math.sqrt(
        (p.x - smoothMouseX) ** 2 + (p.y - smoothMouseY) ** 2
      );
      const cursorInfluence = Math.max(0, 1 - cursorDist / 300);
      const alpha = p.baseAlpha + cursorInfluence * 0.12;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 200, 190, ${alpha})`;
      ctx.fill();
    }

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.04;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(138, 191, 184, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  if (!prefersReduced) requestAnimationFrame(render);

  // === SCROLL REVEAL (IntersectionObserver) ===
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    reveals.forEach(el => el.classList.add('visible'));
  }

  // === FEATURED WORK LIVE PREVIEW ===
  const featuredCanvas = document.querySelector('.featured-canvas');
  if (featuredCanvas && !prefersReduced) {
    const fc = featuredCanvas.getContext('2d');
    const nodes = [];
    const fW = () => featuredCanvas.width;
    const fH = () => featuredCanvas.height;

    function resizeFeatured() {
      const rect = featuredCanvas.parentElement.getBoundingClientRect();
      featuredCanvas.width = rect.width;
      featuredCanvas.height = rect.height;
    }
    resizeFeatured();
    window.addEventListener('resize', resizeFeatured);

    // Seed nodes
    for (let i = 0; i < 25; i++) {
      nodes.push({
        x: Math.random() * fW(),
        y: Math.random() * fH(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 2 + Math.random() * 4,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function renderFeatured() {
      requestAnimationFrame(renderFeatured);
      fc.clearRect(0, 0, fW(), fH());

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;

        if (n.x < 0 || n.x > fW()) n.vx *= -1;
        if (n.y < 0 || n.y > fH()) n.vy *= -1;

        const r = n.r * (1 + 0.2 * Math.sin(n.pulse));
        fc.beginPath();
        fc.arc(n.x, n.y, r, 0, Math.PI * 2);
        fc.fillStyle = 'rgba(255,255,255,0.15)';
        fc.fill();
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            fc.beginPath();
            fc.moveTo(nodes[i].x, nodes[i].y);
            fc.lineTo(nodes[j].x, nodes[j].y);
            fc.strokeStyle = `rgba(255,255,255,${(1 - d / 100) * 0.08})`;
            fc.lineWidth = 0.5;
            fc.stroke();
          }
        }
      }
    }
    renderFeatured();
  }

  // === WORK LIST MINI PREVIEWS ===
  document.querySelectorAll('.work-preview').forEach((canvas, idx) => {
    if (prefersReduced) return;
    const c = canvas.getContext('2d');
    const pw = 120, ph = 60;
    canvas.width = pw;
    canvas.height = ph;

    // Each preview has a different character
    const configs = [
      // 001: gestural strokes
      () => {
        c.clearRect(0, 0, pw, ph);
        for (let i = 0; i < 8; i++) {
          c.beginPath();
          const x = Math.random() * pw;
          const y = Math.random() * ph;
          const len = 20 + Math.random() * 40;
          const angle = Math.random() * Math.PI;
          c.moveTo(x, y);
          c.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
          c.strokeStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.2})`;
          c.lineWidth = 0.5 + Math.random() * 2;
          c.lineCap = 'round';
          c.stroke();
        }
      },
      // 002: layered rectangles (buff)
      () => {
        c.clearRect(0, 0, pw, ph);
        for (let i = 0; i < 5; i++) {
          c.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.05})`;
          c.fillRect(Math.random() * pw * 0.5, 0, pw * 0.4, ph);
        }
        for (let i = 0; i < 4; i++) {
          c.beginPath();
          const x = Math.random() * pw;
          const y = Math.random() * ph;
          c.moveTo(x, y);
          c.lineTo(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 20);
          c.strokeStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.15})`;
          c.lineWidth = 1 + Math.random() * 2;
          c.stroke();
        }
      },
      // 003: connected nodes (closing room)
      () => {
        c.clearRect(0, 0, pw, ph);
        const pts = [];
        for (let i = 0; i < 8; i++) pts.push({ x: Math.random() * pw, y: Math.random() * ph });
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < 50) {
              c.beginPath();
              c.moveTo(pts[i].x, pts[i].y);
              c.lineTo(pts[j].x, pts[j].y);
              c.strokeStyle = `rgba(255,255,255,0.08)`;
              c.lineWidth = 0.5;
              c.stroke();
            }
          }
          c.beginPath();
          c.arc(pts[i].x, pts[i].y, 2, 0, Math.PI * 2);
          c.fillStyle = 'rgba(255,255,255,0.2)';
          c.fill();
        }
      },
    ];

    if (configs[idx]) configs[idx]();
  });

})();
