// Threshold, Observatory (home), realm chambers and question cards.
import { html, raw, esc, toast, $, $$, debounce } from '../ui/dom.js';
import { symbol } from '../ui/symbols.js';
import { moon, constellation } from '../ui/charts.js';
import { REALMS, REALM_BY_ID, UNCERTAIN, NONE_FIT } from '../content/realms.js';
import { state, saveAnswer, setMeta, getMeta } from '../store.js';
import { isValidChoice } from '../engine/scoring.js';

const answered = (qid) => !!state.answers[qid] && isValidChoice(qid, state.answers[qid].choice);
import { installCard } from './archive.js';

// ── Threshold (first launch) ──
export function threshold() {
  return {
    title: 'Enter the Observatory',
    chrome: false,
    html: html`
      <section class="threshold">
        <div class="threshold-emblem">${raw(symbol('emblem', { size: 160 }))}</div>
        <h1 class="threshold-title">The Metaphysical Observatory</h1>
        <p class="threshold-sub">A Cartography of the Soul</p>
        <p class="threshold-greeting">Every soul carries a universe of unanswered questions. Enter the Observatory and discover the architecture of your own.</p>
        <button class="btn btn-primary btn-large" id="enter">Enter the Observatory</button>
        <p class="threshold-note">No account. Nothing you write leaves this device.</p>
      </section>`,
    mount(root) {
      $('#enter', root).addEventListener('click', async () => {
        await setMeta('introSeen', true);
        document.body.classList.add('iris');
        setTimeout(() => {
          location.hash = '#/observatory';
          setTimeout(() => document.body.classList.remove('iris'), 700);
        }, 380);
      });
    },
  };
}

function realmAction(pr) {
  if (pr.answered === 0) return 'Enter';
  if (pr.answered < pr.total) return 'Continue';
  return 'Revisit';
}

// ── Observatory (home) ──
export function observatory() {
  const pr = state.profile.realms;
  const started = state.profile.totalAnswered > 0;
  const realmCards = REALMS.map((r) => {
    const p = pr[r.id];
    return html`
      <li>
        <a class="realm-card ${p.answered ? 'lit' : 'dormant'}" href="#/realm/${r.id}" style="--accent:${r.accent}">
          <span class="realm-card-sym">${raw(symbol(r.symbol, { size: 44 }))}</span>
          <span class="realm-card-text">
            <span class="realm-card-num">${r.numeral}</span>
            <span class="realm-card-name">${r.name}</span>
            <span class="realm-card-progress">${raw(moon(p.fraction, 16))} ${p.answered} of ${p.total} answered</span>
          </span>
          <span class="realm-card-go" aria-hidden="true">${realmAction(p)} ›</span>
        </a>
      </li>`;
  });
  return {
    title: 'The Observatory',
    html: html`
      <section class="page observatory">
        <header class="page-head">
          <p class="eyebrow">A Cartography of the Soul</p>
          <h1>The Observatory</h1>
          <p class="lede">${started
            ? 'Your sky is beginning to glow. Choose a realm to continue exploring.'
            : 'Choose a realm to begin. Each holds seven questions, and there are no wrong answers.'}</p>
        </header>
        ${!state.persistent
          ? html`<div class="notice warn" role="alert"><strong>Your browser is not allowing local storage.</strong> You can explore, but nothing will be saved when you close the app. This often happens in private browsing.</div>`
          : ''}
        <div class="sky-map">${raw(constellation(pr))}</div>
        ${installCard('home')}
        <h2 class="section-title">The Seven Realms</h2>
        <ol class="realm-list">${realmCards}</ol>
      </section>`,
    mount(root) {
      root.querySelectorAll('[data-dismiss-install]').forEach((b) =>
        b.addEventListener('click', async () => {
          await setMeta('installHintDismissed', true);
          b.closest('.install-card')?.remove();
        })
      );
    },
  };
}

