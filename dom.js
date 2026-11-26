// Tiny rendering helpers: escaped HTML templates, toasts and accessible dialogs.

class Raw {
  constructor(s) {
    this.s = s;
  }
  toString() {
    return this.s;
  }
}
export const raw = (s) => new Raw(String(s));

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

function render(v) {
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(render).join('');
  if (v === null || v === undefined || v === false) return '';
  return esc(v);
}

export function html(strings, ...vals) {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < vals.length) out += render(vals[i]);
  });
  return raw(out);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ── Toasts (announced to screen readers) ──
let toastTimer;
export function toast(message, { icon = '✦' } = {}) {
  const el = $('#toast');
  el.innerHTML = `<span class="toast-icon" aria-hidden="true">${esc(icon)}</span><span>${esc(message)}</span>`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

// ── Dialogs ──
// confirmDialog({title, body, confirm, cancel, danger, typeToConfirm}) → Promise<boolean>
export function confirmDialog({ title, body, confirm = 'Confirm', cancel = 'Cancel', danger = false, typeToConfirm = null, bodyHtml = null }) {
  return new Promise((resolve) => {
    const dlg = document.createElement('dialog');
    dlg.className = 'dialog';
    dlg.setAttribute('aria-labelledby', 'dlg-title');
    dlg.innerHTML = html`
      <form method="dialog" class="dialog-inner">
        <h2 id="dlg-title" class="dialog-title">${title}</h2>
        <div class="dialog-body">${bodyHtml ? raw(bodyHtml) : html`<p>${body}</p>`}</div>
        ${typeToConfirm
          ? html`<label class="field"><span>Type <strong>${typeToConfirm}</strong> to confirm</span>
              <input name="typed" autocomplete="off" autocapitalize="characters" spellcheck="false" /></label>`
          : ''}
        <div class="dialog-actions">
          <button value="cancel" class="btn btn-ghost">${cancel}</button>
          <button value="ok" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" ${typeToConfirm ? raw('disabled') : ''}>${confirm}</button>
        </div>
      </form>`.s;
    document.body.append(dlg);
    const okBtn = dlg.querySelector('button[value="ok"]');
    const input = dlg.querySelector('input[name="typed"]');
    if (input) input.addEventListener('input', () => (okBtn.disabled = input.value.trim().toUpperCase() !== typeToConfirm));
    dlg.addEventListener('close', () => {
      resolve(dlg.returnValue === 'ok' && (!input || input.value.trim().toUpperCase() === typeToConfirm));
      dlg.remove();
    });
    dlg.showModal();
    (input ?? dlg.querySelector('button[value="cancel"]')).focus();
  });
}

export function alertDialog({ title, bodyHtml, close = 'Close' }) {
  return new Promise((resolve) => {
    const dlg = document.createElement('dialog');
    dlg.className = 'dialog';
    dlg.setAttribute('aria-labelledby', 'dlg-title');
    dlg.innerHTML = `<form method="dialog" class="dialog-inner"><h2 id="dlg-title" class="dialog-title">${esc(title)}</h2>
      <div class="dialog-body">${bodyHtml}</div>
      <div class="dialog-actions"><button value="ok" class="btn btn-primary">${esc(close)}</button></div></form>`;
    document.body.append(dlg);
    dlg.addEventListener('close', () => (dlg.remove(), resolve()));
    dlg.showModal();
  });
}

export function debounce(fn, ms) {
  let t;
  const d = (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
  d.flush = (...a) => {
    clearTimeout(t);
    fn(...a);
  };
  return d;
}

export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
export function formatShortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
