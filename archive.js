// The Archive: offline status, data safety, export/import, delete, motion, install help,
// and a plain-language explanation of the scoring.
import { html, raw, toast, confirmDialog, alertDialog, esc, $, $$, formatDate } from '../ui/dom.js';
import { symbol } from '../ui/symbols.js';
import { state, exportData, replaceAll, deleteAll, getMeta, setMeta } from '../store.js';
import { makeBackup, validateBackup } from '../engine/backup.js';
import { localDateKey } from '../engine/scoring.js';
import { REALM_BY_ID } from '../content/realms.js';

// Shared, updated by main.js
export const appStatus = {
  offline: 'checking', // checking | ready | not-ready | unsupported
  persistence: 'unknown', // granted | denied | unsupported | unknown
  installPrompt: null, // BeforeInstallPromptEvent (Android/desktop Chrome)
  standalone: false,
  platform: 'other', // ios | android | other
  version: '',
};

export function installCard(where) {
  if (appStatus.standalone) return '';
  if (where === 'home' && getMeta('installHintDismissed', false)) return '';
  if (appStatus.platform === 'ios') {
    return html`<aside class="install-card">
      <p><strong>Keep the Observatory on your Home Screen.</strong> On iPhone, tap the Share button
      <span class="ios-share" aria-label="Share icon">${raw('<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M10 2v11M6 6l4-4 4 4M4 9v9h12V9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>')}</span>
      then <em>Add to Home Screen</em>. Install <em>before</em> you begin: on iPhone, the installed app keeps its own storage, separate from the browser tab.</p>
      ${where === 'home' ? html`<button class="btn btn-ghost small" data-dismiss-install>Not now</button>` : ''}
    </aside>`;
  }
  if (appStatus.installPrompt) {
    return html`<aside class="install-card">
      <p><strong>Install the Observatory</strong> to open it from its own icon, in its own window, even offline.</p>
      <div class="row"><button class="btn btn-primary small" data-install>Install</button>
      ${where === 'home' ? html`<button class="btn btn-ghost small" data-dismiss-install>Not now</button>` : ''}</div>
    </aside>`;
  }
  return '';
}

function download(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return blob;
}

function journalText() {
  const lines = ['THE METAPHYSICAL OBSERVATORY: ASTRAL JOURNAL', `Exported ${new Date().toLocaleString()}`, ''];
  for (const e of [...state.journal].sort((a, b) => a.date.localeCompare(b.date))) {
    lines.push('────────────────────────────────', e.title || 'Untitled reflection', formatDate(e.date) + (e.realm ? ' · ' + REALM_BY_ID[e.realm].name : ''), '', e.text, '');
  }
  return lines.join('\n');
}

const OFFLINE_TEXT = {
  checking: 'Checking whether every file has been saved for offline use…',
  ready: 'Ready for offline use. Every file the app needs is saved on this device.',
  'not-ready': 'Not yet ready for offline use. Keep the app open while connected so it can finish saving its files.',
  unsupported: 'This browser does not support offline use for web apps.',
};
const PERSIST_TEXT = {
  granted: 'Your browser has agreed to treat this app’s data as persistent, which makes automatic clearing much less likely, though not impossible.',
  denied: 'Your browser has not granted persistent storage. It may clear this app’s data if the device runs low on space or the app goes unused. Installing the app and exporting backups help.',
  unsupported: 'This browser does not report whether storage is persistent.',
  unknown: 'Checking storage status…',
};

