// Backup file format and validation. Pure functions.
// An import is fully validated BEFORE any stored data is touched.
import { isValidChoice, validAlso, CONFIDENCE } from './scoring.js';
import { REALM_BY_ID } from '../content/realms.js';
import { DIM_BY_ID } from '../content/dimensions.js';

export const APP_TAG = 'metaphysical-observatory';
export const BACKUP_VERSION = 1;
const MAX_BYTES = 10 * 1024 * 1024;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function makeBackup({ answers, journal, snapshots, meta }) {
  return {
    app: APP_TAG,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    answers,
    journal,
    snapshots,
    meta,
  };
}

const isStr = (v, max = 100000) => typeof v === 'string' && v.length <= max;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isDate = (v) => typeof v === 'string' && DATE_RE.test(v) && !Number.isNaN(Date.parse(v));

export function validateBackup(text) {
  const errors = [];
  if (typeof text !== 'string' || text.length > MAX_BYTES) return { ok: false, errors: ['The file is empty or too large.'] };
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, errors: ['This file is not a valid backup (it could not be read as JSON).'] };
  }
  if (!data || typeof data !== 'object' || data.app !== APP_TAG) {
    return { ok: false, errors: ['This file does not appear to be a Metaphysical Observatory backup.'] };
  }
  if (data.version !== BACKUP_VERSION) errors.push(`Unsupported backup version (${data.version}).`);
  for (const key of ['answers', 'journal', 'snapshots']) {
    if (!Array.isArray(data[key])) errors.push(`Missing or invalid “${key}” section.`);
  }
  if (errors.length) return { ok: false, errors };

  const seenQ = new Set();
  data.answers.forEach((a, i) => {
    const where = `Answer ${i + 1}`;
    if (!a || typeof a !== 'object') return errors.push(`${where} is malformed.`);
    if (seenQ.has(a.qid)) errors.push(`${where} duplicates question ${a.qid}.`);
    seenQ.add(a.qid);
    if (!(a.choice === null && typeof a.why === 'string' && isValidChoice(a.qid, 0)) && !isValidChoice(a.qid, a.choice)) errors.push(`${where} has an unknown question or answer (${a.qid}).`);
    if (!(a.confidence in CONFIDENCE)) errors.push(`${where} has an invalid confidence level.`);
    if (a.why != null && !isStr(a.why, 20000)) errors.push(`${where} has invalid reasoning text.`);
    if (a.updated != null && !isNum(a.updated)) errors.push(`${where} has an invalid timestamp.`);
    if (a.also != null && !validAlso(a.qid, a.also, a.choice)) errors.push(`${where} has an invalid “also resonates” list.`);
  });

  const seenJ = new Set();
  data.journal.forEach((j, i) => {
    const where = `Journal entry ${i + 1}`;
    if (!j || typeof j !== 'object') return errors.push(`${where} is malformed.`);
    if (!isStr(j.id, 100) || !j.id) errors.push(`${where} has no valid id.`);
    if (seenJ.has(j.id)) errors.push(`${where} has a duplicate id.`);
    seenJ.add(j.id);
    if (!isStr(j.title ?? '', 500)) errors.push(`${where} has an invalid title.`);
    if (!isDate(j.date)) errors.push(`${where} has an invalid date.`);
    if (!isStr(j.text, 200000)) errors.push(`${where} has invalid text.`);
    if (j.realm != null && !REALM_BY_ID[j.realm]) errors.push(`${where} refers to an unknown realm.`);
  });

  const seenS = new Set();
  data.snapshots.forEach((s, i) => {
    const where = `History snapshot ${i + 1}`;
    if (!s || typeof s !== 'object') return errors.push(`${where} is malformed.`);
    if (!isDate(s.date)) errors.push(`${where} has an invalid date.`);
    if (seenS.has(s.date)) errors.push(`${where} duplicates the date ${s.date}.`);
    seenS.add(s.date);
    if (!s.dims || typeof s.dims !== 'object') return errors.push(`${where} has no dimension data.`);
    for (const [k, v] of Object.entries(s.dims)) {
      if (!DIM_BY_ID[k]) errors.push(`${where} refers to an unknown dimension.`);
      else if (!v || (v.position !== null && !(isNum(v.position) && v.position >= -1 && v.position <= 1))) errors.push(`${where} has an invalid score.`);
    }
  });

  if (data.meta != null && typeof data.meta !== 'object') errors.push('Settings section is malformed.');
  if (errors.length) return { ok: false, errors: errors.slice(0, 8).concat(errors.length > 8 ? [`…and ${errors.length - 8} more problems.`] : []) };

  return {
    ok: true,
    data,
    summary: {
      answers: data.answers.length,
      journal: data.journal.length,
      snapshots: data.snapshots.length,
      exportedAt: data.exportedAt,
    },
  };
}