// ── Realm chamber ──
export function chamber({ realmId }) {
  const r = REALM_BY_ID[realmId];
  if (!r) return null;
  const pr = state.profile.realms[r.id];
  const firstOpen = r.questions.find((q) => !answered(q.id)) ?? r.questions[0];
  const items = r.questions.map((q, i) => {
    const a = answered(q.id);
    return html`<li><a class="q-link ${a ? 'done' : ''}" href="#/realm/${r.id}/${q.id}">
      ${raw(moon(a ? 1 : 0, 18))}<span class="q-link-num">${i + 1}</span><span class="q-link-text">${q.text}</span></a></li>`;
  });
  return {
    title: r.name,
    realm: r.id,
    html: html`
      <section class="page chamber" style="--accent:${r.accent}">
        <a class="back" href="#/observatory">‹ Observatory</a>
        <div class="chamber-sigil">${raw(symbol(r.symbol, { size: 150, cls: 'chamber-symbol' }))}</div>
        <p class="eyebrow">Realm ${r.numeral}</p>
        <h1 class="chamber-title">${r.name}</h1>
        <p class="chamber-intro">${r.intro}</p>
        <div class="chamber-progress">${raw(moon(pr.fraction, 22))}<span>${pr.answered} of ${pr.total} questions answered</span></div>
        <a class="btn btn-primary btn-large" href="#/realm/${r.id}/${firstOpen.id}">${pr.answered === 0 ? 'Begin' : pr.answered < pr.total ? 'Continue' : 'Revisit the first question'}</a>
        <h2 class="section-title">The Questions of this Realm</h2>
        <ol class="q-list">${items}</ol>
      </section>`,
  };
}

// ── Question card ──
const CONF_OPTS = [
  ['certain', 'Certain'],
  ['leaning', 'Leaning'],
  ['unsure', 'Unsure'],
];

