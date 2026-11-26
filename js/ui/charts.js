// Hand-drawn SVG visualizations: moon phases, the realm constellation, spectrum dials
// and the evolution timeline. No external libraries, so everything works offline.
import { esc } from './dom.js';
import { REALMS } from '../content/realms.js';
import { DIM_BY_ID } from '../content/dimensions.js';
import { STATUS_LABEL } from '../engine/scoring.js';
import { symbol, starPolygon } from './symbols.js';

const r2 = (n) => Math.round(n * 100) / 100;

// Moon phase from new (0) to full (1).
export function moon(fraction, size = 18, label = '') {
  const r = 9, c = 10;
  let lit = '';
  if (fraction >= 0.999) lit = `<circle cx="${c}" cy="${c}" r="${r}" class="moon-lit"/>`;
  else if (fraction > 0.001) {
    const rx = r2(r * Math.abs(1 - 2 * fraction));
    const sweep = fraction > 0.5 ? 1 : 0;
    lit = `<path class="moon-lit" d="M${c} ${c - r} A${r} ${r} 0 0 1 ${c} ${c + r} A${rx} ${r} 0 0 ${sweep} ${c} ${c - r}Z"/>`;
  }
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
  return `<svg class="moon" viewBox="0 0 20 20" width="${size}" height="${size}" ${a11y}><circle cx="${c}" cy="${c}" r="${r}" class="moon-dark"/>${lit}</svg>`;
}

// Seven realms on a seven-pointed star. Nodes glow according to exploration.
export function constellation(progress, { size = 340, interactive = true, idPrefix = 'c' } = {}) {
  const W = 360, cx = 180, cy = 178, R = 120;
  const pts = REALMS.map((r, i) => {
    const a = -Math.PI / 2 + (i / REALMS.length) * Math.PI * 2;
    return { realm: r, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, a, f: progress[r.id]?.fraction ?? 0 };
  });
  // Lines of the {7/3} star; a line is lit by the dimmer of its two endpoints.
  let lines = '';
  for (let i = 0; i < 7; i++) {
    const p = pts[i], q = pts[(i + 3) % 7];
    const lit = Math.min(p.f, q.f);
    lines += `<line x1="${r2(p.x)}" y1="${r2(p.y)}" x2="${r2(q.x)}" y2="${r2(q.y)}" class="c-line" style="--lit:${r2(0.12 + lit * 0.75)}"/>`;
  }
  let ring = '';
  for (let i = 0; i < 7; i++) {
    const p = pts[i], q = pts[(i + 1) % 7];
    const lit = Math.min(p.f, q.f);
    ring += `<line x1="${r2(p.x)}" y1="${r2(p.y)}" x2="${r2(q.x)}" y2="${r2(q.y)}" class="c-ring" style="--lit:${r2(0.08 + lit * 0.5)}"/>`;
  }
  const nodes = pts
    .map((p) => {
      const lx = cx + Math.cos(p.a) * (R + 38);
      const ly = cy + Math.sin(p.a) * (R + 38) + 4;
      const anchor = Math.abs(Math.cos(p.a)) < 0.2 ? 'middle' : Math.cos(p.a) > 0 ? 'start' : 'end';
      const pr = progress[p.realm.id];
      const label = `${p.realm.name}: ${pr?.answered ?? 0} of ${pr?.total ?? 7} questions answered`;
      const inner = `
        <g class="c-node ${p.f > 0 ? 'lit' : 'dormant'}" style="--accent:${p.realm.accent};--f:${r2(p.f)}">
          <circle cx="${r2(p.x)}" cy="${r2(p.y)}" r="${r2(14 + p.f * 10)}" class="c-halo"/>
          <circle cx="${r2(p.x)}" cy="${r2(p.y)}" r="21" class="c-hit"/>
          <g transform="translate(${r2(p.x - 13)} ${r2(p.y - 13)})" class="c-sym">${symbol(p.realm.symbol, { size: 26 }).replace('<svg ', '<svg x="0" y="0" ')}</g>
          <text x="${r2(lx)}" y="${r2(ly)}" text-anchor="${anchor}" class="c-label">${esc(p.realm.short)}</text>
        </g>`;
      return interactive
        ? `<a href="#/realm/${p.realm.id}" aria-label="${esc(label)}">${inner}</a>`
        : `<g role="img" aria-label="${esc(label)}">${inner}</g>`;
    })
    .join('');
  return `<svg class="constellation" viewBox="-46 0 ${W + 92} ${W}" width="100%" style="max-width:${size}px" role="group" aria-label="Constellation of the seven realms">
    <defs><radialGradient id="${idPrefix}-core"><stop offset="0" stop-color="var(--gold)" stop-opacity=".35"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></radialGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="${R + 20}" class="c-orbit"/>
    <circle cx="${cx}" cy="${cy}" r="${R - 52}" class="c-orbit faint"/>
    <circle cx="${cx}" cy="${cy}" r="60" fill="url(#${idPrefix}-core)"/>
    <path d="${starPolygon(7, 2, 26, cx, cy)}" class="c-heart"/>
    ${ring}${lines}${nodes}
  </svg>`;
}

