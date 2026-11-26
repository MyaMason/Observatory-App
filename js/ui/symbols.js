// Original line-art celestial symbols, drawn as SVG (100 × 100 viewBox).
// They use currentColor so each realm's accent colour flows through.

const r2 = (n) => Math.round(n * 100) / 100;

function rays(n, r1, r2_, every = 1, cx = 50, cy = 50) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const outer = i % every === 0 ? r2_ : r1 + (r2_ - r1) * 0.55;
    d += `M${r2(cx + Math.cos(a) * r1)} ${r2(cy + Math.sin(a) * r1)}L${r2(cx + Math.cos(a) * outer)} ${r2(cy + Math.sin(a) * outer)}`;
  }
  return d;
}

function spiralArm(rot) {
  const pts = [];
  for (let t = 0; t <= 3.6; t += 0.12) {
    const r = 2 * Math.exp(0.85 * t);
    const a = t + rot;
    pts.push(`${r2(50 + Math.cos(a) * r)} ${r2(50 + Math.sin(a) * r)}`);
  }
  return 'M' + pts.join('L');
}

function starPolygon(n, step, r, cx = 50, cy = 50, rot = -Math.PI / 2) {
  const pts = [];
  let i = 0;
  for (let k = 0; k <= n; k++) {
    const a = rot + (i / n) * Math.PI * 2;
    pts.push(`${r2(cx + Math.cos(a) * r)} ${r2(cy + Math.sin(a) * r)}`);
    i = (i + step) % n;
  }
  return 'M' + pts.join('L') + 'Z';
}

const BODIES = {
  sun: `
    <circle cx="50" cy="50" r="41" stroke-width="0.6" opacity=".55"/>
    <circle cx="50" cy="50" r="44.5" stroke-width="0.4" opacity=".35" stroke-dasharray="1 3"/>
    <path d="${rays(24, 20, 36, 2)}" stroke-width="1.1" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="14" stroke-width="1.4"/>
    <circle cx="50" cy="50" r="9" class="fill" stroke="none" opacity=".85"/>`,
  orbits: `
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke-width="1"/>
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke-width="1" transform="rotate(60 50 50)"/>
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke-width="1" transform="rotate(120 50 50)"/>
    <circle cx="50" cy="50" r="5" class="fill" stroke="none"/>
    <circle cx="90" cy="50" r="2.6" class="fill" stroke="none"/>
    <circle cx="30" cy="15.36" r="2.2" class="fill" stroke="none"/>
    <circle cx="30" cy="84.64" r="2.2" class="fill" stroke="none"/>`,
  eye: `
    <path d="${rays(18, 30, 42, 2).replace(/M/g, 'M')}" stroke-width=".8" opacity=".6" stroke-linecap="round"/>
    <path d="M14 50 Q50 20 86 50 Q50 80 14 50Z" stroke-width="1.4" class="fill-bg"/>
    <circle cx="50" cy="50" r="14" stroke-width="1.2"/>
    <circle cx="50" cy="50" r="6.5" class="fill" stroke="none"/>
    <circle cx="54" cy="46" r="2" fill="#fff" stroke="none" opacity=".8"/>`,
  prism: `
    <path d="M4 56 L40 50" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M50 22 L72 66 L28 66Z" stroke-width="1.4" class="fill-bg"/>
    <path d="M60 46 L96 32 M61 49 L96 42 M62 52 L96 52 M63 55 L96 62 M64 58 L96 72" stroke-width="1.1" stroke-linecap="round" class="spectrum"/>
    <circle cx="50" cy="16" r="1.4" class="fill" stroke="none"/>`,
  scales: `
    <path d="M50 18 L50 82 M36 84 L64 84 M18 32 L82 32" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M18 32 L8 58 M18 32 L28 58 M82 32 L72 58 M82 32 L92 58" stroke-width=".8"/>
    <path d="M6 58 Q18 70 30 58Z M70 58 Q82 70 94 58Z" stroke-width="1.2" class="fill-bg"/>
    <path d="${starPolygon(5, 2, 6, 50, 11)}" class="fill" stroke="none"/>`,
  spiral: `
    <path d="${spiralArm(0)}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="${spiralArm(Math.PI)}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="${spiralArm(Math.PI / 2)}" stroke-width=".6" opacity=".5" stroke-linecap="round"/>
    <path d="${spiralArm((3 * Math.PI) / 2)}" stroke-width=".6" opacity=".5" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="4" class="fill" stroke="none"/>`,
  eclipse: `
    <path d="M26 92 L26 46 A24 24 0 0 1 74 46 L74 92" stroke-width=".8" opacity=".55"/>
    <path d="${rays(36, 24, 34, 3, 50, 46)}" stroke-width=".7" opacity=".7" stroke-linecap="round"/>
    <circle cx="50" cy="46" r="19" stroke-width="2.6" class="corona"/>
    <circle cx="50" cy="46" r="17" class="void" stroke="none"/>`,
  emblem: `
    <circle cx="50" cy="50" r="46" stroke-width=".8" opacity=".6"/>
    <circle cx="50" cy="50" r="40" stroke-width=".5" opacity=".45" stroke-dasharray="1 2.5"/>
    <path d="${starPolygon(7, 3, 38)}" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="${starPolygon(7, 2, 38)}" stroke-width=".5" opacity=".5" stroke-linejoin="round"/>
    <circle cx="50" cy="50" r="7" class="fill" stroke="none"/>`,
};

export function symbol(name, { size = 48, cls = '', label = null } = {}) {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="sym sym-${name} ${cls}" viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" stroke="currentColor" ${a11y}>${BODIES[name]}</svg>`;
}

export { starPolygon };
