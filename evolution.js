// The Evolution of the Soul: history of dated snapshots. Never fabricates data.
import { html, raw, $, $$, formatDate, formatShortDate } from '../ui/dom.js';
import { symbol } from '../ui/symbols.js';
import { timeline, describe } from '../ui/charts.js';
import { DIMENSIONS, DIM_BY_ID } from '../content/dimensions.js';
import { REALM_BY_ID } from '../content/realms.js';
import { state } from '../store.js';
import { snapshotOf, localDateKey, STATUS_LABEL } from '../engine/scoring.js';

let thenIndex = 0;

const asDim = (id, v) => ({ ...v, id, answered: 0, relevantTotal: 0, pull: { a: 0, b: 0 } });

function compareRow(dimId, a, b) {
  const dim = DIM_BY_ID[dimId];
  const informative = (v) => v && v.position !== null && v.status !== 'insufficient';
  let text, delta = 0;
  if (!informative(a) && !informative(b)) {
    if (a?.status === b?.status) return { dimId, delta: -1, html: null };
    text = `${STATUS_LABEL[a?.status ?? 'insufficient']} → ${STATUS_LABEL[b.status]}`;
  } else if (!informative(a)) {
    text = `Came into view: ${describe(asDim(dimId, b))}`;
    delta = 0.5;
  } else if (!informative(b)) {
    text = `${describe(asDim(dimId, a))} → ${STATUS_LABEL[b.status]}`;
    delta = 0.5;
  } else {
    delta = b.position - a.position;
    const moved = Math.abs(delta) >= 0.1;
    const statusChanged = a.status !== b.status;
    text = moved
      ? `Shifted toward ${delta < 0 ? dim.a.label : dim.b.label} (${Math.abs(delta).toFixed(2)} on a −1 to +1 scale)`
      : 'Steady position';
    if (statusChanged) text += ` · ${STATUS_LABEL[a.status]} → ${STATUS_LABEL[b.status]}`;
    delta = Math.abs(delta) + (statusChanged ? 0.05 : 0);
  }
  const x = (p) => 8 + ((p + 1) / 2) * 284;
  const bar = `<svg viewBox="0 0 300 30" width="100%" class="cmp-bar" aria-hidden="true">
    <line x1="8" x2="292" y1="15" y2="15" class="cmp-track"/><line x1="150" x2="150" y1="9" y2="21" class="cmp-mid"/>
    ${informative(a) && informative(b) ? `<line x1="${x(a.position)}" x2="${x(b.position)}" y1="15" y2="15" class="cmp-move"/>` : ''}
    ${informative(a) ? `<circle cx="${x(a.position)}" cy="15" r="6" class="cmp-then"/>` : ''}
    ${informative(b) ? `<circle cx="${x(b.position)}" cy="15" r="6" class="cmp-now"/>` : ''}</svg>`;
  return {
    dimId,
    delta,
    html: html`<li class="cmp-row" style="--accent:${REALM_BY_ID[dim.realm].accent}">
      <span class="cmp-name">${dim.name}</span>
      <span class="cmp-text">${text}</span>
      ${raw(bar)}
      <span class="cmp-poles"><span>${dim.a.label}</span><span>${dim.b.label}</span></span></li>`,
  };
}

export function evolution() {
  const snaps = state.snapshots;
  if (snaps.length < 2) {
    const msg =
      snaps.length === 0
        ? 'Your philosophical evolution will be charted here as your thinking changes over time. The first entry in your history is recorded when you complete any realm. After that, each day on which you revisit and change an answer adds a new dated snapshot.'
        : `Your first snapshot was recorded on ${formatDate(snaps[0].date)}. Your evolution will appear here once your answers change on another day. Return and revisit your answers whenever your views shift.`;
    return {
      title: 'Evolution',
      html: html`
        <section class="page evolution">
          <header class="page-head"><p class="eyebrow">The Evolution of the Soul</p><h1>Evolution</h1></header>
          <div class="empty">${raw(symbol('spiral', { size: 90 }))}<p>${msg}</p>
            <a class="btn btn-primary" href="#/observatory">${snaps.length ? 'Revisit the realms' : 'Explore a realm'}</a></div>
        </section>`,
    };
  }

  const today = localDateKey();
  const now = snapshotOf(state.profile, today);
  const past = snaps.filter((s) => s.date !== today);
  if (thenIndex >= past.length) thenIndex = 0;
  const then = past[thenIndex];
  const rows = DIMENSIONS.map((d) => compareRow(d.id, then?.dims[d.id], now.dims[d.id]))
    .filter((r) => r.html)
    .sort((a, b) => b.delta - a.delta);

  const withData = DIMENSIONS.filter((d) => snaps.some((s) => s.dims[d.id]?.position !== null && s.dims[d.id]?.status !== 'insufficient'));

  return {
    title: 'Evolution',
    html: html`
      <section class="page evolution">
        <header class="page-head">
          <p class="eyebrow">The Evolution of the Soul</p>
          <h1>Evolution</h1>
          <p class="lede">${snaps.length} dated snapshots, from ${formatDate(snaps[0].date)} to ${formatDate(snaps[snaps.length - 1].date)}.</p>
        </header>

        <h2 class="section-title">Then and Now</h2>
        ${past.length
          ? html`<label class="field compact"><span>Compare your current view with</span>
              <select id="then">${past.map((s, i) => html`<option value="${i}" ${raw(i === thenIndex ? 'selected' : '')}>${formatDate(s.date)}</option>`)}</select></label>
              <p class="legend"><span class="lg-then"></span> then <span class="lg-now"></span> now</p>
              <ul class="cmp-list">${rows.map((r) => r.html)}</ul>`
          : html`<p class="muted">All your snapshots are from today; come back after another day of reflection to compare.</p>`}

        <h2 class="section-title">Over Time</h2>
        <p class="muted small">Each line follows one spectrum across your snapshots. Gaps mean there was not enough information on that date. Tap a point for details.</p>
        <ul class="tl-list">${withData.map(
          (d) => html`<li class="tl-item" style="--accent:${REALM_BY_ID[d.realm].accent}">
            <span class="tl-name">${d.name}</span>
            <div class="tl-chart" data-dim="${d.id}">${raw(timeline(snaps, d.id))}</div>
            <p class="tl-detail muted small" id="detail-${d.id}" aria-live="polite"></p>
            <span class="tl-dates"><span>${formatShortDate(snaps[0].date)}</span><span>${formatShortDate(snaps[snaps.length - 1].date)}</span></span>
          </li>`
        )}</ul>
      </section>`,
    mount(root) {
      $('#then', root)?.addEventListener('change', (e) => {
        thenIndex = Number(e.target.value);
        window.dispatchEvent(new Event('rerender'));
      });
      const show = (g) => {
        const dimId = g.dataset.dim;
        const s = snaps[Number(g.dataset.snap)];
        const v = s.dims[dimId];
        $$(`.tl-chart[data-dim="${dimId}"] .t-pt`, root).forEach((x) => x.classList.toggle('sel', x === g));
        $(`#detail-${dimId}`, root).textContent = `${formatDate(s.date)}: ${describe(asDim(dimId, v))}, position ${v.position.toFixed(2)}`;
      };
      $$('.t-pt', root).forEach((g) => {
        g.addEventListener('click', () => show(g));
        g.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            show(g);
          }
        });
      });
    },
  };
}
