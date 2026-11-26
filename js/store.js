// Local persistence (IndexedDB) plus an in-memory mirror for fast rendering.
// Every change is written to IndexedDB immediately. If IndexedDB is unavailable
// (for example in some private-browsing modes), the app keeps working in memory
// and tells the user that nothing will be saved.
import { computeProfile, snapshotOf, localDateKey } from './engine/scoring.js';

const DB_NAME = 'metaphysical-observatory';
const DB_VERSION = 1;
const STORES = ['answers', 'journal', 'snapshots', 'meta'];
const KEYS = { answers: 'qid', journal: 'id', snapshots: 'date', meta: 'key' };

let db = null;
export const state = {
  persistent: true, // false if IndexedDB failed
  answers: {},
  journal: [],
  snapshots: [],
  meta: {},
  profile: computeProfile({}),
};
const listeners = new Set();
export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));
const emit = (what) => listeners.forEach((fn) => fn(what));

function req(r) {
  return new Promise((res, rej) => {
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function txDone(tx) {
  return new Promise((res, rej) => {
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
    tx.onabort = () => rej(tx.error || new Error('Transaction aborted'));
  });
}

function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in self)) return reject(new Error('IndexedDB not supported'));
    const r = indexedDB.open(DB_NAME, DB_VERSION);
    r.onupgradeneeded = () => {
      const d = r.result;
      for (const s of STORES) if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: KEYS[s] });
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.onblocked = () => reject(new Error('Database blocked by another open tab'));
  });
}

async function getAll(store) {
  const tx = db.transaction(store, 'readonly');
  return req(tx.objectStore(store).getAll());
}

async function put(store, value) {
  if (!db) return;
  const tx = db.transaction(store, 'readwrite');
  tx.objectStore(store).put(value);
  await txDone(tx);
}

async function del(store, key) {
  if (!db) return;
  const tx = db.transaction(store, 'readwrite');
  tx.objectStore(store).delete(key);
  await txDone(tx);
}

export async function init() {
  try {
    db = await openDB();
    const [answers, journal, snapshots, meta] = await Promise.all(STORES.map(getAll));
    state.answers = Object.fromEntries(answers.map((a) => [a.qid, a]));
    state.journal = journal;
    state.snapshots = snapshots.sort((a, b) => a.date.localeCompare(b.date));
    state.meta = Object.fromEntries(meta.map((m) => [m.key, m.value]));
  } catch (e) {
    console.warn('Storage unavailable, running in memory only:', e);
    db = null;
    state.persistent = false;
  }
  recompute();
}

function recompute() {
  state.profile = computeProfile(state.answers);
}

// ── Settings / meta ──
export function getMeta(key, fallback = null) {
  return key in state.meta ? state.meta[key] : fallback;
}
export async function setMeta(key, value) {
  state.meta[key] = value;
  await put('meta', { key, value });
  emit('meta');
}

// ── Answers ──
export async function saveAnswer(qid, patch) {
  const prev = state.answers[qid] ?? { qid, choice: null, confidence: 'leaning', why: '' };
  const next = { ...prev, ...patch, qid, updated: Date.now() };
  state.answers[qid] = next;
  await put('answers', next);
  const positionalChange = 'choice' in patch || 'confidence' in patch;
  recompute();
  if (positionalChange) await maybeSnapshot();
  emit('answers');
  return next;
}

// History rule (approved plan): the first snapshot is saved once the user completes
// their first realm; after that, one snapshot per calendar day on which answers change.
// A later change on the same day overwrites that day's snapshot with the latest state.
async function maybeSnapshot(now = new Date()) {
  if (state.profile.realmsComplete < 1) return;
  const snap = snapshotOf(state.profile, localDateKey(now));
  const i = state.snapshots.findIndex((s) => s.date === snap.date);
  if (i >= 0) state.snapshots[i] = snap;
  else state.snapshots.push(snap);
  state.snapshots.sort((a, b) => a.date.localeCompare(b.date));
  await put('snapshots', snap);
}

// ── Journal ──
function uid() {
  return (crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2));
}
export async function saveJournal(entry) {
  const now = Date.now();
  const e = entry.id ? { ...entry, updated: now } : { ...entry, id: uid(), created: now, updated: now };
  const i = state.journal.findIndex((j) => j.id === e.id);
  if (i >= 0) state.journal[i] = e;
  else state.journal.push(e);
  await put('journal', e);
  emit('journal');
  return e;
}
export async function deleteJournal(id) {
  state.journal = state.journal.filter((j) => j.id !== id);
  await del('journal', id);
  emit('journal');
}

// ── Backup ──
export function exportData() {
  return {
    answers: Object.values(state.answers),
    journal: state.journal,
    snapshots: state.snapshots,
    meta: state.meta,
  };
}

// Replace everything atomically (one transaction). Only called after validation and confirmation.
export async function replaceAll(data) {
  if (db) {
    const tx = db.transaction(STORES, 'readwrite');
    for (const s of STORES) tx.objectStore(s).clear();
    for (const a of data.answers) tx.objectStore('answers').put(a);
    for (const j of data.journal) tx.objectStore('journal').put(j);
    for (const s of data.snapshots) tx.objectStore('snapshots').put(s);
    for (const [key, value] of Object.entries(data.meta ?? {})) tx.objectStore('meta').put({ key, value });
    await txDone(tx);
  }
  state.answers = Object.fromEntries(data.answers.map((a) => [a.qid, a]));
  state.journal = [...data.journal];
  state.snapshots = [...data.snapshots].sort((a, b) => a.date.localeCompare(b.date));
  state.meta = { ...(data.meta ?? {}) };
  recompute();
  emit('all');
}

export async function deleteAll() {
  if (db) {
    const tx = db.transaction(STORES, 'readwrite');
    for (const s of STORES) tx.objectStore(s).clear();
    await txDone(tx);
  }
  try {
    localStorage.clear();
  } catch {}
  state.answers = {};
  state.journal = [];
  state.snapshots = [];
  state.meta = {};
  recompute();
  emit('all');
}

export async function requestPersistence() {
  try {
    if (!navigator.storage?.persist) return 'unsupported';
    if (await navigator.storage.persisted()) return 'granted';
    return (await navigator.storage.persist()) ? 'granted' : 'denied';
  } catch {
    return 'unsupported';
  }
}
