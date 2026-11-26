// Scoring engine: turns answers into an interpretive profile.
// Pure functions only (no browser APIs), so it can be unit-tested in Node.
//
// For each dimension we track separately:
//   coverage   share of the dimension's relevant questions that have been answered
//   position   confidence-weighted direction of positional answers, -1 (pole A) .. +1 (pole B).
//              Normalized only over answered, positional questions; unanswered questions
//              never pull the score toward the centre.
//   conviction average confidence of the positional answers (0.3 .. 1)
//   tension    how strongly answers pull in opposite directions (0 .. 1)
//   uncertain  answers of "I'm genuinely uncertain"
//   beyond     answers that step outside the spectrum's framing
// and derive a status:
//   insufficient | uncertain | beyond | competing | mixed | middle | leaning | strong

import { DIMENSIONS } from '../content/dimensions.js';
import { ALL_QUESTIONS, REALMS, UNCERTAIN, NONE_FIT } from '../content/realms.js';

export const CONFIDENCE = { certain: 1, leaning: 0.6, unsure: 0.3 };
export const MAX_WEIGHT = 2;
export const LEAN_THRESHOLD = 0.2; // |position| below this reads as a middle position
export const STRONG_THRESHOLD = 0.6;

// Which questions bear on which dimension (any option weights it or steps beyond it).
export const RELEVANT = Object.fromEntries(
  DIMENSIONS.map((dim) => [
    dim.id,
    ALL_QUESTIONS.filter((q) => q.options.some((op) => dim.id in op.d || op.x.includes(dim.id))).map((q) => q.id),
  ])
);

const QMAP = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));

export function isValidChoice(qid, choice) {
  const q = QMAP[qid];
  if (!q) return false;
  if (choice === UNCERTAIN || choice === NONE_FIT) return true;
  return Number.isInteger(choice) && choice >= 0 && choice < q.options.length;
}

function confOf(a) {
  return CONFIDENCE[a.confidence] ?? CONFIDENCE.leaning;
}

export function scoreDimension(dimId, answers) {
  const relevant = RELEVANT[dimId];
  const r = {
    id: dimId,
    relevantTotal: relevant.length,
    answered: 0,
    positional: 0,
    silent: 0,
    uncertain: 0,
    noneFit: 0,
    beyond: 0,
    beyondPositions: [],
    pull: { a: 0, b: 0 },
    position: null,
    conviction: 0,
    tension: 0,
    coverage: 0,
    contributions: [],
    status: 'insufficient',
  };
  let sumWC = 0;
  let sumC = 0;
  for (const qid of relevant) {
    const a = answers[qid];
    if (!a || !isValidChoice(qid, a.choice)) continue;
    r.answered++;
    if (a.choice === UNCERTAIN) {
      r.uncertain++;
      r.contributions.push({ qid, kind: 'uncertain' });
      continue;
    }
    if (a.choice === NONE_FIT) {
      r.noneFit++;
      r.contributions.push({ qid, kind: 'none' });
      continue;
    }
    const op = QMAP[qid].options[a.choice];
    if (op.x.includes(dimId)) {
      r.beyond++;
      for (const p of op.p) if (!r.beyondPositions.includes(p)) r.beyondPositions.push(p);
      r.contributions.push({ qid, kind: 'beyond', option: a.choice });
      continue;
    }
    if (!(dimId in op.d)) {
      r.silent++;
      r.contributions.push({ qid, kind: 'silent', option: a.choice });
      continue;
    }
    const w = op.d[dimId];
    const c = confOf(a);
    r.positional++;
    sumWC += w * c;
    sumC += c;
    if (w > 0) r.pull.b += w * c;
    if (w < 0) r.pull.a += -w * c;
    r.contributions.push({ qid, kind: 'weight', option: a.choice, weight: w, confidence: a.confidence, effect: w * c });
  }
  r.coverage = relevant.length ? r.answered / relevant.length : 0;
  if (r.positional > 0) {
    r.position = sumWC / (MAX_WEIGHT * sumC);
    r.conviction = sumC / r.positional;
    const hi = Math.max(r.pull.a, r.pull.b);
    r.tension = hi > 0 ? Math.min(r.pull.a, r.pull.b) / hi : 0;
  }
  r.status = classify(r);
  return r;
}