export function question({ realmId, qid }) {
  const r = REALM_BY_ID[realmId];
  const idx = r?.questions.findIndex((q) => q.id === qid) ?? -1;
  if (!r || idx < 0) return null;
  const q = r.questions[idx];
  const a = state.answers[q.id];
  const prev = r.questions[idx - 1];
  const next = r.questions[idx + 1];
  const choice = a?.choice;
  const positional = typeof choice === 'number';

  const opt = (value, text, extraCls = '') => html`
    <label class="option ${extraCls}">
      <input type="radio" name="answer" value="${value}" ${raw(String(choice) === String(value) ? 'checked' : '')} />
      <span class="option-mark" aria-hidden="true"></span>
      <span class="option-text">${text}</span>
    </label>`;

  const moons = r.questions.map(
    (qq, i) => html`<a href="#/realm/${r.id}/${qq.id}" class="moon-step ${qq.id === q.id ? 'current' : ''}" aria-label="Question ${i + 1}${answered(qq.id) ? ', answered' : ''}${qq.id === q.id ? ', current' : ''}">${raw(moon(answered(qq.id) ? 1 : qq.id === q.id ? 0.5 : 0, 16))}</a>`
  );

  return {
    title: `${r.short}: Question ${idx + 1}`,
    realm: r.id,
    html: html`
      <section class="page question-page" style="--accent:${r.accent}">
        <div class="q-top">
          <a class="back" href="#/realm/${r.id}">‹ ${r.short}</a>
          <nav class="moon-steps" aria-label="Questions in this realm">${moons}</nav>
        </div>
        <article class="q-card">
          <div class="q-card-sym">${raw(symbol(r.symbol, { size: 36 }))}</div>
          <p class="eyebrow">${r.numeral} · Question ${idx + 1} of ${r.questions.length}</p>
          <h1 class="q-text" id="q-text">${q.text}</h1>
          <fieldset class="options" aria-labelledby="q-text">
            <legend class="sr-only">Choose the answer closest to your view</legend>
            ${q.options.map((o, i) => opt(i, o.t))}
            <div class="ornament" aria-hidden="true">✦ ✦ ✦</div>
            ${opt(UNCERTAIN, 'I’m genuinely uncertain', 'universal')}
            ${opt(NONE_FIT, 'None of these fit me', 'universal')}
          </fieldset>

          <fieldset class="confidence ${positional ? '' : 'hidden'}" id="confidence">
            <legend>How firmly do you hold this?</legend>
            <div class="segmented">
              ${CONF_OPTS.map(
                ([v, l]) => html`<label><input type="radio" name="conf" value="${v}" ${raw((a?.confidence ?? 'leaning') === v ? 'checked' : '')} /><span>${l}</span></label>`
              )}
            </div>
          </fieldset>

          <details class="also ${choice === undefined || choice === null ? 'hidden' : ''}" id="also" ${raw(a?.also?.length ? 'open' : '')}>
            <summary>Another answer also resonates <span class="muted">(optional)</span></summary>
            <p class="muted small">Tick any other answers that also speak to you. They are noted alongside your main answer but never move a spectrum.</p>
            <div class="also-list">
              ${q.options.map(
                (o, i) => html`<label class="also-item" data-index="${i}" ${raw(choice === i ? 'hidden' : '')}>
                  <input type="checkbox" value="${i}" ${raw(a?.also?.includes(i) ? 'checked' : '')} /><span>${o.t}</span></label>`
              )}
            </div>
          </details>

          <details class="why" ${raw(a?.why ? 'open' : '')}>
            <summary>Why? <span class="muted">(optional, private)</span></summary>
            <label class="sr-only" for="why">Your reasoning</label>
            <textarea id="why" rows="4" placeholder="Note your reasoning, doubts or a counter-thought…">${a?.why ?? ''}</textarea>
            <p class="saved-note muted" id="why-status" aria-live="polite"></p>
          </details>
        </article>

        <nav class="q-nav" aria-label="Question navigation">
          ${prev ? html`<a class="btn btn-ghost" href="#/realm/${r.id}/${prev.id}">‹ Previous</a>` : html`<span></span>`}
          ${next
            ? html`<a class="btn btn-primary" href="#/realm/${r.id}/${next.id}" id="next">Next ›</a>`
            : html`<a class="btn btn-primary" href="#/realm/${r.id}" id="next">Return to the chamber</a>`}
        </nav>
      </section>`,
    mount(root) {
      const conf = $('#confidence', root);
      $$('input[name="answer"]', root).forEach((inp) =>
        inp.addEventListener('change', async () => {
          const v = inp.value;
          const c = v === UNCERTAIN || v === NONE_FIT ? v : Number(v);
          const wasAnswered = answered(q.id);
          const patch = { choice: c };
          if (!wasAnswered) patch.confidence = $('input[name="conf"]:checked', root)?.value ?? 'leaning';
          // The main answer can't also be a secondary answer.
          const also = (state.answers[q.id]?.also ?? []).filter((i) => i !== c);
          if (also.length !== (state.answers[q.id]?.also ?? []).length) patch.also = also;
          await saveAnswer(q.id, patch);
          conf.classList.toggle('hidden', typeof c !== 'number');
          $('#also', root).classList.remove('hidden');
          $$('.also-item', root).forEach((el) => {
            const hide = Number(el.dataset.index) === c;
            el.hidden = hide;
            if (hide) el.querySelector('input').checked = false;
          });
          const step = $(`.moon-step.current`, root);
          if (step) step.innerHTML = moon(1, 16);
          toast(wasAnswered ? 'Answer updated' : 'Recorded among the stars');
        })
      );
      $$('input[name="conf"]', root).forEach((inp) =>
        inp.addEventListener('change', async () => {
          if (!answered(q.id)) return;
          await saveAnswer(q.id, { confidence: inp.value });
          toast('Confidence noted');
        })
      );
      $$('.also-item input', root).forEach((cb) =>
        cb.addEventListener('change', async () => {
          if (!answered(q.id)) return;
          const also = $$('.also-item input', root).filter((x) => x.checked).map((x) => Number(x.value));
          await saveAnswer(q.id, { also });
          toast(cb.checked ? 'Also noted as resonating' : 'Removed');
        })
      );
      const why = $('#why', root);
      const status = $('#why-status', root);
      const saveWhy = debounce(async () => {
        await saveAnswer(q.id, { why: why.value });
        status.textContent = 'Reasoning saved';
      }, 600);
      why.addEventListener('input', () => {
        status.textContent = 'Saving…';
        saveWhy();
      });
      return () => {
        if (status.textContent === 'Saving…') saveWhy.flush();
      };
    },
  };
}
