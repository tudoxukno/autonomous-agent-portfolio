/*
  ambient.js
  ----------
  A slow particle system that breathes beneath the site.
  Nearly invisible. The viewer should never consciously notice
  it moving — only sense that the page is not dead.
*/

(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;opacity:0.03;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles
  const COUNT = 10;
  let globalDrift = 0;
  const particles = [];

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      angle: -0.3 + Math.random() * 0.6,
      speed: 0.1 + Math.random() * 0.25,
      width: 0.5 + Math.random() * 1.2,
      alpha: 0.15 + Math.random() * 0.3,
      life: 0,
      maxLife: 400 + Math.random() * 600,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const p = makeParticle();
    p.life = Math.random() * p.maxLife; // stagger initial ages
    particles.push(p);
  }

  // Scroll response
  window.addEventListener('scroll', function () {
    globalDrift += 0.0002;
  }, { passive: true });

  // Render at ~10fps
  let last = 0;
  function render(now) {
    requestAnimationFrame(render);
    if (now - last < 100) return;
    last = now;

    // Slow fade — trails linger
    ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angle = p.angle + globalDrift;
      const prevX = p.x;
      const prevY = p.y;

      p.x += Math.cos(angle) * p.speed;
      p.y += Math.sin(angle) * p.speed;
      p.life++;

      // Fade in and out over lifespan
      const lifeFrac = p.life / p.maxLife;
      const fade = lifeFrac < 0.1 ? lifeFrac / 0.1
        : lifeFrac > 0.85 ? (1 - lifeFrac) / 0.15
        : 1;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(255,255,255,${p.alpha * fade})`;
      ctx.lineWidth = p.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Reset if dead or offscreen
      if (p.life >= p.maxLife || p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) {
        particles[i] = makeParticle();
      }
    }

    // Decay global drift slowly
    globalDrift *= 0.995;
  }

  requestAnimationFrame(render);
})();
