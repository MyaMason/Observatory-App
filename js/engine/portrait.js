// Generates "Your Philosophical Portrait" from predefined fragments.
// Only statements supported by the user's answers are included.
import { DIMENSIONS, DIM_BY_ID } from '../content/dimensions.js';
import { REALMS } from '../content/realms.js';
import { POSITIONS } from '../content/positions.js';
import { DIM_SENTENCES, STATUS_SENTENCES, THEMES, PATTERNS, FRAMING } from '../content/portrait.js';
import { sideOf } from './scoring.js';

const MIN_ANSWERS = 5;

function fmt(t, vars) {
  return t.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

function listJoin(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

export function dimensionSentence(d) {
  const dim = DIM_BY_ID[d.id];
  const side = sideOf(d);
  if (side) {
    const key = side + (d.status === 'strong' ? 'Strong' : 'Lean');
    let s = DIM_SENTENCES[d.id][key];
    if (d.beyond > 0 && d.beyondPositions.length) {
      s += ` Some answers also step outside this framing, toward ${listJoin(d.beyondPositions.map((p) => POSITIONS[p]?.name.toLowerCase() ?? p))}.`;
    }
    return s;
  }
  const tpl = STATUS_SENTENCES[d.status];
  if (!tpl) return null;
  const positions =
    d.status === 'beyond' && d.beyondPositions.length
      ? `, toward ideas such as ${listJoin(d.beyondPositions.map((p) => POSITIONS[p]?.name.toLowerCase() ?? p))}`
      : '';
  return fmt(tpl, { name: dim.name.toLowerCase(), a: dim.a.label.toLowerCase(), b: dim.b.label.toLowerCase(), positions });
}

export function buildPortrait(profile, activeCards = []) {
  const n = profile.totalAnswered;
  if (n < MIN_ANSWERS) {
    return {
      developing: true,
      sections: [{ kind: 'intro', paragraphs: [fmt(FRAMING.developing, { n, s: n === 1 ? '' : 's' })] }],
    };
  }

  const sections = [];
  const full = profile.realmsTouched === REALMS.length;
  sections.push({
    kind: 'intro',
    paragraphs: [fmt(full ? FRAMING.openingFull : FRAMING.openingPartial, { n, r: profile.realmsTouched })],
  });

  // Recurring cross-realm patterns.
  const patterns = PATTERNS.filter((p) => p.when.every(([dim, side]) => sideOf(profile.dims[dim]) === side)).map((p) => p.text);
  const beyondCount = Object.values(profile.dims).filter((d) => d.status === 'beyond' || d.beyond >= 2).length;
  if (beyondCount >= 3) {
    patterns.push(
      'A striking feature of your answers is how often they decline the usual either-or framings. Across several realms you step outside the standard spectrums, which suggests a worldview organized around different categories than the familiar Western debates.'
    );
  }
  const uncertainCount = Object.values(profile.dims).filter((d) => d.status === 'uncertain').length;
  if (uncertainCount >= 3) {
    patterns.push(
      'Uncertainty is itself a recurring theme for you. On several of the largest questions you have chosen to leave the answer open rather than settle it early. That is a recognizable philosophical temperament, with roots that go back to Socrates.'
    );
  }
  if (patterns.length) sections.push({ kind: 'themes', title: 'Recurring themes', paragraphs: patterns });

  // Thematic paragraphs built from dimension sentences.
  for (const theme of THEMES) {
    const sentences = theme.dims
      .map((id) => profile.dims[id])
      .filter((d) => d.status !== 'insufficient')
      .map(dimensionSentence)
      .filter(Boolean);
    if (sentences.length) sections.push({ kind: 'theme', title: theme.title, paragraphs: [sentences.join(' ')] });
  }

  // Resonant positions and traditions.
  const resonant = profile.positions.slice(0, 5);
  if (resonant.length) {
    sections.push({
      kind: 'resonance',
      title: 'Ideas that resonate with your answers',
      paragraphs: [FRAMING.resonanceIntro],
      items: resonant.map((p) => ({ id: p.id, name: POSITIONS[p.id].name, desc: POSITIONS[p.id].desc, found: POSITIONS[p.id].found })),
    });
  }

  // Tensions.
  const tensions = [];
  for (const d of Object.values(profile.dims)) {
    if (d.status === 'competing') tensions.push(`On ${DIM_BY_ID[d.id].name.toLowerCase()}, you hold strong convictions on both sides.`);
  }
  for (const c of activeCards.filter((c) => c.type === 'tension' && c.id !== 'tension-competing-general')) {
    tensions.push(`${c.title}: ${c.body[0]}`);
  }
  if (tensions.length) sections.push({ kind: 'tensions', title: 'Interesting tensions', paragraphs: [FRAMING.tensionsIntro], items: tensions.map((t) => ({ text: t })) });

  // Areas for further exploration.
  const explore = [];
  for (const r of REALMS) {
    const pr = profile.realms[r.id];
    if (pr.answered === 0) explore.push({ text: `${r.name} is still unexplored.`, realm: r.id });
    else if (pr.answered < pr.total) explore.push({ text: `${r.name}: ${pr.total - pr.answered} question${pr.total - pr.answered === 1 ? '' : 's'} remain.`, realm: r.id });
  }
  for (const d of DIMENSIONS) {
    const s = profile.dims[d.id];
    if (s.status === 'insufficient' && s.answered > 0) explore.push({ text: `${d.name}: not yet enough answers to say where you stand.` });
    if (s.status === 'uncertain') explore.push({ text: `${d.name}: you are uncertain here. The Challenges tab has material that may help you think it through.` });
  }
  if (explore.length) sections.push({ kind: 'explore', title: 'Still to explore', paragraphs: [FRAMING.exploreIntro], items: explore });

  sections.push({ kind: 'closing', paragraphs: [FRAMING.closing] });
  return { developing: false, sections };
}
