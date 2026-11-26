// Rule engine for Challenge My Universe. Pure functions.
import { CHALLENGES } from '../content/challenges.js';
import { DIM_BY_ID } from '../content/dimensions.js';
import { sideOf } from './scoring.js';

const ORDER = { tension: 0, counter: 1, perspective: 2, thought: 3, reflect: 4 };

export function evaluate(cond, ctx) {
  if (Array.isArray(cond)) return cond.every((c) => evaluate(c, ctx));
  if (cond.all) return cond.all.every((c) => evaluate(c, ctx));
  if (cond.any) return cond.any.some((c) => evaluate(c, ctx));
  if (cond.not) return !evaluate(cond.not, ctx);
  if ('q' in cond) {
    const a = ctx.answers[cond.q];
    return !!a && cond.is.includes(a.choice);
  }
  if ('dim' in cond) {
    const d = ctx.profile.dims[cond.dim];
    const side = sideOf(d);
    if (!side) return false;
    if ('gte' in cond) return d.position >= cond.gte;
    if ('lte' in cond) return d.position <= cond.lte;
    return false;
  }
  if ('status' in cond) return cond.in.includes(ctx.profile.dims[cond.status]?.status);
  if ('pos' in cond) return ctx.profile.positions.some((p) => p.id === cond.pos);
  if ('explored' in cond) return (ctx.profile.realms[cond.explored]?.answered ?? 0) >= (cond.min ?? 1);
  if ('anyStatus' in cond) return Object.values(ctx.profile.dims).some((d) => d.status === cond.anyStatus);
  throw new Error('Unknown challenge condition: ' + JSON.stringify(cond));
}

function fill(text, card, ctx) {
  if (!text.includes('{dims}')) return text;
  const status = card.when.anyStatus;
  const names = Object.values(ctx.profile.dims)
    .filter((d) => d.status === status)
    .map((d) => DIM_BY_ID[d.id].name);
  return text.replace('{dims}', names.join(', '));
}

export function activeChallenges(answers, profile) {
  const ctx = { answers, profile };
  return CHALLENGES.filter((c) => evaluate(c.when, ctx))
    .map((c) => ({ ...c, body: c.body.map((p) => fill(p, c, ctx)) }))
    .sort((x, y) => ORDER[x.type] - ORDER[y.type]);
}

export const TYPE_LABEL = {
  tension: 'Tension',
  counter: 'Counterargument',
  perspective: 'Another perspective',
  thought: 'Thought experiment',
  reflect: 'Reflection',
};
