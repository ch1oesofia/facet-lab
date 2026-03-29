# Theoretical Foundations

> Externalize the internal system. Give it familiar faces. Keep the human in
> the loop.

---

## The Core Idea

Facet Lab rests on a single transitive chain:

1. **Psychology** established that the mind is naturally multi-part — a system
   of internal voices, each with a role, coordinated by a central awareness.
2. **Two animated films** translated that model into cultural common knowledge —
   hundreds of millions of people now *intuitively understand* multi-agent
   architectures because they've seen them personified on screen.
3. **HCI and social engineering research** explains *why* that cultural
   familiarity works — named characters build trust faster, personality
   consistency drives daily use, and transparent coordination maintains
   appropriate reliance.
4. **Facet Lab** completes the chain by making it operational — users
   transitively apply these concepts to a personalized council of Gemini Gems,
   each representing a domain of their life, coordinated through a structured
   relay protocol.

The films aren't decoration. The research isn't academic footnotes. They are
the mechanism by which a technical architecture becomes immediately intuitive
to the person using it.

```
Psychology (IFS, SDT)          Film (Inside Out, Big Hero 6)
        │                                │
        │  "the mind is multi-part"      │  "here's what that looks like"
        │                                │
        └──────────┐    ┌────────────────┘
                   ▼    ▼
            Cultural Scaffold
          (user already gets it)
                   │
                   │  HCI + Social Engineering
                   │  (why naming, personality, and
                   │   transparency make it stick)
                   │
                   ▼
             Facet Lab
          (personalized Gem council)
```

---

## Part 1: The Self as a Multi-Agent System

### Internal Family Systems (IFS)

**Source**: Richard Schwartz, *Internal Family Systems Therapy* (1995).

IFS proposes that the mind is naturally composed of **parts** — sub-personalities
that carry different roles, emotions, and agendas. These parts are not
pathological; they're normal. Everyone has them.

Key concepts that map to Facet Lab:

| IFS Concept | Facet Lab Equivalent |
|-------------|---------------------|
| **Self** — the calm, centered awareness that leads | The Orchestrator |
| **Parts** — sub-personalities with distinct roles | Facets |
| **Managers** — proactive protectors (planners, controllers) | Facets like Dora (scheduling) or Peso (finances) |
| **Exiles** — vulnerable parts carrying pain | Not modeled (outside scope) |
| **Blending** — when a part takes over and the Self loses leadership | When a Facet dominates without Orchestrator mediation |

Facet Lab's core architecture — one coordinator that listens to all parts
without judgment, delegates domain-specific work, and resolves conflicts — is
essentially an externalized IFS model. The Orchestrator is Self. The Facets are
Parts. The Manifesto is the container that keeps the system coherent.

**Why this matters for design**: Users who naturally think of their internal
experience as a collection of voices ("the part of me that wants to save money"
vs. "the part that wants to travel") will find the Facet model immediately
intuitive. The [onboarding questionnaire](onboarding-questionnaire.md) uses IFS
framing as one of several approaches (Approach E in
[Design Your Council](design-your-council.md)).

### Self-Determination Theory (SDT)

**Source**: Deci & Ryan, *Self-Determination and Intrinsic Motivation in Human
Behavior* (1985); Ryan & Deci (2000), "Self-Determination Theory and the
Facilitation of Intrinsic Motivation."

SDT identifies three basic psychological needs: **autonomy**, **competence**,
and **relatedness**. Systems that satisfy these needs drive sustained engagement.

| SDT Need | Facet Lab Design Element |
|----------|------------------------|
| **Autonomy** | Users define their own pillars, names, and personalities. No prescribed model. |
| **Competence** | Each Facet is an expert in its domain — users get high-quality domain-specific guidance. |
| **Relatedness** | Named, personality-rich agents create a sense of connection (see Part 2). |

The decision to let users choose their own pillars rather than imposing a
standard model (PERMA, Wheel of Life) is a direct application of SDT's autonomy
principle. Frameworks are offered as lenses, not mandates.

