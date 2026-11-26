// The Astral Journal.
import { html, raw, esc, toast, confirmDialog, $, $$, debounce, formatDate } from '../ui/dom.js';
import { symbol } from '../ui/symbols.js';
import { REALMS, REALM_BY_ID } from '../content/realms.js';
import { state, saveJournal, deleteJournal } from '../store.js';
import { localDateKey } from '../engine/scoring.js';

let realmFilter = 'all';

export function journal() {
  const entries = [...state.journal].sort((a, b) => b.date.localeCompare(a.date) || b.updated - a.updated);
  const shown = realmFilter === 'all' ? entries : entries.filter((e) => (realmFilter === 'none' ? !e.realm : e.realm === realmFilter));
  const usedRealms = REALMS.filter((r) => entries.some((e) => e.realm === r.id));
  return {
    title: 'Astral Journal',
    html: html`
      <section class="page journal">
        <header class="page-head">
          <p class="eyebrow">The Astral Journal</p>
          <h1>Journal</h1>
          <p class="lede">A private place for your reflections, doubts and changing beliefs. Entries stay on this device.</p>
        </header>
        <a class="btn btn-primary btn-large" href="#/journal/new">✦ New entry</a>
        ${entries.length === 0
          ? html`<div class="empty">${raw(symbol('eclipse', { size: 80 }))}<p>Your journal is waiting. Write about a question that stayed with you, a belief that shifted, or something you cannot yet put into words.</p></div>`
          : html`
            ${usedRealms.length
              ? html`<div class="chips" role="group" aria-label="Filter by realm">
                  <button class="chip" data-realm="all" aria-pressed="${realmFilter === 'all'}">All</button>
                  ${usedRealms.map((r) => html`<button class="chip" data-realm="${r.id}" aria-pressed="${realmFilter === r.id}">${r.short}</button>`)}
                  <button class="chip" data-realm="none" aria-pressed="${realmFilter === 'none'}">No realm</button>
                </div>`
              : ''}
            <ul class="entries">${shown.map((e) => {
              const r = e.realm ? REALM_BY_ID[e.realm] : null;
              return html`<li><a class="entry" href="#/journal/${e.id}" style="--accent:${r?.accent ?? 'var(--gold)'}">
                <span class="entry-sym">${raw(symbol(r?.symbol ?? 'emblem', { size: 30 }))}</span>
                <span class="entry-body"><span class="entry-title">${e.title || 'Untitled reflection'}</span>
                <span class="entry-meta">${formatDate(e.date)}${r ? ' · ' + r.short : ''}</span>
                <span class="entry-excerpt">${e.text.slice(0, 140)}${e.text.length > 140 ? '…' : ''}</span></span></a></li>`;
            })}</ul>
            ${shown.length === 0 ? html`<p class="muted">No entries match this filter.</p>` : ''}`}
      </section>`,
    mount(root) {
      $$('[data-realm]', root).forEach((b) =>
        b.addEventListener('click', () => {
          realmFilter = b.dataset.realm;
          window.dispatchEvent(new Event('rerender'));
        })
      );
    },
  };
}

export function journalEditor({ id, query }) {
  const existing = id ? state.journal.find((j) => j.id === id) : null;
  if (id && !existing) return null;
  const draft = existing ?? {
    title: query.get('title') ?? '',
    date: localDateKey(),
    text: query.get('prompt') ? query.get('prompt') + '\n\n' : '',
    realm: REALM_BY_ID[query.get('realm')] ? query.get('realm') : null,
  };
  return {
    title: existing ? 'Edit entry' : 'New entry',
    html: html`
      <section class="page journal-editor">
        <a class="back" href="#/journal">‹ Journal</a>
        <h1>${existing ? 'Edit entry' : 'New entry'}</h1>
        <form id="entry-form" class="form" novalidate>
          <label class="field"><span>Title <span class="muted">(optional)</span></span>
            <input name="title" maxlength="200" value="${draft.title}" placeholder="Untitled reflection" /></label>
          <div class="field-row">
            <label class="field"><span>Date</span><input type="date" name="date" value="${draft.date}" required /></label>
            <label class="field"><span>Realm <span class="muted">(optional)</span></span>
              <select name="realm"><option value="">None</option>${REALMS.map(
                (r) => html`<option value="${r.id}" ${raw(draft.realm === r.id ? 'selected' : '')}>${r.short}</option>`
              )}</select></label>
          </div>
          <label class="field"><span>Your reflection</span>
            <textarea name="text" rows="12" placeholder="Write freely…">${draft.text}</textarea></label>
          <p class="saved-note" id="save-status" aria-live="polite">${existing ? 'All changes saved' : 'Your entry is saved automatically as you write.'}</p>
          <div class="form-actions">
            <a class="btn btn-primary" href="#/journal" id="done">Done</a>
            <button type="button" class="btn btn-danger-ghost" id="delete" ${raw(existing ? '' : 'hidden')}>Delete entry</button>
          </div>
        </form>
      </section>`,
    mount(root) {
      const form = $('#entry-form', root);
      const status = $('#save-status', root);
      let current = existing ? { ...existing } : null;
      let pending = false;
      let deleted = false;
      const read = () => ({
        title: form.title.value.trim(),
        date: form.date.value || localDateKey(),
        realm: form.realm.value || null,
        text: form.text.value,
      });
      const save = debounce(async () => {
        pending = false;
        if (deleted) return;
        const v = read();
        if (!current && !v.title && !v.text.trim()) {
          status.textContent = 'Your entry is saved automatically as you write.';
          return;
        }
        current = await saveJournal({ ...(current ?? {}), ...v });
        if (!existing && !location.hash.includes(current.id)) history.replaceState(null, '', `#/journal/${current.id}`);
        status.textContent = 'All changes saved';
        $('#delete', root).hidden = false;
      }, 500);
      form.addEventListener('input', () => {
        status.textContent = 'Saving…';
        pending = true;
        save();
      });
      form.addEventListener('submit', (e) => e.preventDefault());
      $('#done', root).addEventListener('click', () => {
        if (pending) save.flush();
        if (current || read().text.trim() || read().title) toast('Entry saved to your journal');
      });
      $('#delete', root).addEventListener('click', async () => {
        const ok = await confirmDialog({
          title: 'Delete this entry?',
          body: 'This permanently removes the entry from this device. It cannot be undone unless you have an exported backup.',
          confirm: 'Delete entry',
          danger: true,
        });
        if (!ok) return;
        deleted = true;
        await deleteJournal(current.id);
        toast('Entry deleted');
        location.hash = '#/journal';
      });
      return () => {
        if (pending && !deleted) save.flush();
      };
    },
  };
}