export function archive() {
  const lastExport = getMeta('lastExport', null);
  const motion = getMeta('motion', 'system');
  const counts = `${Object.values(state.answers).filter((a) => a.choice !== null).length} answers, ${state.journal.length} journal entries, ${state.snapshots.length} history snapshots`;
  return {
    title: 'The Archive',
    html: html`
      <section class="page archive">
        <a class="back" href="#/observatory">‹ Observatory</a>
        <header class="page-head"><p class="eyebrow">Settings and safekeeping</p><h1>The Archive</h1></header>

        <section class="panel" aria-labelledby="h-offline">
          <h2 id="h-offline">Offline use</h2>
          <p class="status-line status-${appStatus.offline}" id="offline-status">${OFFLINE_TEXT[appStatus.offline]}</p>
        </section>

        <section class="panel" aria-labelledby="h-data">
          <h2 id="h-data">Your data</h2>
          <p>Everything you enter is stored only in this browser on this device: ${counts}. Nothing is sent anywhere.</p>
          ${!state.persistent ? html`<p class="notice warn">Storage is unavailable in this browser session, so nothing will be kept after you close the app.</p>` : ''}
          <p class="notice"><strong>Please keep backups.</strong> Browser storage can be lost: you might clear your browsing data, the browser might remove it to free space, Safari may remove data for websites that are not installed and go unused for some time, and uninstalling the app removes it. Exporting a backup is the only way to protect against this.</p>
          <p class="muted small">${PERSIST_TEXT[appStatus.persistence]}</p>
          <p class="muted small">${lastExport ? `Last backup exported ${formatDate(lastExport)}.` : 'You have not exported a backup yet.'}</p>
        </section>

        <section class="panel" aria-labelledby="h-export">
          <h2 id="h-export">Export</h2>
          <p>A full backup (.json) can be imported later to restore everything. The journal text file is a readable copy of your entries.</p>
          <div class="stack">
            <button class="btn btn-primary" id="export-json">Download full backup</button>
            <button class="btn btn-ghost" id="export-txt" ${raw(state.journal.length ? '' : 'disabled')}>Download journal as text</button>
            <button class="btn btn-ghost" id="share-json" hidden>Save or share backup…</button>
          </div>
        </section>

        <section class="panel" aria-labelledby="h-import">
          <h2 id="h-import">Import a backup</h2>
          <p>Restoring a backup replaces all data currently in the app. The file is checked first, and nothing changes until you confirm.</p>
          <label class="btn btn-ghost file-btn">Choose backup file<input type="file" id="import" accept=".json,application/json" class="sr-only" /></label>
          <div id="import-result" aria-live="polite"></div>
        </section>

        <section class="panel" aria-labelledby="h-motion">
          <h2 id="h-motion">Motion</h2>
          <div class="segmented wide" role="radiogroup" aria-labelledby="h-motion">
            ${[['system', 'Follow device'], ['reduced', 'Still'], ['full', 'Animated']].map(
              ([v, l]) => html`<label><input type="radio" name="motion" value="${v}" ${raw(motion === v ? 'checked' : '')} /><span>${l}</span></label>`
            )}
          </div>
        </section>

        <section class="panel" aria-labelledby="h-install">
          <h2 id="h-install">Install on your phone</h2>
          ${appStatus.standalone
            ? html`<p>You are using the installed app.</p>`
            : html`${installCard('archive')}
              <p><strong>iPhone or iPad:</strong> open this site in Safari (or, on iOS 16.4 and later, Chrome or Edge), tap Share, then <em>Add to Home Screen</em>.</p>
              <p><strong>Android:</strong> in Chrome, tap the ⋮ menu, then <em>Install app</em> or <em>Add to Home screen</em>.</p>`}
        </section>

        <section class="panel" id="scoring" aria-labelledby="h-scoring">
          <h2 id="h-scoring">How the Atlas is calculated</h2>
          <p>Every answer option was given a small, pre-written weight on one or more of eight spectrums, from −2 to +2. Your confidence scales that weight: <em>certain</em> counts fully, <em>leaning</em> 60%, <em>unsure</em> 30%.</p>
          <p>For each spectrum, the app keeps several things separate: <strong>coverage</strong> (how many relevant questions you have answered), <strong>position</strong> (the average pull of answers that take a side, counting only questions you actually answered), <strong>conviction</strong> (how confidently you hold those answers) and <strong>tension</strong> (how strongly your answers pull in opposite directions).</p>
          <p>Answers that reject a spectrum’s framing, such as compatibilism on free will or idealism on mind and matter, are recorded as <em>beyond the spectrum</em> rather than forced onto it. “I’m genuinely uncertain” is recorded as uncertainty, and “None of these fit me” carries no weight at all.</p>
          <p>From these, each spectrum is described as: not enough answers yet, genuinely uncertain, beyond the spectrum, strongly held competing views, pulled both ways, a middle position, leaning, or clearly held.</p>
          <p class="notice">These are interpretive tools for philosophical reflection. They are not scientifically validated psychological measurements.</p>
        </section>

        <section class="panel danger-zone" aria-labelledby="h-delete">
          <h2 id="h-delete">Delete all data</h2>
          <p>Permanently erase every answer, journal entry, history snapshot and setting from this device.</p>
          <button class="btn btn-danger" id="delete-all">Delete all my data</button>
        </section>

        <section class="panel about">
          <div class="about-sym">${raw(symbol('emblem', { size: 54 }))}</div>
          <p class="muted small">The Metaphysical Observatory ${appStatus.version}. No accounts, no tracking, no external services. Typefaces: Cormorant Garamond and Atkinson Hyperlegible, both under the SIL Open Font License.</p>
        </section>
      </section>`,
    mount(root) {
      const backupText = () => JSON.stringify(makeBackup(exportData()), null, 2);
      const fname = `observatory-backup-${localDateKey()}.json`;
      $('#export-json', root).addEventListener('click', async () => {
        download(fname, backupText(), 'application/json');
        await setMeta('lastExport', localDateKey());
        toast('Backup downloaded');
      });
      $('#export-txt', root).addEventListener('click', () => {
        download(`observatory-journal-${localDateKey()}.txt`, journalText(), 'text/plain');
        toast('Journal downloaded');
      });
      const share = $('#share-json', root);
      try {
        const test = new File(['{}'], fname, { type: 'application/json' });
        if (navigator.canShare?.({ files: [test] })) {
          share.hidden = false;
          share.addEventListener('click', async () => {
            try {
              await navigator.share({ files: [new File([backupText()], fname, { type: 'application/json' })], title: 'Observatory backup' });
              await setMeta('lastExport', localDateKey());
              toast('Backup shared');
            } catch (e) {
              if (e.name !== 'AbortError') toast('Sharing was not completed');
            }
          });
        }
      } catch {}

      $('#import', root).addEventListener('change', async (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        const out = $('#import-result', root);
        if (!file) return;
        const result = validateBackup(await file.text());
        if (!result.ok) {
          out.innerHTML = html`<div class="notice warn"><p><strong>This backup cannot be imported.</strong> Your current data has not been changed.</p><ul>${result.errors.map((x) => html`<li>${x}</li>`)}</ul></div>`.s;
          return;
        }
        const s = result.summary;
        const ok = await confirmDialog({
          title: 'Replace your current data?',
          bodyHtml: html`<p>The backup${s.exportedAt ? ` from ${new Date(s.exportedAt).toLocaleDateString()}` : ''} contains <strong>${s.answers} answers, ${s.journal} journal entries and ${s.snapshots} history snapshots</strong>.</p>
            <p>Importing it will <strong>replace</strong> everything currently in the app (${counts}). This cannot be undone.</p>`.s,
          confirm: 'Replace with backup',
          danger: true,
        });
        if (!ok) {
          out.innerHTML = '<p class="muted">Import cancelled. Nothing was changed.</p>';
          return;
        }
        try {
          await replaceAll(result.data);
          toast('Backup restored');
          location.hash = '#/atlas';
        } catch (err) {
          out.innerHTML = html`<div class="notice warn">The import failed and was rolled back: ${String(err.message || err)}</div>`.s;
        }
      });

      $$('input[name="motion"]', root).forEach((r) =>
        r.addEventListener('change', async () => {
          await setMeta('motion', r.value);
          window.dispatchEvent(new Event('motionchange'));
          toast('Motion preference saved');
        })
      );

      $('#delete-all', root).addEventListener('click', async () => {
        const first = await confirmDialog({
          title: 'Delete all data?',
          body: 'This erases every answer, journal entry, history snapshot and setting on this device. If you have not exported a backup, it cannot be recovered.',
          confirm: 'Continue',
          danger: true,
        });
        if (!first) return;
        const second = await confirmDialog({
          title: 'Are you certain?',
          body: 'This is permanent.',
          confirm: 'Delete everything',
          danger: true,
          typeToConfirm: 'DELETE',
        });
        if (!second) return;
        await deleteAll();
        toast('All data deleted');
        location.hash = '#/threshold';
      });
    },
  };
}

export { alertDialog };