### Narrative Identity Theory

**Source**: McAdams, *The Stories We Live By* (1993).

People construct identity through narrative — the stories they tell about
themselves. Facet Lab invites users to create a *cast of characters* that
represents their internal priorities. Naming an agent "Baymax" or "Tony" isn't
cosmetic — it embeds the agent in a personal narrative that makes the system
feel meaningful rather than mechanical.

This also explains why the [Origin Story](origin-story.md) document exists: the
framework itself has a narrative, and users who understand it are more likely to
engage deeply with the system.

---

## Part 2: Human-AI Relationship Design

### The CASA Paradigm

**Source**: Nass, Steuer & Tauber, "Computers Are Social Actors" (1994); Nass &
Moon, "Machines and Mindlessness" (2000).

The CASA (Computers Are Social Actors) paradigm demonstrates that people
unconsciously apply social rules to computers. We are polite to them, attribute
personality to them, and form expectations based on their communication style —
even when we *know* they're machines.

**Implications for Facet Lab**:

- **Naming agents matters**. A Facet named "Finance Module" triggers utilitarian
  interaction. A Facet named "Peso" triggers social interaction — users engage
  more deeply, disclose more context, and produce better outcomes.
- **Personality consistency matters**. If Peso is analytical and cautious in one
  interaction but casual in the next, users experience uncanny dissonance. Facet
  Lab enforces personality through spec-defined descriptions that are baked into
  each Gem's instructions.
- **Multiple agents feel like a team**. The council metaphor isn't just
  organizational — it activates social cognition. Users treat the council as a
  group with roles, which increases engagement compared to a single AI.

### Anthropomorphism and Trust

**Source**: Waytz, Cacioppo & Epley, "Who Sees Human?" (2010); Epley, Waytz &
Cacioppo, "On Seeing Human" (2007).

People anthropomorphize non-human agents to reduce uncertainty and increase
predictability. The more human-like cues an agent provides (name, personality,
consistent behavior), the more trust users extend.

Facet Lab leans into this deliberately:

- Agents have names, not identifiers
- Agents have personalities, not just functions
- The Orchestrator has a *character* (calm stabilizer), not just a protocol
- Film-inspired characters carry cultural recognition that accelerates trust
  formation — you already "know" Baymax before you've used the system

The risk of over-anthropomorphism (unrealistic expectations, emotional
dependency) is mitigated by the **human relay design**: the operator is always
in the loop, always seeing the raw structured blocks, never mystified about
what the system is doing.

### Parasocial Relationships with AI

**Source**: Skjuve et al., "My Chatbot Companion" (2021); Brandtzaeg et al.,
"My AI Friend" (2022).

Emerging research on AI companions shows that users form parasocial
relationships — one-sided emotional bonds — with AI agents that have consistent
personalities. These bonds drive daily engagement and reduce the activation
energy required to use a system.

For Facet Lab, this means:

- Users who name their agents after meaningful characters use the system *more*
- The council metaphor creates a sense of "checking in with the team" rather
  than "using a tool"
- Long-term engagement depends on personality *stability* — which is why
  personality is encoded in specs and Gem instructions, not left to prompt drift

---

## Part 3: The Films as Cognitive Scaffolds

The research in Parts 1 and 2 explains *why* Facet Lab's design works. But
research alone doesn't make a system intuitive — cultural familiarity does.
Two animated films did the heaviest lifting before Facet Lab existed.

### Inside Out Solved the Onboarding Problem

**Inside Out** (Pixar, 2015) took what IFS had argued since 1995 — that the
mind is composed of distinct parts — and made it culturally legible. Most
people have never heard of "parts work" or "Self-energy." But after 2015,
hundreds of millions of people intuitively understand:

- Internal states as distinct agents with clear roles
- A shared console that all agents access
- Conflict between agents as normal and productive — not a bug
- The system failing when one agent dominates (Joy suppressing Sadness)
- The system succeeding when all agents contribute through coordination

