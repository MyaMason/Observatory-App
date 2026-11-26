// A single lightweight canvas of slowly drifting, twinkling stars.
// Runs at ~30fps, pauses when the app is hidden, and draws one still frame
// when reduced motion is preferred.

let canvas, ctx, stars = [], raf = null, last = 0, still = false, w = 0, h = 0, dpr = 1;

function seed() {
  const count = Math.min(170, Math.round((w * h) / 4200));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() < 0.08 ? 1.3 + Math.random() * 0.7 : 0.35 + Math.random() * 0.75,
    tw: Math.random() * Math.PI * 2,
    sp: 0.4 + Math.random() * 1.2,
    dx: (Math.random() - 0.5) * 0.012,
    dy: 0.006 + Math.random() * 0.01,
    hue: Math.random() < 0.18 ? 'gold' : Math.random() < 0.3 ? 'lav' : 'ivory',
  }));
}

const COLORS = { gold: '226,196,132', lav: '196,182,234', ivory: '246,240,226' };

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  seed();
  draw(performance.now());
}

function draw(t) {
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    if (!still) {
      s.x += s.dx;
      s.y += s.dy;
      if (s.y > h + 2) s.y = -2;
      if (s.x < -2) s.x = w + 2;
      if (s.x > w + 2) s.x = -2;
    }
    const a = still ? 0.65 : 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(s.tw + (t / 1000) * s.sp));
    ctx.beginPath();
    ctx.fillStyle = `rgba(${COLORS[s.hue]},${a.toFixed(3)})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    if (s.r > 1.2) {
      ctx.fillStyle = `rgba(${COLORS[s.hue]},${(a * 0.12).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function loop(t) {
  raf = requestAnimationFrame(loop);
  if (t - last < 33) return;
  last = t;
  draw(t);
}

export function startStarfield(el) {
  canvas = el;
  ctx = canvas.getContext('2d');
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!still) start();
  });
  resize();
}

function start() {
  if (!raf) raf = requestAnimationFrame(loop);
}
function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
}

export function setStill(isStill) {
  still = isStill;
  if (still) {
    stop();
    draw(0);
  } else start();
}
