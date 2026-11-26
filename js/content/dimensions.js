// The eight interpretive dimensions.
// Each is a spectrum between pole A (negative weights) and pole B (positive weights).
// Answers can also step "beyond" a spectrum when they reject its framing
// (for example, idealism on the physicalism-dualism spectrum).
//
// `related` lists positions that bear on a spectrum's subject but are deliberately NOT
// scored on it (for example agnosticism, which concerns knowledge rather than belief).
// The dimension page shows any of these the user's answers resonate with, under
// "Recorded separately," so they are acknowledged without being forced onto the dial.

export const DIMENSIONS = [
  {
    id: 'divine',
    name: 'The Divine',
    realm: 'divinity',
    a: { label: 'Atheism', gloss: 'there is no God or divine reality' },
    b: { label: 'Belief in the divine', gloss: 'a God or ultimate divine reality exists' },
    about:
      'This spectrum records belief: how strongly your answers affirm or deny a God or ultimate divine reality. It is not a scale of religiousness or spirituality, and it does not measure knowledge. Agnosticism (a view about what can be known) and naturalism (the further claim that nature is all there is) are recorded separately, because neither follows from a position on this dial.',
    beyondNote:
      'Some of your answers step outside this spectrum, for example by identifying the divine with nature itself, or by treating the question of a separate God as resting on a mistaken split between the divine and the world.',
  },
  {
    id: 'will',
    name: 'Freedom',
    realm: 'fate',
    a: { label: 'Determinism', gloss: 'every event, including every choice, follows from prior causes' },
    b: { label: 'Libertarian free will', gloss: 'at the moment of choice we could genuinely do otherwise' },
    about:
      'This spectrum asks whether you see choices as fixed by prior causes or as genuinely open. "Libertarian" here is a technical philosophical term about free will and has nothing to do with politics. Related but distinct ideas, such as fatalism, predestination, divine foreknowledge and an open future, are recorded separately because none of them settles this question on its own.',
    beyondNote:
      'Some of your answers step outside this spectrum. Compatibilism, for instance, holds that freedom and determinism do not conflict, so it does not sit at either end.',
  },
  {
    id: 'mind',
    name: 'Mind',
    realm: 'consciousness',
    a: { label: 'Physicalism', gloss: 'the mind is a physical process' },
    b: { label: 'Dualism', gloss: 'the mind or soul is something beyond the physical' },
    about:
      'This spectrum asks how you see the relationship between mind and matter. Many serious positions, such as idealism, panpsychism and nondualism, reject the choice between these two endpoints altogether.',
    beyondNote:
      'Some of your answers step outside this spectrum, treating consciousness as more fundamental than matter, as present throughout nature, or as not separate from reality at all.',
  },
  {
    id: 'knowing',
    name: 'Knowing',
    realm: 'truth',
    a: { label: 'Empiricism', gloss: 'knowledge comes chiefly from experience and observation' },
    b: { label: 'Rationalism', gloss: 'reason can grasp truths that experience cannot' },
    about:
      'This spectrum asks where you think real knowledge mainly comes from. Most philosophers combine both sources, and some traditions add others, such as contemplative insight, revelation or testimony.',
    beyondNote:
      'Some of your answers point to ways of knowing that are neither experience nor pure reason, such as contemplative insight or revelation.',
  },
  {
    id: 'certainty',
    name: 'Certainty',
    realm: 'truth',
    a: { label: 'Skepticism', gloss: 'we can know little or nothing for certain' },
    b: { label: 'Confidence in knowledge', gloss: 'we can know a great deal about reality' },
    about:
      'This spectrum asks how much you think humans can really know. The middle ground, fallibilism, holds that we can know a great deal while staying open to being wrong. Views about what truth is, such as realism or perspectivism, are recorded separately: believing reality exists independently of us is not the same as being confident we know it.',
    beyondNote:
      'Some of your answers treat truth as many-sided or perspective-dependent in ways that do not map neatly onto "more" or "less" certainty.',
  },
  {
    id: 'morals',
    name: 'Moral Reality',
    realm: 'morality',
    a: { label: 'Moral anti-realism', gloss: 'moral truths are made by people, not found' },
    b: { label: 'Moral realism', gloss: 'some moral truths hold regardless of opinion' },
    about:
      'This spectrum is about metaethics: whether right and wrong are features of reality we discover or something humans create. It says nothing about normative ethics, meaning which actions are right or which ethical theory you favour. Those views (duty, consequences, character, care and so on) are recorded separately, because each is compatible with either end of this spectrum.',
    beyondNote:
      'Some of your answers frame morality in ways that resist this split, for example as part of a cosmic order or as arising from relationships.',
  },
  {
    id: 'meaning',
    name: 'Meaning',
    realm: 'existence',
    a: { label: 'Constructed meaning', gloss: 'we create the meaning of our lives' },
    b: { label: 'Discovered meaning', gloss: 'meaning is built into reality, waiting to be found' },
    about:
      'This spectrum asks where the meaning of a life comes from. Many people hold that meaning is partly found and partly made.',
    beyondNote:
      'Some of your answers question whether life needs a "meaning" or "purpose" at all, as in absurdist or some Daoist and Zen outlooks.',
  },
  {
    id: 'survival',
    name: 'Continuance',
    realm: 'beyond',
    a: { label: 'Finitude', gloss: 'the person ends at death' },
    b: { label: 'Survival', gloss: 'something of the person continues after death' },
    about:
      'This spectrum asks only whether something of a person continues after death. The very different forms continuation might take (an immortal soul, bodily resurrection, reincarnation, rebirth without a fixed self, return to a greater whole, ancestral presence, or being held in God’s memory) are recorded separately as positions.',
    beyondNote:
      'Some of your answers question whether there is a fixed self that could either survive or end, as in Buddhist teaching on no-self or in views of liberation as release from individual existence.',
  },
];

