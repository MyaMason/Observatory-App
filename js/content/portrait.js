// Text fragments for "Your Philosophical Portrait."
// The portrait generator (js/engine/portrait.js) only uses a fragment when the user's
// answers actually support it. Fragments are written to read as reflection, not diagnosis.

// Per-dimension sentences for clear leanings. Keys: aStrong, aLean, bLean, bStrong.
export const DIM_SENTENCES = {
  divine: {
    aStrong: 'Your answers consistently reject belief in a God or divine reality.',
    aLean: 'Your answers lean away from belief in a God or divine reality, though not always with full conviction.',
    bLean: 'Your answers lean toward the reality of the divine, though with some openness or reserve in how you hold that belief.',
    bStrong: 'Belief in a divine reality runs clearly and confidently through your answers.',
  },
  will: {
    aStrong: 'You see human choices as firmly embedded in chains of cause and effect.',
    aLean: 'You tend to see choices as shaped by prior causes more than by any power to do otherwise.',
    bLean: 'You tend to see a real openness in human choice, a margin where things could go otherwise.',
    bStrong: 'You hold firmly that, at the moment of choice, we can genuinely choose otherwise.',
  },
  mind: {
    aStrong: 'You see the mind as a physical process, the brain at work, rather than something beyond it.',
    aLean: 'You lean toward understanding the mind physically, while leaving some room for what science has not yet explained.',
    bLean: 'You lean toward the view that the mind is more than the brain.',
    bStrong: 'You hold clearly that the mind or soul is something beyond the physical.',
  },
  knowing: {
    aStrong: 'You place your trust firmly in experience and observation as the routes to knowledge.',
    aLean: 'You lean toward experience and evidence as the main sources of what we know.',
    bLean: 'You lean toward trusting reason to grasp truths that experience alone could not.',
    bStrong: 'You hold that reason can reach truths directly, in ways experience cannot.',
  },
  certainty: {
    aStrong: 'You keep a deep doubt about how much any of us can really know.',
    aLean: 'You hold knowledge with caution, wary of claiming more certainty than the evidence allows.',
    bLean: 'You are fairly confident that human beings can come to know a great deal about reality.',
    bStrong: 'You are confident that reality can be known, and known well.',
  },
  morals: {
    aStrong: 'You see morality as something humans make, not a set of facts written into the world.',
    aLean: 'You lean toward the view that morality is shaped by people and cultures rather than discovered.',
    bLean: 'You lean toward the view that some moral truths hold regardless of opinion.',
    bStrong: 'You hold firmly that right and wrong are real, and not merely matters of opinion or culture.',
  },
  meaning: {
    aStrong: 'For you, meaning is made rather than found: it comes from the commitments we choose.',
    aLean: 'You lean toward the view that we largely create the meaning of our lives.',
    bLean: 'You lean toward the view that meaning is something to be discovered, not only invented.',
    bStrong: 'You hold that meaning is woven into reality itself, waiting to be discovered.',
  },
  survival: {
    aStrong: 'You see death as the end of the person.',
    aLean: 'You lean toward the view that the person does not continue after death.',
    bLean: 'You lean toward the view that something of a person continues beyond death.',
    bStrong: 'You hold clearly that something of the person continues beyond death.',
  },
};

// Generic templates for the other statuses. {name} = dimension name, {a}/{b} = pole labels.
export const STATUS_SENTENCES = {
  middle: 'On {name}, you take a genuinely middle position, between {a} and {b}, rather than leaning either way.',
  mixed: 'On {name}, your answers pull gently in both directions, toward {a} on some questions and {b} on others.',
  competing: 'On {name}, you hold strong convictions that point in opposite directions, toward both {a} and {b}.',
  uncertain: 'On {name}, your most frequent answer is honest uncertainty.',
  beyond: 'On {name}, your answers step outside the usual framing of {a} versus {b}{positions}.',
};

// Thematic groupings used to organize the portrait into paragraphs.
export const THEMES = [
  { id: 'sacred', title: 'The sacred and the cosmos', dims: ['divine', 'meaning'] },
  { id: 'freedom', title: 'Freedom and fate', dims: ['will'] },
  { id: 'self', title: 'Mind and self', dims: ['mind', 'survival'] },
  { id: 'knowing', title: 'How you know', dims: ['knowing', 'certainty'] },
  { id: 'good', title: 'The good', dims: ['morals'] },
];

// Cross-realm patterns. Each applies only when every condition is met.
// `side`: 'a' (leaning/strong toward pole A) or 'b'. These never claim that one belief
// requires another; they describe how the user's own answers happen to fit together.
export const PATTERNS = [
  {
    when: [['divine', 'b'], ['meaning', 'b'], ['survival', 'b']],
    text: 'Across several realms, one thread recurs: a cosmos that is not indifferent. Your answers about the divine, about meaning and about what lies beyond death point the same way, which gives your outlook an unusual coherence.',
  },
  {
    when: [['divine', 'a'], ['meaning', 'a']],
    text: 'A clear thread runs through your answers: without belief in a divine author, you see meaning as something human beings bring to life. That is a demanding outlook, and many have found it a freeing one.',
  },
  {
    when: [['divine', 'a'], ['survival', 'b']],
    text: 'You combine disbelief in a divine reality with the view that something continues after death. This is a less common pairing in the West, but it has deep precedent: many Buddhist and Jain traditions do not centre on a creator God yet affirm rebirth.',
  },
  {
    when: [['divine', 'b'], ['survival', 'a']],
    text: 'You combine belief in the divine with doubt about personal survival after death. This pairing also has a long history: much of the Hebrew Bible focuses on this life rather than an afterlife, and the Sadducees of ancient Judaism rejected resurrection while remaining devoted to God.',
  },
  {
    when: [['mind', 'a'], ['survival', 'b']],
    text: 'You see the mind as physical, yet you hold that something continues after death. Holding both raises a real question about what could carry a person through. Some answer with resurrection, and others with views where continuity does not require a separate soul.',
  },
  {
    when: [['will', 'a'], ['morals', 'b']],
    text: 'You see a world governed by cause and effect, yet you hold that moral truths are real. The Stoics held a version of this combination: a fated cosmos in which virtue remained the only true good.',
  },
  {
    when: [['certainty', 'a'], ['morals', 'b']],
    text: 'Interestingly, you are more doubtful about knowledge in general than about morality. You seem to hold that some moral truths are firmer than much else we claim to know.',
  },
  {
    when: [['certainty', 'b'], ['knowing', 'a']],
    text: 'Your answers suggest confidence in careful inquiry, with experience and observation as the main route to what we know.',
  },
];

// Short framing text.
export const FRAMING = {
  developing:
    'Your portrait is still forming. So far you have answered {n} question{s}, and a portrait needs more to draw from. As you explore the realms, this space will grow into a reflection on the shape of your thinking.',
  openingPartial:
    'What follows is drawn from the {n} questions you have answered across {r} of the seven realms. It describes only what your answers support, so some areas remain unwritten.',
  openingFull:
    'What follows is drawn from the {n} questions you have answered across all seven realms. It is an interpretation, offered as a mirror for reflection rather than a verdict.',
  resonanceIntro:
    'Your answers echo ideas that thinkers and traditions have developed at length. This does not place you within any tradition; it simply points to where kindred ideas have been explored.',
  tensionsIntro: 'These are the places where your answers pull against each other. They may be the most interesting places to think further.',
  exploreIntro: 'Areas still open for exploration:',
  closing:
    'This portrait is generated from predefined passages and transparent rules, not from any psychological test or measurement. It cannot capture everything you believe, so treat it as a conversation partner and argue back.',
};