export function classify(r) {
  const informative = r.positional + r.uncertain + r.beyond;
  if (informative < 2) return 'insufficient';
  if (r.beyond > r.positional && r.beyond >= r.uncertain) return 'beyond';
  if (r.uncertain > r.positional && r.uncertain >= r.beyond) return 'uncertain';
  if (r.positional === 0) return r.beyond >= r.uncertain ? 'beyond' : 'uncertain';
  if (r.tension >= 0.5 && r.pull.a >= 1.5 && r.pull.b >= 1.5) return 'competing';
  if (r.tension >= 0.5 && r.pull.a > 0 && r.pull.b > 0) return 'mixed';
  if (Math.abs(r.position) < LEAN_THRESHOLD) return 'middle';
  if (Math.abs(r.position) >= STRONG_THRESHOLD && r.conviction >= 0.75) return 'strong';
  return 'leaning';
}

// Which side a leaning/strong dimension points to: 'a', 'b' or null.
export function sideOf(d) {
  if (!d || (d.status !== 'leaning' && d.status !== 'strong')) return null;
  return d.position < 0 ? 'a' : 'b';
}

// Weight given to a position from an "also resonates" secondary answer. Deliberately small:
// secondary answers never move a spectrum, and alone cannot make a position "resonant".
export const ALSO_WEIGHT = 0.3;

export function validAlso(qid, also, choice) {
  const q = QMAP[qid];
  return (
    Array.isArray(also) &&
    also.length <= (q?.options.length ?? 0) &&
    new Set(also).size === also.length &&
    also.every((i) => Number.isInteger(i) && i >= 0 && i < q.options.length && i !== choice)
  );
}

export function scorePositions(answers) {
  const acc = {};
  const add = (p, qid, w, primary) => {
    acc[p] ??= { id: p, score: 0, count: 0, questions: [] };
    acc[p].score += w;
    if (primary) acc[p].count++;
    if (!acc[p].questions.includes(qid)) acc[p].questions.push(qid);
  };
  for (const [qid, a] of Object.entries(answers)) {
    if (!isValidChoice(qid, a.choice)) continue;
    if (typeof a.choice === 'number') for (const p of QMAP[qid].options[a.choice].p) add(p, qid, confOf(a), true);
    if (a.also && validAlso(qid, a.also, a.choice)) {
      for (const i of a.also) for (const p of QMAP[qid].options[i].p) add(p, qid, ALSO_WEIGHT, false);
    }
  }
  return Object.values(acc).sort((x, y) => y.score - x.score || y.count - x.count);
}

// Positions with enough support to mention: two answers, or one answered with certainty.
export function resonantPositions(answers, limit = 6) {
  return scorePositions(answers)
    .filter((p) => p.count >= 2 || p.score >= 1)
    .slice(0, limit);
}

export function realmProgress(answers) {
  return Object.fromEntries(
    REALMS.map((r) => {
      const answered = r.questions.filter((q) => answers[q.id] && isValidChoice(q.id, answers[q.id].choice)).length;
      return [r.id, { answered, total: r.questions.length, fraction: answered / r.questions.length }];
    })
  );
}

export function computeProfile(answers) {
  const dims = Object.fromEntries(DIMENSIONS.map((d) => [d.id, scoreDimension(d.id, answers)]));
  const realms = realmProgress(answers);
  const totalAnswered = Object.values(realms).reduce((s, r) => s + r.answered, 0);
  const realmsTouched = Object.values(realms).filter((r) => r.answered > 0).length;
  const realmsComplete = Object.values(realms).filter((r) => r.answered === r.total).length;
  return {
    dims,
    realms,
    totalAnswered,
    realmsTouched,
    realmsComplete,
    positions: resonantPositions(answers),
    allPositions: scorePositions(answers),
  };
}

// A compact, storable summary of a profile for the Evolution history.
export function snapshotOf(profile, date) {
  return {
    date,
    totalAnswered: profile.totalAnswered,
    dims: Object.fromEntries(
      Object.values(profile.dims).map((d) => [
        d.id,
        {
          position: d.position === null ? null : Math.round(d.position * 1000) / 1000,
          status: d.status,
          conviction: Math.round(d.conviction * 100) / 100,
          tension: Math.round(d.tension * 100) / 100,
          coverage: Math.round(d.coverage * 100) / 100,
        },
      ])
    ),
    positions: profile.positions.slice(0, 5).map((p) => p.id),
  };
}

export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const STATUS_LABEL = {
  insufficient: 'Not enough answers yet',
  uncertain: 'Genuinely uncertain',
  beyond: 'Beyond this spectrum',
  competing: 'Strongly held competing views',
  mixed: 'Pulled both ways',
  middle: 'A middle position',
  leaning: 'Leaning',
  strong: 'Clearly held',
};
