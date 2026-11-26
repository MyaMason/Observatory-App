// App bootstrap: storage, router, navigation chrome, offline readiness, install and motion.
import { init, state, subscribe, getMeta, requestPersistence } from './store.js';
import { $, $$, toast } from './ui/dom.js';
import { startStarfield, setStill } from './ui/starfield.js';
import { threshold, observatory, chamber, question } from './views/explore.js';
import { atlas, portraitView, dimensionView } from './views/atlas.js';
import { challenges, challengeDetail } from './views/challenges.js';
import { journal, journalEditor } from './views/journal.js';
import { evolution } from './views/evolution.js';
import { archive, appStatus } from './views/archive.js';
import { REALM_BY_ID } from './content/realms.js';

const ROUTES = [
  [/^\/threshold$/, () => threshold()],
  [/^\/observatory$/, () => observatory()],
  [/^\/realm\/([a-z]+)$/, (m) => chamber({ realmId: m[1] })],
  [/^\/realm\/([a-z]+)\/([a-z]\d)$/, (m) => question({ realmId: m[1], qid: m[2] })],
  [/^\/atlas$/, () => atlas()],
  [/^\/atlas\/portrait$/, () => portraitView()],
  [/^\/atlas\/([a-z]+)$/, (m) => dimensionView({ dimId: m[1] })],
  [/^\/challenges$/, () => challenges()],
  [/^\/challenges\/([a-z0-9-]+)$/, (m) => challengeDetail({ id: m[1] })],
  [/^\/journal$/, () => journal()],
  [/^\/journal\/new$/, (m, q) => journalEditor({ id: null, query: q })],
  [/^\/journal\/([A-Za-z0-9-]+)$/, (m, q) => journalEditor({ id: m[1], query: q })],
  [/^\/evolution$/, () => evolution()],
  [/^\/archive$/, () => archive()],
];

const TAB_FOR = (path) =>
  path.startsWith('/realm') || path === '/observatory' ? 'observatory'
  : path.startsWith('/atlas') ? 'atlas'
  : path.startsWith('/challenges') ? 'challenges'
  : path.startsWith('/journal') ? 'journal'
  : path.startsWith('/evolution') ? 'evolution'
  : null;

let cleanup = null;
let updateRequested = false;
let lastPath = null;

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [pathWithAnchor, qs = ''] = raw.split('?');
  const [path, anchor] = pathWithAnchor.split('#');
  return { path, anchor, query: new URLSearchParams(qs) };
}

