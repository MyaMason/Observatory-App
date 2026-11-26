// The Living Philosophical Atlas: constellation, portrait, spectrum dials and details.
import { html, raw } from '../ui/dom.js';
import { constellation, dial, describe } from '../ui/charts.js';
import { symbol } from '../ui/symbols.js';
import { DIMENSIONS, DIM_BY_ID } from '../content/dimensions.js';
import { POSITIONS } from '../content/positions.js';
import { QUESTION_BY_ID, REALM_BY_ID } from '../content/realms.js';
import { state } from '../store.js';
import { buildPortrait, dimensionSentence } from '../engine/portrait.js';
import { activeChallenges } from '../engine/challenges.js';
import { CONFIDENCE } from '../engine/scoring.js';

const qLabel = (id) => `${REALM_BY_ID[QUESTION_BY_ID[id].realm].short}, question ${id.slice(1)}`;

const DISCLAIMER =
  'These dials are interpretive tools for philosophical reflection. They are not scientifically validated psychological measurements, and they cannot capture everything you believe.';

function portraitFor() {
  return buildPortrait(state.profile, activeChallenges(state.answers, state.profile));
}

export function atlas() {
  const p = state.profile;
  const portrait = portraitFor();
  const preview = portrait.sections.find((s) => s.kind === 'themes' || s.kind === 'theme') ?? portrait.sections[0];
  const dials = DIMENSIONS.map((d) => {
    const s = p.dims[d.id];
    return html`<li>
      <a class="dial-card status-${s.status}" href="#/atlas/${d.id}" style="--accent:${REALM_BY_ID[d.realm].accent}">
        <span class="dial-card-head"><span class="dial-card-name">${d.name}</span><span class="dial-card-status">${s.status === 'insufficient' ? 'Not enough answers yet' : describe(s)}</span></span>
        ${raw(dial(s))}
        <span class="dial-card-foot">${s.answered} of ${s.relevantTotal} relevant questions answered${s.beyond ? ' · steps beyond the spectrum' : ''}</span>
      </a></li>`;
  });
  return {
    title: 'Atlas',
    html: html`
      <section class="page atlas">
        <header class="page-head">
          <p class="eyebrow">The Living Philosophical Atlas</p>
          <h1>Your Atlas</h1>
          <p class="lede">${p.totalAnswered === 0
            ? 'Your atlas is still dark. Answer questions in any realm, and its stars will begin to glow.'
            : `${p.totalAnswered} of 49 questions answered across ${p.realmsTouched} realm${p.realmsTouched === 1 ? '' : 's'}.`}</p>
        </header>
        <div class="sky-map">${raw(constellation(p.realms, { idPrefix: 'atlas' }))}</div>
        ${p.totalAnswered === 0 ? html`<a class="btn btn-primary btn-large" href="#/observatory">Begin exploring</a>` : ''}

        <a class="portrait-card" href="#/atlas/portrait">
          <span class="portrait-card-sym">${raw(symbol('emblem', { size: 40 }))}</span>
          <span class="portrait-card-body">
            <span class="eyebrow">Your Philosophical Portrait</span>
            <span class="portrait-card-text">${portrait.developing ? portrait.sections[0].paragraphs[0] : (preview.paragraphs[0] ?? '').slice(0, 220) + ((preview.paragraphs[0] ?? '').length > 220 ? '…' : '')}</span>
            <span class="portrait-card-go">${portrait.developing ? 'View' : 'Read your portrait'} ›</span>
          </span>
        </a>

        <h2 class="section-title">The Eight Spectrums</h2>
        <p class="muted small">${DISCLAIMER}</p>
        <ul class="dial-list">${dials}</ul>

        ${p.positions.length
          ? html`<h2 class="section-title">Ideas Your Answers Echo</h2>
              <p class="muted small">Positions, not affiliations: these name ideas your answers resonate with, not traditions you belong to.</p>
              <ul class="positions">${p.positions.map(
                (x) => html`<li class="position"><strong>${POSITIONS[x.id].name}</strong><span>${POSITIONS[x.id].desc}</span><span class="muted small">${POSITIONS[x.id].found}</span></li>`
              )}</ul>`
          : ''}
        <a class="text-link" href="#/archive#scoring">How the Atlas is calculated ›</a>
      </section>`,
  };
}

export function portraitView() {
  const portrait = portraitFor();
  const sections = portrait.sections.map((s) => {
    const items = s.items
      ? html`<ul class="portrait-items">${s.items.map((it) =>
          it.name
            ? html`<li><strong>${it.name}.</strong> ${it.desc} <span class="muted">${it.found}</span></li>`
            : html`<li>${it.realm ? html`<a href="#/realm/${it.realm}">${it.text}</a>` : it.text}</li>`
        )}</ul>`
      : '';
    return html`<section class="portrait-section kind-${s.kind}">
      ${s.title ? html`<h2>${s.title}</h2>` : ''}
      ${s.paragraphs.map((t) => html`<p>${t}</p>`)}
      ${items}
    </section>`;
  });
  return {
    title: 'Your Philosophical Portrait',
    html: html`
      <section class="page portrait">
        <a class="back" href="#/atlas">‹ Atlas</a>
        <div class="portrait-sigil">${raw(symbol('emblem', { size: 90 }))}</div>
        <p class="eyebrow">A reflection on your answers</p>
        <h1>Your Philosophical Portrait</h1>
        <div class="manuscript">${sections}</div>
        ${portrait.developing ? html`<a class="btn btn-primary btn-large" href="#/observatory">Continue exploring</a>` : ''}
      </section>`,
  };
}