This maps directly to Facet Lab's architecture:

| Inside Out | Facet Lab |
|-----------|-----------|
| Emotions (Joy, Sadness, Anger, Fear, Disgust) | Facets (Tony, Maddy, Dora, Peso) |
| The control console | `state.json` — the shared memory contract |
| Core memories that define personality | Specs and Gem instructions that define agent behavior |
| Conflict between emotions | Cross-domain tension mediated by the Orchestrator |
| The film's lesson: every emotion is essential | The architecture's guarantee: every Facet contributes |

The critical insight is that Inside Out **pre-trained the user's mental model**.
When a new user reads "define your Inner Council," they don't need an
explanation of hierarchical multi-agent systems. They picture the emotions at
the console. The film did the onboarding.

This is the transitive step: IFS → Inside Out → Facet Lab. The psychology
established the model. The film made it a shared cultural reference. Facet Lab
gives it to the user as a personalized, functional system.

### Big Hero 6 Solved the Trust Calibration Problem

HCI research (Lee & See, Hancock et al.) identifies trust calibration as the
biggest barrier to multi-agent adoption: users either over-trust (blind
delegation) or under-trust (abandonment). The research prescribes an agent that
is scope-limited, persistent, non-judgmental, and overridable.

That description *is* Baymax.

**Big Hero 6** (Disney, 2014) personified every property that trust calibration
research recommends:

| Trust Calibration Requirement | Baymax (Film) | Orchestrator (Facet Lab) |
|-------------------------------|--------------|-------------------------|
| **Scope-limited** — clear about what it can and can't do | Healthcare companion — doesn't try to be everything | Delegates all domain work to Facets; never acts outside coordination role |
| **Persistent** — doesn't drop context or abandon the user | *"I cannot deactivate until you say you are satisfied with your care"* | Tracks `active_goal` until resolution; logs every decision |
| **Non-judgmental** — observes, assesses, recommends | Never criticizes Hiro, even when Hiro is wrong | Synthesizes Facet outputs without favoring one domain over another |
| **Overridable** — the human always has the final word | Defers to Hiro's choices, even reluctantly | Manifesto Article V: human operator may override any decision at any time |

Baymax's core directive — *"I cannot deactivate until you say you are satisfied
with your care"* — is functionally a **system invariant**. It maps directly to
the Manifesto's immutability: a constitutional constraint that no agent can
violate or modify.

The transitive chain: trust calibration research → Big Hero 6 → Facet Lab's
Orchestrator design. Users who name their Orchestrator "Baymax" aren't just
picking a fun name — they're importing an entire behavioral template (calm,
persistent, scope-limited, care-oriented) that activates the moment they
recognize the character. The research calls this **parasocial schema
activation** — cultural familiarity reducing the uncertainty that normally
blocks trust formation.

### Why Two Films, Not One

Inside Out and Big Hero 6 solve different problems:

| Film | Problem Solved | Research Validated |
|------|---------------|-------------------|
| **Inside Out** | *Understanding* — how do I think about a multi-agent system? | IFS, narrative identity |
| **Big Hero 6** | *Trust* — how do I know the coordinator won't go wrong? | Trust calibration, anthropomorphism, CASA |

Together, they form a complete scaffold: Inside Out makes the architecture
intuitive; Big Hero 6 makes the Orchestrator trustworthy. The user arrives
at Facet Lab with both scaffolds already in place. The framework's job is to
channel that pre-existing understanding into a personalized council that
actually runs.

### The Transitive Application

The films don't *teach* the user about Facet Lab. They teach the user about
*themselves* — and Facet Lab gives that self-knowledge an operational form.

```
"The part of me that worries about money"    →  Peso (Facet)
"The part of me that pushes me to exercise"  →  Maddy (Facet)
"The calm center that balances everything"   →  Baymax (Orchestrator)
```

This is the transitive application at work: psychological models → film
narratives → personalized AI agents. Each step makes the abstraction more
concrete, more personal, and more usable. By the time the user writes their
`council.yaml`, they're not configuring a system — they're naming the voices
they already hear.