function render({ keepScroll = false } = {}) {
  let { path, anchor, query } = parseHash();
  if (path === '/' || path === '') {
    location.replace(getMeta('introSeen', false) ? '#/observatory' : '#/threshold');
    return;
  }
  let view = null;
  for (const [re, fn] of ROUTES) {
    const m = path.match(re);
    if (m) {
      view = fn(m, query);
      break;
    }
  }
  if (!view) {
    view = {
      title: 'Lost among the stars',
      html: { s: `<section class="page"><h1>Lost among the stars</h1><p>This page does not exist.</p><a class="btn btn-primary" href="#/observatory">Return to the Observatory</a></section>` },
    };
  }
  if (typeof cleanup === 'function') cleanup();
  const root = $('#view');
  const samePage = path === lastPath;
  root.innerHTML = view.html.s ?? String(view.html);
  document.title = `${view.title} · The Metaphysical Observatory`;
  document.body.classList.toggle('no-chrome', view.chrome === false);
  const realm = view.realm ? REALM_BY_ID[view.realm] : null;
  document.body.dataset.realm = realm?.id ?? '';
  document.documentElement.style.setProperty('--realm-accent', realm?.accent ?? 'var(--gold)');
  const tab = TAB_FOR(path);
  $$('.tabbar a').forEach((a) => (a.dataset.tab === tab ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  cleanup = view.mount?.(root) ?? null;
  if (!samePage || !keepScroll) {
    if (anchor) document.getElementById(anchor)?.scrollIntoView();
    else window.scrollTo(0, 0);
    // Move focus to the page heading so screen readers announce the new page.
    const h1 = root.querySelector('h1');
    if (h1 && !samePage) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
    root.classList.remove('enter');
    void root.offsetWidth;
    root.classList.add('enter');
  }
  lastPath = path;
}

// ── Motion preference ──
function applyMotion() {
  const pref = getMeta('motion', 'system');
  const systemReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduced = pref === 'reduced' || (pref === 'system' && systemReduced);
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  setStill(reduced);
}

// ── Offline readiness: only claim "ready" once every listed file is in the cache ──
async function checkOffline(announce = true) {
  if (!('serviceWorker' in navigator) || !('caches' in self)) {
    appStatus.offline = 'unsupported';
    return;
  }
  try {
    await navigator.serviceWorker.ready;
    // caches.has first: caches.open would silently create an empty cache under an old name.
    const missing = [];
    if (!(await caches.has(self.OBSERVATORY_CACHE))) {
      appStatus.offline = 'not-ready';
      return;
    }
    const cache = await caches.open(self.OBSERVATORY_CACHE);
    for (const url of self.OBSERVATORY_ASSETS) if (!(await cache.match(new URL(url, location.href).href, { ignoreSearch: true }))) missing.push(url);
    const was = appStatus.offline;
    appStatus.offline = missing.length ? 'not-ready' : 'ready';
    if (missing.length) console.info('Offline cache incomplete:', missing);
    const el = $('#offline-status');
    if (el) {
      el.textContent = appStatus.offline === 'ready' ? 'Ready for offline use. Every file the app needs is saved on this device.' : el.textContent;
      el.className = `status-line status-${appStatus.offline}`;
    }
    if (announce && appStatus.offline === 'ready' && was !== 'ready' && !localStorage.getItem('offlineAnnounced')) {
      localStorage.setItem('offlineAnnounced', '1');
      toast('The Observatory is now ready for offline use', { icon: '☾' });
    }
  } catch (e) {
    appStatus.offline = 'not-ready';
  }
}

function registerSW() {
  if (!('serviceWorker' in navigator)) {
    appStatus.offline = 'unsupported';
    return;
  }
  navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((reg) => {
    const offerUpdate = () => {
      if (!reg.waiting || !navigator.serviceWorker.controller) return;
      const bar = $('#update-bar');
      bar.hidden = false;
      $('#update-btn').onclick = () => {
        updateRequested = true;
        reg.waiting?.postMessage('skipWaiting');
      };
    };
    offerUpdate();
    reg.addEventListener('updatefound', () => {
      reg.installing?.addEventListener('statechange', () => {
        offerUpdate();
        checkOffline();
      });
    });
  });
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data === 'cached') checkOffline();
  });
  // Reload only when the user asked for a new edition, never on the first install.
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !updateRequested) return;
    reloading = true;
    location.reload();
  });
  checkOffline();
}

function detectPlatform() {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  appStatus.platform = iOS ? 'ios' : /Android/.test(ua) ? 'android' : 'other';
  appStatus.standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

async function boot() {
  detectPlatform();
  appStatus.version = self.OBSERVATORY_VERSION ?? '';
  startStarfield($('#stars'));
  await init();
  applyMotion();
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', applyMotion);
  window.addEventListener('motionchange', applyMotion);

  window.addEventListener('hashchange', () => render());
  window.addEventListener('rerender', () => render({ keepScroll: true }));
  subscribe((what) => {
    if (what === 'all') render();
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    appStatus.installPrompt = e;
    if (['/observatory', '/archive'].includes(parseHash().path)) render({ keepScroll: true });
  });
  window.addEventListener('appinstalled', () => {
    appStatus.installPrompt = null;
    toast('The Observatory has been installed');
  });
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-install]');
    if (!b || !appStatus.installPrompt) return;
    appStatus.installPrompt.prompt();
    await appStatus.installPrompt.userChoice.catch(() => null);
    appStatus.installPrompt = null;
    render({ keepScroll: true });
  });

  render();
  registerSW();
  requestPersistence().then((r) => (appStatus.persistence = r));
  $('#app').removeAttribute('aria-busy');
}

boot();