function effectText(c, dim) {
  if (c.kind === 'uncertain') return 'Genuinely uncertain: counted as uncertainty, no pull';
  if (c.kind === 'none') return 'None of the answers fit: no pull';
  if (c.kind === 'beyond') return 'Steps outside this spectrum: no pull';
  if (c.kind === 'silent') return 'Answer is silent on this spectrum: no pull';
  const toward = c.weight > 0 ? dim.b.label : c.weight < 0 ? dim.a.label : 'the middle';
  const amount = Math.abs(c.effect).toFixed(1);
  return c.weight === 0
    ? `Deliberate middle position (confidence ${c.confidence})`
    : `${amount} toward ${toward} (weight ${c.weight > 0 ? '+' : ''}${c.weight} × ${c.confidence} ${CONFIDENCE[c.confidence]})`;
}

export function dimensionView({ dimId }) {
  const dim = DIM_BY_ID[dimId];
  if (!dim) return null;
  const s = state.profile.dims[dimId];
  const sentence = s.status === 'insufficient' ? null : dimensionSentence(s);
  const separate = state.profile.allPositions.filter((p) => dim.related.ids.includes(p.id) && !(s.beyondPositions.includes(p.id) && p.count > 0));
  const rows = s.contributions.map((c) => {
    const q = QUESTION_BY_ID[c.qid];
    const a = state.answers[c.qid];
    const ans = typeof a.choice === 'number' ? q.options[a.choice].t : a.choice === 'uncertain' ? 'I’m genuinely uncertain' : 'None of these fit me';
    return html`<li class="calc-row kind-${c.kind}">
      <a href="#/realm/${q.realm}/${q.id}" class="calc-q">${q.text}</a>
      <span class="calc-a">Your answer: ${ans}</span>
      <span class="calc-e">${effectText(c, dim)}</span>
    </li>`;
  });
  const pct = (x) => Math.round(x * 100) + '%';
  return {
    title: dim.name,
    html: html`
      <section class="page dim-detail" style="--accent:${REALM_BY_ID[dim.realm].accent}">
        <a class="back" href="#/atlas">‹ Atlas</a>
        <p class="eyebrow">Spectrum</p>
        <h1>${dim.name}</h1>
        <div class="dial-big">${raw(dial(s))}</div>
        <p class="dim-status">${describe(s)}</p>
        ${sentence ? html`<p class="lede">${sentence}</p>` : ''}
        <p>${dim.about}</p>
        <dl class="poles">
          <div><dt>${dim.a.label}</dt><dd>The view that ${dim.a.gloss}.</dd></div>
          <div><dt>${dim.b.label}</dt><dd>The view that ${dim.b.gloss}.</dd></div>
        </dl>
        ${s.beyond
          ? html`<div class="notice"><p>${dim.beyondNote}</p>${s.beyondPositions.length
              ? html`<p>Related positions: ${s.beyondPositions.map((p, i) => html`${i ? ', ' : ''}<strong>${POSITIONS[p].name}</strong>`)}.</p>`
              : ''}</div>`
          : ''}

        ${separate.length
          ? html`<h2 class="section-title">Recorded separately</h2>
              <p class="muted small">${dim.related.note}</p>
              <ul class="positions">${separate.map(
                (x) => html`<li class="position"><strong>${POSITIONS[x.id].name}</strong><span>${POSITIONS[x.id].desc}</span>
                  <span class="muted small">${x.count ? `From ${x.count} answer${x.count === 1 ? '' : 's'}` : 'From an answer you marked as also resonating'}: ${x.questions.map(qLabel).join(', ')}</span></li>`
              )}</ul>`
          : ''}

        <h2 class="section-title" id="calc">How this was calculated</h2>
        <p class="muted small">Each answer carries a pre-written weight from −2 (toward ${dim.a.label}) to +2 (toward ${dim.b.label}), multiplied by your confidence (certain 1, leaning 0.6, unsure 0.3). The position is the average pull of the answers that actually take a side, so unanswered questions never drag you toward the centre.</p>
        ${s.answered === 0
          ? html`<p>You have not answered any of the ${s.relevantTotal} questions that bear on this spectrum yet.</p>`
          : html`<ul class="calc-list">${rows}</ul>`}
        <dl class="metrics">
          <div><dt>Coverage</dt><dd>${s.answered} of ${s.relevantTotal} relevant questions (${pct(s.coverage)})</dd></div>
          <div><dt>Position</dt><dd>${s.position === null ? 'No positional answers yet' : `${s.position.toFixed(2)} on a scale from −1 (${dim.a.label}) to +1 (${dim.b.label})`}</dd></div>
          <div><dt>Conviction</dt><dd>${s.positional ? pct(s.conviction) + ' average confidence' : '—'}</dd></div>
          <div><dt>Tension</dt><dd>${s.positional ? pct(s.tension) + ' (how strongly answers pull in opposite directions)' : '—'}</dd></div>
          <div><dt>Uncertain / beyond</dt><dd>${s.uncertain} uncertain · ${s.beyond} beyond the spectrum · ${s.noneFit} “none fit”</dd></div>
        </dl>
        <p class="muted small">${DISCLAIMER}</p>
      </section>`,
  };
}