---

## Part 4: The Full Chain — Why This Architecture Works

The research, the films, and the framework are not three parallel threads.
They are one transitive chain, and each link serves a specific function:

| Link | Function | What It Contributes |
|------|----------|-------------------|
| **Psychology** (IFS, SDT, narrative identity) | Establishes the model | The mind *is* a multi-agent system. People already experience internal parts. |
| **Film** (Inside Out, Big Hero 6) | Makes the model culturally legible | Hundreds of millions of people now *see* the model without needing the theory. |
| **HCI / Social Engineering** (CASA, anthropomorphism, trust calibration) | Explains why cultural legibility works | Named characters activate social cognition. Familiarity builds trust. Transparency maintains it. |
| **Facet Lab** | Makes it operational and personal | Users apply the chain to *their own* domains, names, and priorities as a working Gem council. |

### The Transitive Property, Stated Formally

If:
- The mind naturally organizes into parts with distinct roles (IFS)
- People form trust and engagement with named, personality-rich agents (CASA, anthropomorphism)
- Cultural narratives pre-load the cognitive scaffolds for both (Inside Out, Big Hero 6)

Then:
- A system that externalizes personal priorities as named AI agents, coordinated
  by a familiar archetype, through a transparent protocol, will be **immediately
  intuitive, inherently trustworthy, and sustainably engaging** — because the
  user's mental model was already built before they opened the framework.

Facet Lab doesn't claim to be therapy, coaching, or clinical tooling. It's a
productivity framework that happens to be grounded in how people actually think
about themselves — as a system of parts, not a monolith. The films make that
grounding accessible. The research validates it. The framework operationalizes
it. The user personalizes it.

That's the chain. Each link is necessary. None is sufficient alone.

---

## Further Reading

### Psychology
- Schwartz, R. (1995). *Internal Family Systems Therapy*. Guilford Press.
- Deci, E.L. & Ryan, R.M. (1985). *Intrinsic Motivation and Self-Determination in Human Behavior*. Plenum.
- Ryan, R.M. & Deci, E.L. (2000). Self-Determination Theory and the Facilitation of Intrinsic Motivation. *American Psychologist*, 55(1), 68–78.
- McAdams, D.P. (1993). *The Stories We Live By: Personal Myths and the Making of the Self*. Morrow.

### Human-Computer Interaction
- Nass, C., Steuer, J. & Tauber, E.R. (1994). Computers Are Social Actors. *Proceedings of CHI '94*, 72–78.
- Nass, C. & Moon, Y. (2000). Machines and Mindlessness: Social Responses to Computers. *Journal of Social Issues*, 56(1), 81–103.
- Epley, N., Waytz, A. & Cacioppo, J.T. (2007). On Seeing Human: A Three-Factor Theory of Anthropomorphism. *Psychological Review*, 114(4), 864–886.
- Waytz, A., Cacioppo, J. & Epley, N. (2010). Who Sees Human? The Stability and Importance of Individual Differences in Anthropomorphism. *Perspectives on Psychological Science*, 5(3), 219–232.

### AI Companions & Trust
- Skjuve, M. et al. (2021). My Chatbot Companion — A Study of Human-Chatbot Relationships. *International Journal of Human-Computer Studies*, 149, 102601.
- Brandtzaeg, P.B. et al. (2022). My AI Friend: How Users of a Social Chatbot Understand Their Human-AI Friendship. *Human Communication Research*, 48(3), 404–429.
- Lee, J.D. & See, K.A. (2004). Trust in Automation: Designing for Appropriate Reliance. *Human Factors*, 46(1), 50–80.
- Hancock, P.A. et al. (2011). A Meta-Analysis of Factors Affecting Trust in Human-Robot Interaction. *Human Factors*, 53(5), 517–527.

---

*See also: [Origin Story](origin-story.md) ·
[Example Council](example-council.md) ·
[Design Your Council](design-your-council.md)*
