// Challenge My Universe.
import { html, raw, toast, $, $$ } from '../ui/dom.js';
import { symbol } from '../ui/symbols.js';
import { REALM_BY_ID, QUESTION_BY_ID } from '../content/realms.js';
import { state, getMeta, setMeta } from '../store.js';
import { activeChallenges, TYPE_LABEL } from '../engine/challenges.js';

const FILTERS = [['all', 'All'], ['tension', 'Tensions'], ['counter', 'Counterarguments'], ['thought', 'Thought experiments'], ['perspective', 'Perspectives'], ['reflect', 'Reflections']];
let currentFilter = 'all';

function tile(c) {
  const r = c.realm ? REALM_BY_ID[c.realm] : null;
  return html`<li><a class="ch-tile type-${c.type}" href="#/challenges/${c.id}" style="--accent:${r?.accent ?? 'var(--gold)'}">
    <span class="ch-sym">${raw(symbol(r?.symbol ?? 'emblem', { size: 34 }))}</span>
    <span class="ch-text"><span class="ch-type">${TYPE_LABEL[c.type]}</span><span class="ch-title">${c.title}</span></span>
    <span aria-hidden="true">›</span></a></li>`;
}

export function challenges() {
  const all = activeChallenges(state.answers, state.profile);
  const aside = new Set(getMeta('setAside', []));
  const visible = all.filter((c) => !aside.has(c.id));
  const setAside = all.filter((c) => aside.has(c.id));
  const shown = currentFilter === 'all' ? visible : visible.filter((c) => c.type === currentFilter);
  const counts = Object.fromEntries(FILTERS.map(([k]) => [k, k === 'all' ? visible.length : visible.filter((c) => c.type === k).length]));
  return {
    title: 'Challenge My Universe',
    html: html`
      <section class="page challenges">
        <header class="page-head">
          <p class="eyebrow">Challenge My Universe</p>
          <h1>Challenges</h1>
          <p class="lede">Counterarguments, thought experiments and other perspectives, chosen in response to your answers. They are meant as invitations to think, not corrections.</p>
        </header>
        ${all.length === 0
          ? html`<div class="empty">
              ${raw(symbol('orbits', { size: 80 }))}
              <p>Your universe has not been challenged yet. Answer a few questions in any realm, and challenges drawn from your own answers will appear here.</p>
              <a class="btn btn-primary" href="#/observatory">Choose a realm</a></div>`
          : html`
            <div class="chips" role="group" aria-label="Filter challenges">
              ${FILTERS.filter(([k]) => k === 'all' || counts[k] > 0).map(
                ([k, l]) => html`<button class="chip" data-filter="${k}" aria-pressed="${currentFilter === k}">${l} <span class="chip-n">${counts[k]}</span></button>`
              )}
            </div>
            ${shown.length ? html`<ul class="ch-list">${shown.map(tile)}</ul>` : html`<p class="muted">No challenges of this kind right now.</p>`}
            ${setAside.length
              ? html`<details class="set-aside"><summary>Set aside (${setAside.length})</summary><ul class="ch-list">${setAside.map(tile)}</ul></details>`
              : ''}`}
      </section>`,
    mount(root) {
      $$('[data-filter]', root).forEach((b) =>
        b.addEventListener('click', () => {
          currentFilter = b.dataset.filter;
          window.dispatchEvent(new Event('rerender'));
        })
      );
    },
  };
}

export function challengeDetail({ id }) {
  const all = activeChallenges(state.answers, state.profile);
  const c = all.find((x) => x.id === id);
  if (!c) {
    return {
      title: 'Challenge',
      html: html`<section class="page"><a class="back" href="#/challenges">‹ Challenges</a>
        <h1>This challenge has moved on</h1>
        <p>It no longer applies to your current answers, perhaps because you revisited a question.</p></section>`,
    };
  }
  const r = c.realm ? REALM_BY_ID[c.realm] : null;
  const aside = new Set(getMeta('setAside', []));
  const isAside = aside.has(c.id);
  const revisitQ = c.revisit ? QUESTION_BY_ID[c.revisit] : null;
  const journalHref = `#/journal/new?realm=${c.realm ?? ''}&title=${encodeURIComponent('On ' + c.title)}&prompt=${encodeURIComponent(c.prompt)}`;
  return {
    title: c.title,
    realm: c.realm,
    html: html`
      <section class="page ch-detail" style="--accent:${r?.accent ?? 'var(--gold)'}">
        <a class="back" href="#/challenges">‹ Challenges</a>
        <div class="ch-detail-sym">${raw(symbol(r?.symbol ?? 'emblem', { size: 96 }))}</div>
        <p class="eyebrow">${TYPE_LABEL[c.type]}${r ? ` · ${r.short}` : ''}</p>
        <h1>${c.title}</h1>
        <div class="manuscript">${c.body.map((p) => html`<p>${p}</p>`)}</div>
        <blockquote class="prompt"><span class="eyebrow">To consider</span><p>${c.prompt}</p></blockquote>
        <p class="muted small">Source notes: ${c.source}</p>
        <div class="ch-actions">
          <a class="btn btn-primary" href="${journalHref}">Reflect in Journal</a>
          ${revisitQ ? html`<a class="btn btn-ghost" href="#/realm/${revisitQ.realm}/${revisitQ.id}">Revisit my answer</a>` : ''}
          <button class="btn btn-ghost" id="aside">${isAside ? 'Restore to my challenges' : 'Set aside for now'}</button>
        </div>
      </section>`,
    mount(root) {
      $('#aside', root).addEventListener('click', async () => {
        const list = new Set(getMeta('setAside', []));
        if (list.has(c.id)) {
          list.delete(c.id);
          toast('Restored to your challenges');
        } else {
          list.add(c.id);
          toast('Set aside. You can find it at the bottom of the Challenges list.');
        }
        await setMeta('setAside', [...list]);
        location.hash = '#/challenges';
      });
    },
  };
}