// Map a position (-1..1) to a point on the dial's arc.
function arcPoint(p, cx, cy, R) {
  const t = Math.PI - ((p + 1) / 2) * Math.PI;
  return { x: cx + Math.cos(t) * R, y: cy - Math.sin(t) * R };
}

// A spectrum dial for one dimension. Each status has a distinct appearance:
// insufficient (dim, no marker), uncertain (soft wide glow), competing (two bright stars),
// mixed (two faint stars), middle/leaning/strong (one star), beyond (orbit badge).
export function dial(d, { compact = false } = {}) {
  const dim = DIM_BY_ID[d.id];
  const cx = 150, cy = 108, R = 104;
  const left = arcPoint(-1, cx, cy, R), right = arcPoint(1, cx, cy, R);
  let marks = '';
  let ticks = '';
  for (let i = 0; i <= 10; i++) {
    const p = -1 + i * 0.2;
    const a = arcPoint(p, cx, cy, R - 7), b = arcPoint(p, cx, cy, R + (i % 5 === 0 ? 7 : 3));
    ticks += `<line x1="${r2(a.x)}" y1="${r2(a.y)}" x2="${r2(b.x)}" y2="${r2(b.y)}" class="d-tick"/>`;
  }
  const star = (p, cls) => {
    const pt = arcPoint(p, cx, cy, R);
    return `<g class="d-star ${cls}" transform="translate(${r2(pt.x)} ${r2(pt.y)})"><circle r="11" class="d-star-glow"/><path d="M0 -9 L2.2 -2.2 L9 0 L2.2 2.2 L0 9 L-2.2 2.2 L-9 0 L-2.2 -2.2Z" class="d-star-shape"/></g>`;
  };
  const st = d.status;
  if (st === 'uncertain') {
    const p = d.position ?? 0;
    const pt = arcPoint(p, cx, cy, R);
    marks += `<ellipse cx="${r2(pt.x)}" cy="${r2(pt.y)}" rx="54" ry="26" class="d-fog"/>`;
  } else if (st === 'competing' || st === 'mixed') {
    const total = d.pull.a + d.pull.b;
    const pa = -Math.min(1, (d.pull.a / Math.max(total, 1e-9)) * 1.4 + 0.2);
    const pb = Math.min(1, (d.pull.b / Math.max(total, 1e-9)) * 1.4 + 0.2);
    marks += star(pa, st === 'competing' ? 'bright' : 'faint') + star(pb, st === 'competing' ? 'bright' : 'faint');
  } else if (st !== 'insufficient' && d.position !== null) {
    marks += star(d.position, st === 'strong' ? 'bright' : st === 'middle' ? 'mid' : '');
  }
  const beyondBadge =
    d.beyond > 0
      ? `<g class="d-beyond" transform="translate(${cx} 40)" aria-hidden="true"><ellipse rx="16" ry="6" /><ellipse rx="16" ry="6" transform="rotate(60)"/><ellipse rx="16" ry="6" transform="rotate(120)"/><circle r="2.2" class="fill"/></g>`
      : '';
  const coverageW = 120 * d.coverage;
  const desc = describe(d);
  return `<svg class="dial status-${st} ${compact ? 'compact' : ''}" viewBox="0 0 300 ${compact ? 128 : 150}" width="100%" role="img" aria-label="${esc(dim.name + ': ' + desc)}">
    <path d="M${r2(left.x)} ${r2(left.y)} A${R} ${R} 0 0 1 ${r2(right.x)} ${r2(right.y)}" class="d-arc"/>
    <path d="M${r2(left.x)} ${r2(left.y)} A${R} ${R} 0 0 1 ${r2(right.x)} ${r2(right.y)}" class="d-arc-glow"/>
    ${ticks}${beyondBadge}${marks}
    <text x="${r2(left.x)}" y="${cy + 18}" text-anchor="start" class="d-pole">${esc(dim.a.label)}</text>
    <text x="${r2(right.x)}" y="${cy + 18}" text-anchor="end" class="d-pole">${esc(dim.b.label)}</text>
    ${compact ? '' : `<rect x="90" y="138" width="120" height="3" rx="1.5" class="d-cov-bg"/><rect x="90" y="138" width="${r2(coverageW)}" height="3" rx="1.5" class="d-cov"/>`}
  </svg>`;
}

