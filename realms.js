// The seven realms and their 49 questions.
//
// Option format: o(text, dims, positions, beyond)
//   dims      { dimensionId: weight }  weight in -2..+2 (negative = pole A, positive = pole B).
//             A weight of 0 is a deliberate middle position on that spectrum.
//             A dimension that is NOT listed means the answer is silent on that spectrum.
//   positions [ids from positions.js] that the answer resonates with.
//   beyond    [dimensionIds] whose framing the answer steps outside of.
//
// Every question also offers two universal answers, added by the app:
//   "I'm genuinely uncertain" and "None of these fit me".
//
// AUDIT RULE (revision 2, client-requested): an option carries a spectrum weight ONLY when
// its own wording asserts that spectrum's claim. Where an answer merely suggests a position,
// it keeps the position tag but no weight. New options are appended at the END of a list
// so that challenge triggers, which refer to options by index, stay correct.

const o = (t, d = {}, p = [], x = []) => ({ t, d, p, x });

export const REALMS = [
  {
    id: 'divinity',
    numeral: 'I',
    name: 'The Realm of Divinity',
    short: 'Divinity',
    symbol: 'sun',
    accent: '#e2b765',
    intro:
      'Here the Observatory’s great lens turns toward the brightest and most disputed light in the human sky. Is there a God, a ground of being, or only the vast and silent order of nature? Every civilization has asked, and none has asked in only one way.',
    questions: [
      {
        id: 'd1',
        text: 'Is there a God or an ultimate divine reality?',
        options: [
          o('Yes: a personal God who knows and cares for creation.', { divine: 2 }, ['classical-theism']),
          o('Yes, but an impersonal ultimate reality, more like a ground or source than a person.', { divine: 1 }, ['impersonal-absolute']),
          o('The divine and the universe are one and the same thing.', {}, ['pantheism'], ['divine']),
          o('We cannot know either way.', {}, ['agnosticism']),
          o('No. The natural world is all there is.', { divine: -2 }, ['atheism', 'naturalism']),
          o('No God, though reality may include more than the physical world.', { divine: -2 }, ['atheism']),
        ],
      },
      {
        id: 'd2',
        text: 'If there is a God or divine reality, how is it related to the world?',
        options: [
          o('It created the world and remains actively involved in it.', { divine: 2 }, ['classical-theism', 'providence']),
          o('It set the world in motion and lets it run by its own laws.', { divine: 1 }, ['deism']),
          o('The world exists within the divine, though the divine is more than the world.', { divine: 1 }, ['panentheism']),
          o('The divine is not separate from the world at all; the sense of separation is the illusion.', {}, ['nondualism'], ['divine']),
          o('I don’t believe there is a divine reality to be related to anything.', { divine: -2 }, ['atheism']),
        ],
      },
      {
        id: 'd3',
        text: 'Can human concepts describe God or the ultimate?',
        options: [
          o('In part: through reason and revelation we can say true things about the divine.', { divine: 1 }, ['classical-theism', 'faith-and-reason']),
          o('Only by saying what it is not; it lies beyond every concept.', { divine: 1 }, ['apophatic']),
          o('It is better approached through experience and practice than through description.', {}, ['contemplative-knowing']),
          o('There is nothing there to describe.', { divine: -2 }, ['atheism']),
        ],
      },
      {
        id: 'd4',
        text: 'Can morality exist independently of God?',
        options: [
          o('No. Moral truths depend on God’s nature or commands.', { morals: 1 }, ['divine-command']),
          o('Yes. Moral truths are real and would hold even without God, though God may know them perfectly.', { morals: 2 }, ['moral-realism']),
          o('Yes. Morality is grounded in human nature and what helps us flourish.', { morals: 1 }, ['virtue-ethics']),
          o('Yes. Morality is something humans build through reasoning and agreement.', { morals: -1 }, ['moral-constructivism']),
        ],
      },
      {
        id: 'd5',
        text: 'Does the existence of suffering challenge belief in a benevolent creator?',
        options: [
          o('Yes, decisively. So much suffering makes a good and all-powerful creator implausible.', {}, ['argument-from-evil']),
          o('It is a real challenge, but there may be reasons we cannot see.', {}, ['skeptical-theism']),
          o('Suffering can serve a purpose, such as growth, freedom or the shaping of the soul.', {}, ['soul-making']),
          o('The divine may not be all-powerful, or may suffer alongside us.', {}, ['process-theology']),
          o('Suffering comes from craving, ignorance or karma, not from a creator’s choices.', {}, ['karma']),
        ],
      },
      {
        id: 'd6',
        text: 'How do you see the world’s religious traditions?',
        options: [
          o('One tradition holds the truth; others are mistaken where they differ from it.', {}, ['exclusivism']),
          o('One tradition is truest, but others contain real truth and goodness.', {}, ['inclusivism']),
          o('Many traditions are different paths toward the same ultimate reality.', {}, ['pluralism']),
          o('They are human creations that reveal more about us than about any divine reality.', {}, ['religion-as-human-creation']),
        ],
      },
      {
        id: 'd7',
        text: 'When evidence runs out, what role should faith play?',
        options: [
          o('Faith is a legitimate way of holding beliefs that reason cannot settle.', {}, ['fideism']),
          o('Faith and reason should work together; they cannot truly contradict each other.', {}, ['faith-and-reason']),
          o('It can be reasonable to commit in hope or trust, as long as it is held humbly.', {}, ['will-to-believe']),
          o('Where evidence runs out, it is wisest to suspend judgment.', {}, ['agnosticism', 'evidentialism']),
        ],
      },
    ],
  },

  {
    id: 'fate',
    numeral: 'II',
    name: 'The Realm of Fate',
    short: 'Fate',
    symbol: 'orbits',
    accent: '#b9a6e0',
    intro:
      'Orbits cross and recross in this chamber, each path held by forces it did not choose. Are we planets on fixed courses, comets free to turn, or something stranger, travellers who somehow write the map as we walk it?',
    questions: [
      {
        id: 'f1',
        text: 'Are our choices genuinely free?',
        options: [
          o('Yes. At the moment of choice, I could truly have done otherwise.', { will: 2 }, ['libertarian-free-will']),
          o('Yes, in the sense that matters: my choices flow from my own reasons and character, even if those have causes.', {}, ['compatibilism'], ['will']),
          o('Partly. We are shaped by many forces, but there is a real margin of openness.', { will: 1 }),
          o('No. Every choice is the product of prior causes, and freedom is an illusion.', { will: -2 }, ['hard-determinism']),
        ],
      },
      {
        id: 'f2',
        text: 'Is the future already fixed?',
        options: [
          o('Yes. Every event follows necessarily from what came before.', { will: -2 }, ['causal-determinism']),
          o('It may be known to God, but knowing is not causing; our choices remain ours.', {}, ['divine-foreknowledge']),
          o('The broad outlines may be set, but how we meet them is up to us.', {}, ['destiny']),
          o('Physics may give only probabilities, so the future is partly a matter of chance.', {}, ['indeterminism']),
          o('The future is genuinely open; nothing about it is settled yet.', {}, ['open-future']),
          o('God has ordained in advance everything that will happen.', {}, ['predestination']),
        ],
      },
      {
        id: 'f3',
        text: 'Can destiny and free will coexist?',
        options: [
          o('Yes. Destiny sets the destination; freedom chooses the path.', {}, ['destiny']),
          o('Yes. Freedom just means acting from your own nature, and that fits with everything being determined.', {}, ['compatibilism', 'stoicism'], ['will']),
          o('Yes. Our actions create our destiny; what we do shapes what comes to us.', {}, ['karma']),
          o('No. If destiny is real, freedom is an illusion; at most one of them is true.', {}, ['incompatibilism']),
          o('No, and since we are free, there is no destiny.', { will: 2 }, ['libertarian-free-will']),
          o('What is meant to happen will happen, whatever we choose.', {}, ['fatalism']),
        ],
      },
      {
        id: 'f4',
        text: 'Are meaningful coincidences evidence of something greater, or do we assign meaning to randomness?',
        options: [
          o('They often reveal a hidden order or guidance.', {}, ['synchronicity']),
          o('Sometimes. I’m open to it, but I try not to over-read them.'),
          o('Humans are pattern-seekers; we find meaning in randomness.'),
          o('Coincidences mean whatever we make them mean, and that meaning is real because it is ours.'),
        ],
      },
      {
        id: 'f5',
        text: 'If someone’s actions were entirely caused by genes, upbringing and circumstance, would they still deserve blame or praise?',
        options: [
          o('Yes. What matters is whether they acted from their own reasons, not whether those reasons had causes.', {}, ['compatibilism'], ['will']),
          o('Yes, because people are not entirely caused; they can choose otherwise.', { will: 2 }, ['libertarian-free-will']),
          o('Not in the deepest sense, though holding people accountable can still protect and improve us.', {}, ['incompatibilism']),
          o('Responsibility belongs to a web of relationships and communities, not only to individuals.', {}, ['relational-personhood']),
        ],
      },
      {
        id: 'f6',
        text: 'Do our actions come back to us?',
        options: [
          o('Yes, literally. Intentional actions carry consequences that shape future experience, perhaps across lives.', {}, ['karma']),
          o('Yes, in a natural way. What we do shapes who we become and how others respond to us.'),
          o('Not reliably. The universe is indifferent; outcomes do not track merit.'),
          o('Ultimately, yes. Justice is balanced by God, if not in this life then beyond it.', { divine: 2, survival: 1 }, ['divine-judgment']),
        ],
      },
      {
        id: 'f7',
        text: 'When something important happens in your life, what do you most see at work?',
        options: [
          o('Providence: a loving purpose behind events.', { divine: 1 }, ['providence']),
          o('My own choices, more than anything else.'),
          o('Interdependence: everything arising together in a vast web of conditions.', {}, ['dependent-origination', 'interconnection']),
          o('Chance. Much of life is luck.'),
          o('Cause and effect: long chains of events, some of them set in motion by me.'),
        ],
      },
    ],
  },

  {
    id: 'consciousness',
    numeral: 'III',
    name: 'The Realm of Consciousness',
    short: 'Consciousness',
    symbol: 'eye',
    accent: '#7fc4c9',
    intro:
      'At the centre of this chamber an eye of light opens and looks back at you. Everything you have ever known has appeared within awareness, yet awareness itself is the hardest thing to see. What is it, where is it, and who is it that is looking?',
    questions: [
      {
        id: 'c1',
        text: 'Is consciousness produced by the brain, or does it exist independently?',
        options: [
          o('It is produced by the brain; it is what certain physical processes do.', { mind: -2 }, ['physicalism']),
          o('It depends on the brain, but science may never fully explain why experience exists at all.', {}, ['hard-problem']),
          o('It is a non-physical mind or soul working through the brain.', { mind: 2 }, ['substance-dualism']),
          o('Consciousness is more fundamental than matter; the physical world appears within it.', {}, ['idealism'], ['mind']),
          o('Some form of experience is present throughout nature, even in simple matter.', {}, ['panpsychism'], ['mind']),
        ],
      },
      {
        id: 'c2',
        text: 'Are you the same person you were ten years ago?',
        options: [
          o('Yes. I have the same soul throughout.', {}, ['soul-identity']),
          o('Yes, mostly. My memories and character connect me to that person.', {}, ['psychological-continuity']),
          o('Yes. I am the same living organism, and that is what makes me “me.”', {}, ['animalism']),
          o('Only loosely. There is a chain of overlapping selves, and the question of strict sameness may not matter much.', {}, ['reductionist-self']),
          o('There is no fixed self to persist; “I” is a useful label for a changing process.', {}, ['no-self']),
        ],
      },
      {
        id: 'c3',
        text: 'Could a sufficiently advanced computer be conscious?',
        options: [
          o('Yes. With the right kind of information processing, it would have experience.', {}, ['functionalism']),
          o('Possibly, but behaving intelligently is not the same as experiencing anything.', {}, ['hard-problem']),
          o('No. Consciousness requires a soul, which machines lack.', { mind: 1 }, ['substance-dualism']),
          o('If experience pervades everything, the question is what kind of experience a machine would have, not whether.', {}, ['panpsychism'], ['mind']),
        ],
      },
      {
        id: 'c4',
        text: 'When you look inward for the self that is doing the looking, what do you find?',
        options: [
          o('A real, enduring self: the one who has all my experiences.', {}, ['enduring-self']),
          o('Thoughts, feelings and sensations, but no separate owner of them.', {}, ['no-self']),
          o('Awareness itself, which cannot be found as an object because it is what does the finding.', {}, ['nondualism'], ['mind']),
          o('A model the brain constructs; the self is a useful story the brain tells.', {}, ['no-self']),
        ],
      },
      {
        id: 'c5',
        text: 'Is there something about experience, such as the redness of red or the taste of coffee, that physical facts cannot capture?',
        options: [
          o('No. Once you know all the physical facts, you know everything there is.', { mind: -2 }, ['physicalism']),
          o('It seems that way, but that impression may itself be explained by the brain.', { mind: -1 }, ['illusionism']),
          o('Yes. Experience is a further fact beyond the physical.', { mind: 1 }, ['property-dualism', 'hard-problem']),
          o('Yes, and this suggests experience is the most basic reality of all.', {}, ['idealism'], ['mind']),
        ],
      },
      {
        id: 'c6',
        text: 'Could consciousness continue after physical death?',
        options: [
          o('Yes. The mind or soul survives the death of the body.', { survival: 2 }, ['immortal-soul']),
          o('Yes, but not as an individual; it returns to a larger consciousness.', { survival: 1 }, ['mergence']),
          o('Possibly. I am genuinely open to it.'),
          o('No. When the brain stops, experience stops.', { survival: -2 }),
          o('The question assumes a fixed self that may not exist in the way we think.', {}, ['no-self'], ['survival']),
        ],
      },
      {
        id: 'c7',
        text: 'Where do the mind’s boundaries lie?',
        options: [
          o('Inside my skull.'),
          o('It extends into my tools, notebooks and relationships.', {}, ['extended-mind']),
          o('In the soul, which is not located in space at all.', { mind: 2 }, ['substance-dualism']),
          o('Individual minds are like waves on one ocean of awareness.', {}, ['nondualism'], ['mind']),
        ],
      },
    ],
  },

  {
    id: 'truth',
    numeral: 'IV',
    name: 'The Realm of Truth',
    short: 'Truth',
    symbol: 'prism',
    accent: '#a9d4ef',
    intro:
      'Light enters this chamber as a single beam and leaves it as a spectrum. Is truth one thing seen from many angles, many things mistaken for one, or a brightness we can approach but never hold? Look closely, since even the looking may change what you see.',
    questions: [
      {
        id: 't1',
        text: 'Can absolute truth exist independently of human perception?',
        options: [
          o('Yes. Reality is what it is, whether or not anyone perceives it.', {}, ['realism']),
          o('Yes, but we only ever know it as it appears to us, never as it is in itself.', {}, ['kantian']),
          o('Truth is what works and holds up in practice and inquiry over time.', {}, ['pragmatism']),
          o('Truth always depends on a perspective; there is no view from nowhere.', {}, ['perspectivism']),
          o('Reality is many-sided; different views can each be partly true.', {}, ['anekantavada']),
        ],
      },
      {
        id: 't2',
        text: 'Is intuition a legitimate source of knowledge?',
        options: [
          o('Yes. Some truths, in logic, mathematics or ethics, are grasped directly by reason.', { knowing: 2 }, ['rationalism']),
          o('Yes. Contemplative or spiritual insight can reveal what reasoning cannot.', {}, ['contemplative-knowing'], ['knowing']),
          o('Sometimes. Intuitions are useful starting points, but they must be tested.', {}, ['fallibilism']),
          o('Rarely. Intuitions are mostly hidden biases; trust evidence.', { knowing: -1 }, ['empiricism']),
        ],
      },
      {
        id: 't3',
        text: 'Can we ever truly know that our understanding of reality is correct?',
        options: [
          o('Yes. About many things, we know with good reason.', { certainty: 2 }),
          o('We can know a great deal, though any belief might need revising.', { certainty: 1 }, ['fallibilism']),
          o('Not with certainty. The most we have is better and worse guesses.', { certainty: -1 }, ['fallibilism']),
          o('No. We cannot even rule out that everything we experience is an illusion.', { certainty: -2 }, ['skepticism']),
        ],
      },
      {
        id: 't4',
        text: 'Where does most of our real knowledge come from?',
        options: [
          o('Experience and observation of the world.', { knowing: -2 }, ['empiricism']),
          o('Reason: logic and reflection reveal truths experience cannot.', { knowing: 2 }, ['rationalism']),
          o('Both together; neither is enough on its own.', { knowing: 0 }, ['kantian']),
          o('Several sources: perception, inference, comparison and reliable testimony.', { knowing: 0 }, ['pramana']),
          o('Revelation or sacred teaching, with reason as its helper.', {}, ['revelation'], ['knowing']),
        ],
      },
      {
        id: 't5',
        text: 'Could we know anything about the world just by thinking, without relying on experience?',
        options: [
          o('Yes. Reason alone can reveal important truths, in mathematics, logic and perhaps beyond.', { knowing: 2 }, ['rationalism']),
          o('Only truths of logic and meaning; facts about the world need experience.', { knowing: -1 }, ['logical-empiricism']),
          o('No. Even logic and mathematics are ultimately learned from experience.', { knowing: -2 }, ['empiricism']),
          o('Thinking and experience are too intertwined to separate in this way.', {}, ['pragmatism'], ['knowing']),
        ],
      },
      {
        id: 't6',
        text: 'Can language capture the deepest truths?',
        options: [
          o('Yes. Careful language can express anything that can be known.'),
          o('Most truths, but the deepest can only be pointed toward.', {}, ['ineffability']),
          o('Language shapes what we can think at all; it is a lens, not a window.', {}, ['perspectivism']),
          o('If something cannot be said clearly, it may not be knowledge at all.', {}, ['verificationism']),
        ],
      },
      {
        id: 't7',
        text: 'How far can you trust your senses and memory to give you an accurate picture of the world?',
        options: [
          o('Very far. They are generally reliable, even if they sometimes err.', { certainty: 2 }),
          o('Fairly far, though perception and memory are reconstructions that can mislead.', { certainty: 1 }, ['fallibilism']),
          o('Not very far. Much of what we perceive is shaped by expectation and may mislead us.', { certainty: -1 }),
          o('I cannot rule out that it is all an illusion.', { certainty: -2 }, ['skepticism']),
        ],
      },
    ],
  },

  {
    id: 'morality',
    numeral: 'V',
    name: 'The Realm of Morality',
    short: 'Morality',
    symbol: 'scales',
    accent: '#e0a3b0',
    intro:
      'Great scales hang in the stillness here, balanced on a point of light. What gives an act its weight: the heart behind it, the harm or good it does, or the kind of person it makes us? And who, or what, keeps the scales?',
    questions: [
      {
        id: 'm1',
        text: 'Are moral truths universal or culturally constructed?',
        options: [
          o('Universal. Some things are right or wrong for everyone, everywhere.', { morals: 2 }, ['moral-realism']),
          o('There is a universal core, but cultures express it differently.', { morals: 1 }),
          o('Constructed, but we can still reason about which constructions are better.', { morals: -1 }, ['moral-constructivism']),
          o('Relative. What is right depends on one’s culture.', { morals: -2 }, ['relativism']),
          o('Moral claims express feelings and attitudes rather than facts.', { morals: -2 }, ['expressivism']),
        ],
      },
      {
        id: 'm2',
        text: 'Does intention matter more than consequence?',
        options: [
          o('Intention. Acting from duty or good will is what counts.', {}, ['deontology']),
          o('Consequence. What matters is how much good or harm is actually done.', {}, ['consequentialism']),
          o('Character. What matters is what kind of person the action expresses and builds.', {}, ['virtue-ethics']),
          o('Relationship. What matters is responding well to the people who depend on us.', {}, ['care-ethics', 'relational-personhood']),
          o('Both matter, and wisdom is knowing how to weigh them case by case.', {}, ['ross-pluralism']),
        ],
      },
      {
        id: 'm3',
        text: 'Can an immoral action produce a morally justified outcome?',
        options: [
          o('No. Some acts are wrong regardless of what they achieve.', {}, ['deontology']),
          o('Yes. If the outcome is good enough, the action is justified.', {}, ['consequentialism']),
          o('It may be the least-bad choice, yet still leave a real wrong worth grieving.', {}, ['dirty-hands']),
          o('If the action was truly justified, it was not really immoral; the label was mistaken.', {}, ['consequentialism']),
        ],
      },
      {
        id: 'm4',
        text: 'Why should we be good at all?',
        options: [
          o('Because God commands it, or because goodness reflects God’s nature.', { divine: 2, morals: 1 }, ['divine-command']),
          o('Because goodness is part of a flourishing human life.', {}, ['virtue-ethics', 'eudaimonism']),
          o('Because reason requires it; I cannot consistently make an exception of myself.', {}, ['deontology']),
          o('Because we care about others and they care about us.', {}, ['care-ethics']),
          o('Because it keeps us in harmony with the deeper order of things.', { morals: 1 }, ['cosmic-order']),
          o('There is no ultimate reason; we choose our values.', { morals: -2 }, ['existentialism']),
        ],
      },
      {
        id: 'm5',
        text: 'How much do we owe to distant strangers?',
        options: [
          o('As much as to those nearby; distance does not change a person’s moral worth.', {}, ['consequentialism']),
          o('Something real, but we have special duties to family and community first.', {}, ['special-obligations', 'relational-personhood']),
          o('What justice requires and what we have agreed to, but not unlimited sacrifice.', {}, ['contractualism']),
          o('Compassion should reach all beings, not just humans.', {}, ['universal-compassion']),
        ],
      },
      {
        id: 'm6',
        text: 'Is there such a thing as genuine evil?',
        options: [
          o('Yes. Evil is a real force or will set against the good.', { morals: 1 }, ['evil-as-force']),
          o('Yes, but evil is an absence or corruption of good, not a thing in itself.', { morals: 1 }, ['privation']),
          o('People do terrible things, but mostly from ignorance, harm done to them, or broken conditions.', {}, ['evil-as-ignorance']),
          o('“Evil” is a label we use for what we most strongly condemn.', { morals: -1 }, ['expressivism']),
        ],
      },
      {
        id: 'm7',
        text: 'What should justice primarily aim at?',
        options: [
          o('Giving people what they deserve.', {}, ['retributivism']),
          o('Repairing harm and restoring relationships.', {}, ['restorative-justice']),
          o('Producing the best outcomes for society as a whole.', {}, ['consequentialism']),
          o('Fair rules that everyone could accept from an impartial standpoint.', {}, ['contractualism']),
        ],
      },
    ],
  },

  {
    id: 'existence',
    numeral: 'VI',
    name: 'The Realm of Existence',
    short: 'Existence',
    symbol: 'spiral',
    accent: '#c39be0',
    intro:
      'A galaxy turns slowly overhead, its arms unwinding into the dark. You are here, briefly, on one small world circling one ordinary star. What, if anything, does that ask of you, and what might it offer?',
    questions: [
      {
        id: 'e1',
        text: 'Is the purpose of life discovered or created?',
        options: [
          o('Discovered. There is a purpose built into reality or given by God.', { meaning: 2 }, ['teleology']),
          o('Discovered within. Our own nature points toward what fulfils us.', { meaning: 1 }, ['eudaimonism']),
          o('Both. We are given raw materials and must shape them ourselves.', { meaning: 0 }),
          o('Created. We make our purpose through our choices and commitments.', { meaning: -2 }, ['existentialism']),
          o('Neither. Life does not need a purpose to be worth living.', {}, ['without-purpose'], ['meaning']),
        ],
      },
      {
        id: 'e2',
        text: 'Would immortality make existence more or less meaningful?',
        options: [
          o('More. Love and growth could go on without loss.'),
          o('Less. Mortality gives our choices their weight and urgency.', {}, ['mortality-meaning']),
          o('It depends on the kind: endless sameness would be a curse, endless transformation perhaps a gift.'),
          o('Duration misses the point; meaning is found in the present moment.', {}, ['presence']),
        ],
      },
      {
        id: 'e3',
        text: 'Can a meaningful life exist in an indifferent universe?',
        options: [
          o('Yes. Meaning is something we bring; the universe need not supply it.', { meaning: -2 }, ['existentialism']),
          o('Yes, and there is even a kind of freedom in facing that indifference honestly.', {}, ['absurdism'], ['meaning']),
          o('Not fully. Without some deeper order, meaning would be fragile.', { meaning: 1 }),
          o('I don’t think the universe is indifferent.', {}, ['meaningful-cosmos']),
        ],
      },
      {
        id: 'e4',
        text: 'What most makes a life go well?',
        options: [
          o('Pleasure and the absence of suffering.', {}, ['hedonism']),
          o('Excellence of character and the exercise of our best capacities.', {}, ['eudaimonism', 'virtue-ethics']),
          o('Loving relationships and belonging.', {}, ['relational-personhood']),
          o('Liberation from craving and attachment.', {}, ['liberation']),
          o('Living in right relationship with God.', { divine: 2 }),
          o('Achieving what matters to you, whatever that is.', {}, ['desire-satisfaction']),
        ],
      },
      {
        id: 'e5',
        text: 'When you imagine the vast scale of the cosmos, what do you feel?',
        options: [
          o('Wonder at the Creator whose work it is.', { divine: 2 }),
          o('Awe. The universe itself feels sacred.', {}, ['sense-of-the-sacred']),
          o('Kinship. I am made of the same stuff; I belong to it.', {}, ['cosmic-belonging']),
          o('Insignificance, and I find that unsettling.'),
          o('Insignificance, and I find that freeing.'),
        ],
      },
      {
        id: 'e6',
        text: 'Where does the meaning of your own life mainly come from?',
        options: [
          o('From a purpose I believe I was given or called to.', { meaning: 2 }, ['teleology']),
          o('From being part of something larger than myself that has value in its own right.', { meaning: 1 }),
          o('From people and pursuits I love that are also genuinely worth loving.', { meaning: 0 }, ['meaning-as-fit']),
          o('From commitments I have chosen and keep choosing.', { meaning: -2 }, ['existentialism']),
          o('I am not sure a life needs a meaning to be worth living.', {}, ['without-purpose'], ['meaning']),
        ],
      },
      {
        id: 'e7',
        text: 'What is the wisest response to suffering in your own life?',
        options: [
          o('Accept what I cannot control, and focus on what I can.', {}, ['stoicism']),
          o('Understand its causes and work to release them.', {}, ['liberation']),
          o('Find or make meaning in it.', {}, ['logotherapy']),
          o('Bring it to God in trust or in lament.', { divine: 2 }),
          o('Refuse to be defeated by it, and keep living fully anyway.', {}, ['absurdism']),
        ],
      },
    ],
  },

  {
    id: 'beyond',
    numeral: 'VII',
    name: 'The Realm of the Beyond',
    short: 'The Beyond',
    symbol: 'eclipse',
    accent: '#9fa8d8',
    intro:
      'The last chamber is the darkest, lit only by the ring of an eclipse: a doorway of light around a disc of shadow. What lies past the edge of a life, and past the edge of what we can understand? Step softly. Here even certainty casts a shadow.',
    questions: [
      {
        id: 'b1',
        text: 'Does personal identity survive death?',
        options: [
          o('Yes. I will continue as myself, as a soul.', { survival: 2 }, ['immortal-soul']),
          o('Yes, through resurrection to new embodied life.', { survival: 2 }, ['resurrection']),
          o('Something continues, but not the personal “me.”', { survival: 1 }),
          o('No. Death is the end of the person.', { survival: -2 }),
        ],
      },
      {
        id: 'b2',
        text: 'Is reincarnation philosophically plausible?',
        options: [
          o('Yes. A soul or self passes through many lives.', { survival: 2 }, ['reincarnation']),
          o('Yes, but without a fixed soul; what continues is a stream of causes and tendencies.', { survival: 1 }, ['rebirth', 'no-self']),
          o('It is coherent, but I see no good reason to believe it.'),
          o('No. Without a brain, there is nothing to carry memory or personality into a new life.'),
        ],
      },
      {
        id: 'b3',
        text: 'Can something exist beyond space and time?',
        options: [
          o('Yes. God or ultimate reality is eternal, outside time.', { divine: 1 }, ['timeless-eternity']),
          o('Yes. Abstract things like numbers and logical truths exist timelessly.', {}, ['platonism']),
          o('Possibly. Space and time may be how reality appears to us, not how it is in itself.', {}, ['kantian']),
          o('No. To exist is to exist somewhere and somewhen.'),
        ],
      },
      {
        id: 'b4',
        text: 'How should we think about death?',
        options: [
          o('As nothing to fear: where death is, we are not.', { survival: -1 }, ['epicurean']),
          o('As a passage into a fuller life.', { survival: 2 }),
          o('As a passage within a larger cycle of lives.', { survival: 1 }, ['reincarnation']),
          o('As a teacher that shows us what matters.', {}, ['memento-mori']),
          o('As a real loss, worth grieving, which no philosophy fully removes.'),
        ],
      },
      {
        id: 'b5',
        text: 'Is there an ultimate liberation or fulfilment beyond this life?',
        options: [
          o('Yes: union or communion with God.', { divine: 2, survival: 2 }, ['union-with-god']),
          o('Yes: release from the cycle of rebirth.', {}, ['liberation'], ['survival']),
          o('Fulfilment, if it exists, must be found in this life.'),
          o('I don’t think there is anything beyond to be fulfilled in.', { survival: -2 }),
        ],
      },
      {
        id: 'b6',
        text: 'What lies at the very limit of human understanding?',
        options: [
          o('A Mystery that can be encountered but never fully grasped.', {}, ['irreducible-mystery']),
          o('Questions that science will eventually answer, given time.', { certainty: 1 }),
          o('Questions that may be permanently beyond minds like ours.', { certainty: -1 }, ['mysterianism']),
          o('The realization that the knower and the known were never separate.', {}, ['nondualism']),
        ],
      },
      {
        id: 'b7',
        text: 'Do the dead remain connected to the living?',
        options: [
          o('Yes. Ancestors remain present and can be honoured, and can guide us.', { survival: 2 }, ['ancestor-veneration']),
          o('Yes, in God, where all who have died are held.', { divine: 2 }, ['objective-immortality']),
          o('Yes, through memory, love and what they handed down.', {}, ['legacy']),
          o('Not in any literal way.'),
        ],
      },
    ],
  },
];

export const REALM_BY_ID = Object.fromEntries(REALMS.map((r) => [r.id, r]));
export const QUESTION_BY_ID = Object.fromEntries(
  REALMS.flatMap((r) => r.questions.map((q) => [q.id, { ...q, realm: r.id }]))
);
export const ALL_QUESTIONS = REALMS.flatMap((r) => r.questions.map((q) => ({ ...q, realm: r.id })));

// Universal answers available on every question.
export const UNCERTAIN = 'uncertain';
export const NONE_FIT = 'none';