const RELATED = {
  divine: {
    note: 'These bear on the divine but are not scored on this dial. Agnosticism concerns knowledge rather than belief; naturalism is a further claim that atheism does not require; a sense of the sacred does not require theism.',
    ids: ['agnosticism', 'naturalism', 'atheism', 'sense-of-the-sacred', 'meaningful-cosmos', 'argument-from-evil', 'skeptical-theism', 'soul-making', 'process-theology', 'religion-as-human-creation', 'pluralism', 'inclusivism', 'exclusivism', 'fideism', 'faith-and-reason', 'will-to-believe', 'evidentialism', 'irreducible-mystery', 'apophatic', 'classical-theism', 'deism', 'pantheism', 'panentheism', 'impersonal-absolute', 'nondualism', 'karma'],
  },
  will: {
    note: 'Determinism (prior causes fix events), fatalism (outcomes happen whatever we do), predestination (God ordains events) and divine foreknowledge (God knows events in advance) are different claims, so they are recorded separately.',
    ids: ['causal-determinism', 'fatalism', 'predestination', 'divine-foreknowledge', 'destiny', 'open-future', 'indeterminism', 'incompatibilism', 'compatibilism', 'karma', 'relational-personhood'],
  },
  mind: {
    note: 'These views about the mind and self do not, on their own, settle whether the mind is physical.',
    ids: ['hard-problem', 'functionalism', 'enduring-self', 'soul-identity', 'psychological-continuity', 'animalism', 'reductionist-self', 'no-self', 'extended-mind', 'idealism', 'panpsychism', 'nondualism'],
  },
  knowing: {
    note: 'Other sources and standards of knowledge, recorded without moving this dial.',
    ids: ['contemplative-knowing', 'revelation', 'pramana', 'pragmatism', 'fallibilism', 'verificationism', 'logical-empiricism'],
  },
  certainty: {
    note: 'Views about what truth is, rather than how much we can know.',
    ids: ['realism', 'kantian', 'perspectivism', 'anekantavada', 'epistemic-relativism', 'pragmatism', 'ineffability', 'mysterianism', 'skepticism'],
  },
  morals: {
    note: 'Normative ethics: views about what is right and what makes actions right. Each is compatible with either end of this spectrum.',
    ids: ['deontology', 'consequentialism', 'virtue-ethics', 'care-ethics', 'ross-pluralism', 'dirty-hands', 'special-obligations', 'contractualism', 'universal-compassion', 'retributivism', 'restorative-justice', 'evil-as-ignorance', 'divine-command'],
  },
  meaning: {
    note: 'Further views about meaning and a good life, recorded without moving this dial.',
    ids: ['absurdism', 'without-purpose', 'meaningful-cosmos', 'mortality-meaning', 'presence', 'logotherapy', 'eudaimonism', 'hedonism', 'liberation', 'desire-satisfaction', 'meaning-as-fit'],
  },
  survival: {
    note: 'The different forms continuation might take, recorded separately from whether something continues.',
    ids: ['immortal-soul', 'resurrection', 'reincarnation', 'rebirth', 'mergence', 'ancestor-veneration', 'objective-immortality', 'liberation', 'legacy', 'epicurean', 'memento-mori'],
  },
};
for (const d of DIMENSIONS) d.related = RELATED[d.id];

export const DIM_BY_ID = Object.fromEntries(DIMENSIONS.map((d) => [d.id, d]));