export function describe(d) {
  const dim = DIM_BY_ID[d.id];
  switch (d.status) {
    case 'insufficient':
      return `${STATUS_LABEL.insufficient} (${d.answered} of ${d.relevantTotal} relevant questions answered)`;
    case 'leaning':
    case 'strong':
      return `${d.status === 'strong' ? 'Clearly toward' : 'Leaning toward'} ${d.position < 0 ? dim.a.label : dim.b.label}`;
    case 'middle':
      return `A middle position between ${dim.a.label} and ${dim.b.label}`;
    default:
      return STATUS_LABEL[d.status];
  }
}

// Evolution: one small chart per dimension, time on the x-axis (proportional to real dates).
export function timeline(snapshots, dimId, { selected = null } = {}) {
  const dim = DIM_BY_ID[dimId];
  const W = 320, H = 128, padL = 12, padR = 12, top = 26, bottom = 28;
  const times = snapshots.map((s) => Date.parse(s.date + 'T12:00:00'));
  const t0 = Math.min(...times), t1 = Math.max(...times);
  const span = Math.max(t1 - t0, 1);
  const x = (t) => padL + ((t - t0) / span) * (W - padL - padR);
  const y = (p) => top + ((1 - p) / 2) * (H - top - bottom);
  let path = '';
  let pen = false;
  const pts = [];
  snapshots.forEach((s, i) => {
    const v = s.dims[dimId];
    if (!v || v.position === null || v.status === 'insufficient') {
      pen = false;
      return;
    }
    const px = r2(x(times[i])), py = r2(y(v.position));
    path += (pen ? 'L' : 'M') + px + ' ' + py;
    pen = true;
    pts.push({ i, px, py, s, v });
  });
  const dots = pts
    .map(
      ({ i, px, py, s, v }) =>
        `<g class="t-pt ${selected === i ? 'sel' : ''}" data-snap="${i}" data-dim="${dimId}" tabindex="0" role="button" aria-label="${esc(
          `${s.date}: ${describe({ ...v, id: dimId, answered: 0, relevantTotal: 0, pull: { a: 0, b: 0 } })}`
        )}"><circle cx="${px}" cy="${py}" r="14" class="t-hit"/><circle cx="${px}" cy="${py}" r="4.5" class="t-dot"/></g>`
    )
    .join('');
  return `<svg class="timeline" viewBox="0 0 ${W} ${H}" width="100%">
    <line x1="${padL}" x2="${W - padR}" y1="${y(0)}" y2="${y(0)}" class="t-mid"/>
    <line x1="${padL}" x2="${W - padR}" y1="${y(1)}" y2="${y(1)}" class="t-edge"/>
    <line x1="${padL}" x2="${W - padR}" y1="${y(-1)}" y2="${y(-1)}" class="t-edge"/>
    <text x="0" y="${y(1) - 10}" class="t-lab">${esc(dim.b.label)}</text>
    <text x="0" y="${y(-1) + 19}" class="t-lab">${esc(dim.a.label)}</text>
    <path d="${path}" class="t-line"/>
    ${dots}
  </svg>`;
}
