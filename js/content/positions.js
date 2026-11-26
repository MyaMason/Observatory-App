// Philosophical positions that answers can "resonate" with.
// These are positions (ideas), not religious affiliations. The "found" line names
// where an idea appears historically. It never implies that holding the idea
// makes someone a member of that tradition.
// No quotations are used anywhere in the app's content; everything is paraphrased.

export const POSITIONS = {
  // ── The divine ──
  'classical-theism': {
    name: 'Classical theism',
    desc: 'God is a single, perfect, personal creator who knows and cares for the world.',
    found: 'Major strands of Jewish, Christian and Islamic thought, and theistic schools of Hinduism; developed by thinkers such as Maimonides, Ibn Sina and Thomas Aquinas.',
  },
  'impersonal-absolute': {
    name: 'An impersonal absolute',
    desc: 'Ultimate reality is a ground, principle or source rather than a person who thinks and wills as we do.',
    found: 'Brahman as understood in Advaita Vedanta, the Dao in Daoist thought, and the One in Neoplatonism (Plotinus).',
  },
  deism: {
    name: 'Deism',
    desc: 'A creator brought the universe into being but does not intervene in its workings.',
    found: 'Influential among Enlightenment-era thinkers in Europe and America.',
  },
  pantheism: {
    name: 'Pantheism',
    desc: 'God and the universe are identical; the divine is everything that exists, not a being apart from it.',
    found: 'Most famously associated with Baruch Spinoza, who used the phrase "God, or Nature."',
  },
  panentheism: {
    name: 'Panentheism',
    desc: 'The universe exists within God, but God is more than the universe.',
    found: 'Process theology (Alfred North Whitehead, Charles Hartshorne), and readings of some Hindu, Jewish mystical and Christian thinkers.',
  },
  apophatic: {
    name: 'Apophatic (negative) theology',
    desc: 'The divine lies beyond every human concept, so it is best approached by saying what it is not.',
    found: 'Pseudo-Dionysius in Christianity, Maimonides in Judaism, and currents of Islamic and Hindu mystical thought.',
  },
  agnosticism: {
    name: 'Agnosticism',
    desc: 'Whether God exists is unknown, and perhaps unknowable.',
    found: 'The term was coined by the biologist Thomas Henry Huxley in the nineteenth century, though the stance is far older.',
  },
  naturalism: {
    name: 'Naturalism',
    desc: 'The natural world, as studied by the sciences, is all there is; there are no supernatural beings or forces.',
    found: 'Ancient Greek atomists such as Democritus and Epicurus, the Indian Cārvāka school, and much modern philosophy.',
  },
  providence: {
    name: 'Divine providence',
    desc: 'God guides the course of events, including individual lives, toward good ends.',
    found: 'Central to Jewish, Christian and Islamic thought, and present in Stoic philosophy in a non-personal form.',
  },
  'skeptical-theism': {
    name: 'Skeptical theism',
    desc: 'God may have reasons for permitting suffering that limited human minds cannot see.',
    found: 'A contemporary response to the problem of evil, defended by philosophers such as Stephen Wykstra.',
  },
  'soul-making': {
    name: 'Soul-making theodicy',
    desc: 'Suffering can serve the growth of moral and spiritual character, which could not develop in a world without challenge.',
    found: 'Developed by John Hick, who traced it back to the early Christian thinker Irenaeus.',
  },
  'process-theology': {
    name: 'Process theology',
    desc: 'God is not all-controlling but works by persuasion and is affected by, even suffers with, the world.',
    found: 'Alfred North Whitehead and Charles Hartshorne in the twentieth century.',
  },
  'divine-command': {
    name: 'Divine command theory',
    desc: 'What is morally right depends on God’s commands or nature.',
    found: 'Defended in different forms within Jewish, Christian and Islamic thought; Ash’arite theologians held a strong version of it.',
  },
  pluralism: {
    name: 'Religious pluralism',
    desc: 'Many religious traditions are valid responses to the same ultimate reality.',
    found: 'John Hick in philosophy of religion; also traced to the teacher Ramakrishna and others in modern Hinduism.',
  },
  inclusivism: {
    name: 'Religious inclusivism',
    desc: 'One tradition is truest, but others contain real truth and goodness.',
    found: 'Common across many traditions.',
  },
  exclusivism: {
    name: 'Religious exclusivism',
    desc: 'One tradition holds the truth; others are mistaken where they differ from it.',
    found: 'Common across many traditions.',
  },
  fideism: {
    name: 'Fideism',
    desc: 'Faith is a legitimate way of holding beliefs that reason cannot settle.',
    found: 'Associated with Søren Kierkegaard and, in some readings, Blaise Pascal.',
  },
  'faith-and-reason': {
    name: 'Harmony of faith and reason',
    desc: 'Faith and reason are distinct but cannot truly contradict each other.',
    found: 'Ibn Rushd (Averroes), Maimonides and Thomas Aquinas each argued for versions of this view.',
  },
  'will-to-believe': {
    name: 'The will to believe',
    desc: 'When a question matters for how we live and evidence cannot settle it, it can be reasonable to commit to a belief.',
    found: 'William James, in an 1896 essay of that name.',
  },

  // ── Fate and freedom ──
  'libertarian-free-will': {
    name: 'Libertarian free will',
    desc: 'Free choice requires that, given everything as it was, you could have chosen otherwise.',
    found: 'Thomas Reid, and contemporary philosophers such as Robert Kane.',
  },
  compatibilism: {
    name: 'Compatibilism',
    desc: 'Freedom means acting from your own reasons and character, without coercion, and this is compatible with your choices having causes.',
    found: 'The ancient Stoic Chrysippus, David Hume, Harry Frankfurt and Daniel Dennett.',
  },
  'hard-determinism': {
    name: 'Hard determinism',
    desc: 'Every event is fixed by prior causes, so the kind of free will that would ground deep moral blame does not exist.',
    found: 'Baruch Spinoza held a version; Derk Pereboom defends the related view called hard incompatibilism.',
  },
  incompatibilism: {
    name: 'Incompatibilism',
    desc: 'Free will and determinism cannot both be true; at most one of them is.',
    found: 'Held both by libertarians, who keep free will, and hard determinists, who keep determinism.',
  },
  'divine-foreknowledge': {
    name: 'Foreknowledge without compulsion',
    desc: 'God can know what we will choose without causing or forcing the choice.',
    found: 'Boethius and Augustine; the Jesuit Luis de Molina developed a related account.',
  },
  destiny: {
    name: 'Destiny',
    desc: 'The broad shape of a life may be set, even if how we meet it remains up to us.',
    found: 'Found in many cultures, from Greek ideas of the Fates to the Yoruba concept of orí.',
  },
  'open-future': {
    name: 'The open future',
    desc: 'The future is not yet settled; there is no fact now about what will happen.',
    found: 'Debated since Aristotle’s puzzle about tomorrow’s sea battle.',
  },
  indeterminism: {
    name: 'Indeterminism',
    desc: 'Some events are not fixed by prior causes; chance is real.',
    found: 'Epicurus’ “swerve” of atoms; some interpretations of quantum physics.',
  },
  karma: {
    name: 'Karma',
    desc: 'Intentional actions carry consequences that shape future experience, often across lives.',
    found: 'Hindu, Buddhist, Jain and Sikh thought, which understand it in importantly different ways.',
  },
  'dependent-origination': {
    name: 'Dependent origination',
    desc: 'Everything arises in dependence on conditions; nothing exists entirely on its own.',
    found: 'A core Buddhist teaching (pratītyasamutpāda).',
  },
  synchronicity: {
    name: 'Synchronicity',
    desc: 'Some coincidences are meaningfully connected even though neither causes the other.',
    found: 'The psychiatrist Carl Jung coined the term.',
  },
  'relational-personhood': {
    name: 'Relational personhood',
    desc: 'A person is constituted through relationships and community, not only as an isolated individual.',
    found: 'Ubuntu philosophy in southern Africa, Confucian ethics, and care ethics.',
  },
  'divine-judgment': {
    name: 'Divine justice',
    desc: 'Justice is ultimately balanced by God, in this life or beyond it.',
    found: 'Jewish, Christian and Islamic eschatology (teaching about the end of things).',
  },
  stoicism: {
    name: 'Stoicism',
    desc: 'Accept what lies outside your control; put your effort into your own judgments and actions.',
    found: 'Epictetus, Seneca and Marcus Aurelius, building on earlier Greek Stoics.',
  },

  // ── Consciousness ──
  physicalism: {
    name: 'Physicalism',
    desc: 'Everything about the mind is ultimately physical.',
    found: 'The dominant view in contemporary philosophy of mind, defended in many forms.',
  },
  'substance-dualism': {
    name: 'Substance dualism',
    desc: 'Mind and body are two different kinds of thing; the mind is not physical.',
    found: 'René Descartes; also many religious understandings of the soul.',
  },
  'property-dualism': {
    name: 'Property dualism',
    desc: 'There is one kind of stuff, but conscious experience is a non-physical property of it.',
    found: 'Defended by David Chalmers among others.',
  },
  'hard-problem': {
    name: 'The hard problem of consciousness',
    desc: 'Even a complete account of brain function may not explain why there is something it is like to have experience.',
    found: 'Named by David Chalmers in 1995.',
  },
  idealism: {
    name: 'Idealism',
    desc: 'Mind or consciousness is fundamental, and the physical world exists within or as an appearance to it.',
    found: 'George Berkeley; the Yogācāra (“mind-only”) school of Buddhism; and, in its own way, Advaita Vedanta.',
  },
  panpsychism: {
    name: 'Panpsychism',
    desc: 'Some form of experience is a basic feature of all matter, even at the simplest level.',
    found: 'Defended today by Philip Goff and Galen Strawson; with roots in Leibniz and earlier thinkers.',
  },
  nondualism: {
    name: 'Nondualism',
    desc: 'The apparent separation between self and world, or mind and reality, is not ultimately real.',
    found: 'Advaita Vedanta (Śaṅkara), strands of Buddhism such as Dzogchen and Zen, and Daoist thought, each in distinct ways.',
  },
  'soul-identity': {
    name: 'The enduring soul',
    desc: 'A person remains the same person over time because they have the same soul.',
    found: 'Widespread in religious traditions; Plato argued for a version.',
  },
  'psychological-continuity': {
    name: 'Psychological continuity',
    desc: 'You remain the same person because of chains of memory, personality and intention.',
    found: 'John Locke, and later philosophers who refined his view.',
  },
  'reductionist-self': {
    name: 'The reductionist view of the self',
    desc: 'Personal identity is not a deep further fact; what matters is the overlapping connections between earlier and later selves.',
    found: 'Derek Parfit, in Reasons and Persons (1984).',
  },
  animalism: {
    name: 'Animalism',
    desc: 'You are a living human organism, and you persist as long as that organism does.',
    found: 'Defended by Eric Olson and others.',
  },
  'no-self': {
    name: 'No-self',
    desc: 'There is no permanent, unchanging self; what we call “I” is a changing process.',
    found: 'The Buddhist teaching of anattā; David Hume’s “bundle” view is a Western parallel.',
  },
  functionalism: {
    name: 'Functionalism',
    desc: 'A mental state is defined by what it does, so the right kind of processing could produce a mind in any material.',
    found: 'Hilary Putnam and many contemporary cognitive scientists.',
  },
  illusionism: {
    name: 'Illusionism',
    desc: 'The sense that experience has special, non-physical qualities is itself something the brain produces.',
    found: 'Keith Frankish and, in related form, Daniel Dennett.',
  },
  'extended-mind': {
    name: 'The extended mind',
    desc: 'The mind can extend beyond the brain into tools, notes and the environment.',
    found: 'Andy Clark and David Chalmers, 1998.',
  },
  mergence: {
    name: 'Return to a greater whole',
    desc: 'At death, individual consciousness rejoins a larger reality rather than continuing as a separate person.',
    found: 'Found in some Hindu, mystical and nondual teachings, which describe it in different ways.',
  },

  // ── Truth ──
  realism: {
    name: 'Metaphysical realism',
    desc: 'Reality exists and is the way it is independently of what anyone thinks.',
    found: 'A widely held view across philosophical traditions.',
  },
  kantian: {
    name: 'Kant’s distinction',
    desc: 'We know the world only as it appears to us, shaped by our own forms of perception, never as it is in itself.',
    found: 'Immanuel Kant, Critique of Pure Reason (1781).',
  },
  pragmatism: {
    name: 'Pragmatism',
    desc: 'A belief’s truth is tied to how well it works and holds up through inquiry and practice.',
    found: 'Charles Sanders Peirce, William James and John Dewey.',
  },
  perspectivism: {
    name: 'Perspectivism',
    desc: 'All knowing happens from a perspective; there is no view from nowhere.',
    found: 'Friedrich Nietzsche.',
  },
  anekantavada: {
    name: 'Many-sidedness (anekāntavāda)',
    desc: 'Reality has many aspects, and different viewpoints can each capture part of the truth.',
    found: 'A central Jain teaching.',
  },
  rationalism: {
    name: 'Rationalism',
    desc: 'Reason can grasp important truths independently of sensory experience.',
    found: 'Plato, René Descartes, Baruch Spinoza and Gottfried Leibniz.',
  },
  empiricism: {
    name: 'Empiricism',
    desc: 'Knowledge comes chiefly from experience and observation.',
    found: 'John Locke, George Berkeley, David Hume and John Stuart Mill; the Cārvāka school also gave perception a central role.',
  },
  'contemplative-knowing': {
    name: 'Contemplative knowing',
    desc: 'Meditative, mystical or spiritual experience can reveal truths that ordinary reasoning cannot.',
    found: 'Found in many traditions, including Sufism, Christian mysticism, Yoga and Buddhist meditation.',
  },
  fallibilism: {
    name: 'Fallibilism',
    desc: 'We can know a great deal, but any belief could in principle turn out to be wrong.',
    found: 'Charles Sanders Peirce and Karl Popper.',
  },
  skepticism: {
    name: 'Philosophical skepticism',
    desc: 'We should doubt or suspend judgment about whether we can know reality.',
    found: 'Pyrrho and Sextus Empiricus in Greece; some read Zhuangzi in China as skeptical.',
  },
  pramana: {
    name: 'Several valid sources of knowledge',
    desc: 'Perception, inference, comparison and reliable testimony are each genuine ways of knowing.',
    found: 'The Nyāya school of Indian philosophy, which called these the pramāṇas.',
  },
  revelation: {
    name: 'Revelation',
    desc: 'Some truths are made known through sacred teaching or divine disclosure.',
    found: 'Central to Judaism, Christianity, Islam and Sikhism; the Vedas hold a related authority in Hindu thought.',
  },
  ineffability: {
    name: 'Ineffability',
    desc: 'The deepest truths cannot be fully put into words, only pointed toward.',
    found: 'The Daoist classic Daodejing, Zen Buddhism and apophatic theology.',
  },
  verificationism: {
    name: 'Verificationism',
    desc: 'A claim is meaningful only if experience could, in principle, confirm or disconfirm it.',
    found: 'The logical positivists of the Vienna Circle and A. J. Ayer.',
  },
  'epistemic-relativism': {
    name: 'Epistemic relativism',
    desc: 'What counts as justified belief depends on one’s culture or framework.',
    found: 'Debated in philosophy and anthropology since the twentieth century.',
  },
  platonism: {
    name: 'Platonism about abstract objects',
    desc: 'Numbers, logical truths and similar things exist timelessly, outside space.',
    found: 'Rooted in Plato; held by many mathematicians and logicians, including Kurt Gödel.',
  },
  mysterianism: {
    name: 'Mysterianism',
    desc: 'Some deep questions may be permanently beyond the reach of minds like ours.',
    found: 'Colin McGinn, especially regarding consciousness.',
  },

  // ── Morality ──
  'moral-realism': {
    name: 'Moral realism',
    desc: 'Some moral claims are objectively true, whatever anyone believes.',
    found: 'Plato; and contemporary philosophers such as Derek Parfit and Russ Shafer-Landau.',
  },
  'moral-constructivism': {
    name: 'Moral constructivism',
    desc: 'Moral truths are built by human reasoning or agreement, yet some constructions are genuinely better than others.',
    found: 'Contemporary readings of Kant; John Rawls and Christine Korsgaard.',
  },
  relativism: {
    name: 'Moral relativism',
    desc: 'What is right or wrong depends on one’s culture or society.',
    found: 'Ancient roots in Herodotus; widely debated in anthropology and ethics.',
  },
  expressivism: {
    name: 'Expressivism',
    desc: 'Moral statements express attitudes or feelings rather than describing facts.',
    found: 'A. J. Ayer, and later Simon Blackburn and Allan Gibbard; with roots in David Hume.',
  },
  deontology: {
    name: 'Duty-based ethics (deontology)',
    desc: 'Some acts are required or forbidden in themselves, whatever their consequences.',
    found: 'Immanuel Kant is the most influential source.',
  },
  consequentialism: {
    name: 'Consequentialism',
    desc: 'The rightness of an action depends on its outcomes.',
    found: 'Jeremy Bentham, John Stuart Mill and Peter Singer; the Chinese philosopher Mozi held a related view.',
  },
  'virtue-ethics': {
    name: 'Virtue ethics',
    desc: 'Ethics is about becoming a person of good character and living well.',
    found: 'Aristotle; Confucian ethics is often compared to it.',
  },
  'care-ethics': {
    name: 'Ethics of care',
    desc: 'Moral life centres on attentive responsiveness to the people who depend on us.',
    found: 'Carol Gilligan, Nel Noddings and Virginia Held.',
  },
  'ross-pluralism': {
    name: 'Moral pluralism',
    desc: 'There are several basic duties, such as keeping promises and preventing harm, and judgment is needed to weigh them.',
    found: 'W. D. Ross, The Right and the Good (1930).',
  },
  'dirty-hands': {
    name: 'Moral remainder',
    desc: 'Even a justified choice can involve a real wrong that deserves regret.',
    found: 'Bernard Williams on “agent-regret” and Michael Walzer on “dirty hands.”',
  },
  'cosmic-order': {
    name: 'Ethics as cosmic order',
    desc: 'Right action means living in harmony with an order that runs through the whole of reality.',
    found: 'Dharma in Indian thought, ma’at in ancient Egypt, and the Dao in Chinese thought, each understood differently.',
  },
  existentialism: {
    name: 'Existentialism',
    desc: 'We are not given a fixed nature or purpose; we define ourselves through our choices.',
    found: 'Jean-Paul Sartre and Simone de Beauvoir; Søren Kierkegaard is a religious forerunner.',
  },
  'special-obligations': {
    name: 'Special obligations',
    desc: 'We owe more to those we stand in close relationships with, such as family and community.',
    found: 'Confucian ethics (graded care beginning with family) and much contemporary moral philosophy.',
  },
  contractualism: {
    name: 'Contractualism',
    desc: 'Moral principles are those that everyone could reasonably agree to.',
    found: 'John Rawls and T. M. Scanlon; earlier social contract thinkers.',
  },
  'universal-compassion': {
    name: 'Compassion for all beings',
    desc: 'Moral concern extends to every being capable of suffering.',
    found: 'Buddhist karuṇā, Jain ahiṃsā (non-harm), and Peter Singer’s utilitarianism.',
  },
  privation: {
    name: 'Evil as privation',
    desc: 'Evil is not a thing in itself but an absence or corruption of good.',
    found: 'Augustine, building on Neoplatonism; developed by Aquinas.',
  },
  'evil-as-ignorance': {
    name: 'Wrongdoing as ignorance',
    desc: 'People do wrong mainly out of ignorance or confusion about what is truly good.',
    found: 'Socrates, as presented by Plato; Buddhist teaching on ignorance (avidyā) as a root of suffering.',
  },
  'evil-as-force': {
    name: 'Evil as a real force',
    desc: 'Evil is an active power or will opposed to the good.',
    found: 'Zoroastrian thought and many religious and literary traditions.',
  },
  retributivism: {
    name: 'Retributive justice',
    desc: 'Justice means giving people what they deserve for what they have done.',
    found: 'Immanuel Kant and many legal traditions.',
  },
  'restorative-justice': {
    name: 'Restorative justice',
    desc: 'Justice aims to repair harm and restore relationships between wrongdoers, victims and communities.',
    found: 'Practices in Māori, First Nations and other Indigenous communities, and modern restorative justice movements.',
  },

  // ── Existence ──
  teleology: {
    name: 'Cosmic purpose',
    desc: 'Reality has a purpose or direction, and human lives have a place within it.',
    found: 'Aristotle’s philosophy of nature and many religious worldviews.',
  },
  eudaimonism: {
    name: 'Flourishing (eudaimonia)',
    desc: 'A good life is one in which we realize our nature and exercise our best capacities.',
    found: 'Aristotle; versions appear in Confucian and Stoic thought.',
  },
  absurdism: {
    name: 'Absurdism',
    desc: 'We seek meaning from a universe that offers none; the response is to live fully and honestly in that tension.',
    found: 'Albert Camus, The Myth of Sisyphus (1942).',
  },
  'without-purpose': {
    name: 'Living without a purpose',
    desc: 'Life may be worth living without needing an overall purpose at all.',
    found: 'Daoist spontaneity, Zen Buddhism, and some readings of Camus.',
  },
  'mortality-meaning': {
    name: 'Mortality as meaning-giving',
    desc: 'The limits of life give our choices their weight and urgency.',
    found: 'Martin Heidegger on being-toward-death; Bernard Williams on the tedium of immortality.',
  },
  presence: {
    name: 'Presence',
    desc: 'Meaning is found in full attention to the present moment rather than in duration or legacy.',
    found: 'Zen Buddhism and Stoic practice, among others.',
  },
  hedonism: {
    name: 'Hedonism',
    desc: 'Pleasure and the absence of pain are what ultimately make a life go well.',
    found: 'Epicurus, who stressed tranquil pleasures over indulgence; Jeremy Bentham.',
  },
  liberation: {
    name: 'Liberation',
    desc: 'The highest good is freedom from craving, ignorance and the cycle of rebirth.',
    found: 'Mokṣa in Hindu and Jain thought, nirvāṇa in Buddhism.',
  },
  'desire-satisfaction': {
    name: 'Desire satisfaction',
    desc: 'A life goes well to the extent that a person gets what they want for themselves.',
    found: 'A standard view in contemporary ethics and economics.',
  },
  legacy: {
    name: 'Legacy',
    desc: 'Something of a person continues in memory, influence and what they hand on.',
    found: 'Common across cultures.',
  },
  interconnection: {
    name: 'Interconnection',
    desc: 'Every act ripples outward through a web of relationships, so nothing is wholly lost.',
    found: 'The Buddhist image of Indra’s net; also many ecological and Indigenous outlooks.',
  },
  logotherapy: {
    name: 'Meaning through suffering',
    desc: 'Even suffering can be met in a way that gives it meaning.',
    found: 'Viktor Frankl, Man’s Search for Meaning (1946).',
  },
  'cosmic-belonging': {
    name: 'Cosmic belonging',
    desc: 'Humans are part of the cosmos, made of the same matter, and can feel at home in it.',
    found: 'Religious naturalism and many nature-centred spiritualities.',
  },

  // ── The Beyond ──
  'immortal-soul': {
    name: 'The immortal soul',
    desc: 'The person continues after death as a soul.',
    found: 'Plato, and much of Jewish, Christian, Islamic and Hindu thought.',
  },
  resurrection: {
    name: 'Resurrection',
    desc: 'The person will be raised to new embodied life.',
    found: 'Jewish, Christian and Islamic teaching.',
  },
  reincarnation: {
    name: 'Reincarnation',
    desc: 'A soul or self is reborn in new lives.',
    found: 'Hindu, Jain and Sikh thought; Pythagoras and Plato in ancient Greece.',
  },
  rebirth: {
    name: 'Rebirth without a fixed self',
    desc: 'A stream of causes and tendencies continues into new lives, but no unchanging soul passes between them.',
    found: 'Buddhist teaching.',
  },
  'timeless-eternity': {
    name: 'Timeless eternity',
    desc: 'God or ultimate reality exists outside time altogether.',
    found: 'Augustine, Boethius and much classical theology.',
  },
  epicurean: {
    name: 'The Epicurean view of death',
    desc: 'Death is nothing to us: when it arrives, we are no longer there to experience it.',
    found: 'Epicurus, Letter to Menoeceus; developed by Lucretius.',
  },
  'memento-mori': {
    name: 'Remembering death',
    desc: 'Keeping death in mind clarifies what matters.',
    found: 'Stoic practice, Buddhist meditation on impermanence, and Christian monastic tradition.',
  },
  'union-with-god': {
    name: 'Union or communion with God',
    desc: 'The final fulfilment of a person lies in closeness to, or union with, God.',
    found: 'Jewish, Christian and Islamic mysticism, and Hindu devotional (bhakti) traditions.',
  },
  'ancestor-veneration': {
    name: 'Ancestral presence',
    desc: 'The dead remain present and in relationship with the living.',
    found: 'Many African, East Asian and Indigenous traditions.',
  },
  // ── Added in revision 2 (scoring audit): finer distinctions ──
  atheism: {
    name: 'Atheism',
    desc: 'There is no God or divine reality. On its own, this does not settle whether reality is purely physical, or whether life can be spiritual.',
    found: 'Held in many forms: Jain thought rejects a creator God while affirming eternal souls, Mīmāṃsā philosophers argued against a creator, and modern atheism is often, though not always, combined with naturalism.',
  },
  'argument-from-evil': {
    name: 'The argument from evil',
    desc: 'The amount and kinds of suffering count against a God who is both all-powerful and wholly good. On its own, this leaves other conceptions of the divine open.',
    found: 'David Hume’s Dialogues Concerning Natural Religion; J. L. Mackie (1955) and William Rowe (1979) in modern philosophy.',
  },
  'religion-as-human-creation': {
    name: 'Religion as a human creation',
    desc: 'Religious traditions are best understood as products of human culture, psychology and society.',
    found: 'Ludwig Feuerbach, Émile Durkheim and much of the social-scientific study of religion.',
  },
  evidentialism: {
    name: 'Evidentialism',
    desc: 'It is right to believe something only to the degree that the evidence supports it.',
    found: 'W. K. Clifford, “The Ethics of Belief” (1877); David Hume held a related principle.',
  },
  'causal-determinism': {
    name: 'Causal determinism',
    desc: 'Every event, including every choice, is fixed by prior causes and the laws of nature. On its own, this says nothing about whether we are free.',
    found: 'Classically stated by Laplace; accepted both by hard determinists and by many compatibilists.',
  },
  fatalism: {
    name: 'Fatalism',
    desc: 'What will happen will happen whatever we do, so our efforts make no difference to the outcome. This differs from determinism, in which our actions are among the causes of what happens.',
    found: 'The ancient “idle argument,” reported by Cicero in On Fate and answered by the Stoic Chrysippus.',
  },
  predestination: {
    name: 'Predestination',
    desc: 'God has ordained in advance what will happen, in some accounts including each person’s ultimate destiny. This differs from foreknowledge, which is knowing in advance rather than ordaining.',
    found: 'Augustine and John Calvin in Christianity; debates over qadar (divine decree) in Islamic theology.',
  },
  'enduring-self': {
    name: 'The enduring self',
    desc: 'There is a real self that persists through and has all of one’s experiences. On its own, this does not say whether that self is physical or non-physical.',
    found: 'Defended in different forms by Thomas Reid, by Nyāya philosophers against Buddhist critics, and by many contemporary philosophers.',
  },
  'logical-empiricism': {
    name: 'Logical empiricism',
    desc: 'Only truths of logic and meaning can be known by thought alone; every fact about the world depends on experience.',
    found: 'The Vienna Circle and A. J. Ayer, anticipated by Hume’s distinction between relations of ideas and matters of fact.',
  },
  'meaningful-cosmos': {
    name: 'A meaningful cosmos',
    desc: 'The universe is not indifferent; reality is in some way hospitable to value and meaning. This does not by itself require belief in God.',
    found: 'Stoic and Neoplatonic thought, many religious traditions, and some non-religious philosophies of nature.',
  },
  'sense-of-the-sacred': {
    name: 'A sense of the sacred',
    desc: 'The world can be experienced as sacred or holy, whether or not one believes in God.',
    found: 'Rudolf Otto’s study The Idea of the Holy (1917); religious naturalism; many contemplative and nature-centred spiritualities.',
  },
  'meaning-as-fit': {
    name: 'Meaning as fitting love',
    desc: 'A life is meaningful when what a person loves is also genuinely worth loving, so meaning is neither wholly made nor wholly found.',
    found: 'Susan Wolf, Meaning in Life and Why It Matters (2010).',
  },
  'irreducible-mystery': {
    name: 'Irreducible mystery',
    desc: 'Reality contains a depth that can be encountered but never fully grasped. This need not be understood theistically.',
    found: 'Gabriel Marcel’s distinction between a problem to be solved and a mystery in which we participate; also many mystical and contemplative traditions.',
  },
  'objective-immortality': {
    name: 'Objective immortality',
    desc: 'The dead live on by being forever known and held by God, even if not as continuing conscious selves.',
    found: 'Process theology: Alfred North Whitehead and especially Charles Hartshorne.',
  },
};

export function positionName(id) {
  return POSITIONS[id]?.name ?? id;
}
