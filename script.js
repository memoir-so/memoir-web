  // ── Particle canvas ──
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function spawnParticle() {
    return {
      x: randomBetween(W * 0.1, W * 0.9),
      y: randomBetween(H * 0.15, H * 0.75),
      r: randomBetween(1.5, 4),
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.6, -0.15),
      alpha: randomBetween(0.04, 0.16),
      life: 0,
      maxLife: randomBetween(180, 360),
    };
  }

  for (let i = 0; i < 45; i++) {
    const p = spawnParticle();
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      const progress = p.life / p.maxLife;
      const fade = progress < 0.15 ? progress / 0.15 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 70, 229, ${p.alpha * fade})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life >= p.maxLife) particles[i] = spawnParticle();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));

  // ── Waitlist ──
  function handleWaitlist() {
    const email = document.getElementById('email-input').value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      document.getElementById('email-input').style.borderColor = '#ef4444';
      return;
    }
    document.getElementById('email-input').style.borderColor = '';
    document.querySelector('.waitlist-form').style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
    fetch('https://formspree.io/f/mjgjrglw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  }

  document.getElementById('email-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleWaitlist();
  });

  // ── Sidebar interactive ──
  document.querySelectorAll('.profile-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.profile-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });