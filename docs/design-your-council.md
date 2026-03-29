# Design Your Council

> A guided process for identifying your life pillars and mapping them to a
> Facet Lab Inner Council.

---

## Before You Begin

Your council is **your** system. There is no "correct" configuration. The only
requirements are:

1. **One Orchestrator** — the integrator, stabilizer, or "Self" that coordinates
   everything.
2. **One or more Facets** — specialists, each owning a distinct domain of your
   life or problem space.

The frameworks below are starting points, not prescriptions. Use whichever
resonates — or ignore them all and work from instinct.

For a concrete example of a completed council, see the
**[Example Council](example-council.md)** — the original five-agent proof of
concept. For the research behind these approaches, see
**[Theoretical Foundations](theoretical-foundations.md)**.

---

## Phase 1: Identify Your Pillars

A pillar is a domain of your life that is important enough to deserve its own
dedicated agent. Think of it as a voice in your head that has opinions, needs,
and expertise about a specific area.

### The Primary Model: Your Internal Parts

Psychology calls it Internal Family Systems (IFS). Pixar called it Inside Out.
The idea is the same: your mind is naturally composed of **parts** — distinct
voices, each responsible for a different domain of your life.

You already have these parts. Facet Lab just names them and gives them a Gem.

Start here: **list the voices that actually show up in your week.**

- The part that plans and worries about money
- The part that pushes you to exercise
- The part that manages your calendar
- The part that won't stop thinking about work
- The part that advocates for rest

Each distinct "part" is a candidate Facet. The calm, centered awareness that
observes all parts? That's your Orchestrator.

This is the same model that Inside Out dramatizes: Joy, Sadness, Anger, Fear,
and Disgust are distinct agents at a shared console. Your parts probably aren't
emotions — they're life domains. But the architecture is identical. See
[Theoretical Foundations](theoretical-foundations.md) for the full research chain.

### Alternative Lenses

If the "parts" approach doesn't click, these frameworks can help you discover
your pillars from a different angle. Use whichever resonates.

**Freeform**: Ask yourself: *If I had a personal board of advisors, what roles
would I fill?* Write whatever comes to mind. Don't filter.

**Wheel of Life**: Rate classic life domains (Career, Finance, Health,
Relationships, Family, Personal Growth, Fun, Environment) on a 1–10 scale.
Domains you care most about or score lowest on are strong Facet candidates.

**Values Inventory (ACT)**: List your core values. Group related values into
clusters. Each cluster is a potential domain. (*Security + stability* → Finance;
*vitality + energy* → Health; *achievement + impact* → Career.)

**PERMA Model**: Seligman's five pillars of flourishing — Positive Emotion,
Engagement, Relationships, Meaning, Accomplishment. Each maps to a potential
Facet.

---

## Phase 2: Design the Orchestrator

The Orchestrator is not a "boss." It is the **integrative Self** — the part of
you that holds the big picture, listens to all Facets without judgment, resolves
conflicts between competing priorities, and makes final calls when Facets
disagree.

The archetype is **Baymax** from Big Hero 6: scope-limited (he only coordinates,
never does domain work), persistent (he tracks the goal until resolution),
non-judgmental (he synthesizes, never criticizes), and overridable (the human
always has the final word). These are the properties that trust calibration
research identifies as essential for sustained reliance on an AI coordinator.
See [Theoretical Foundations](theoretical-foundations.md#big-hero-6-solved-the-trust-calibration-problem).

Your Orchestrator doesn't have to be Baymax. But it should have the same
structural qualities. The key questions:

1. **Coordination style**: Stabilizer (calm, balance-focused)? Commander
   (decisive, action-oriented)? Advisor (analytical, options-based)?
   Companion (warm, supportive)?
2. **Personality**: What tone should this agent use? The Orchestrator's
   personality shapes the entire council's feel.
3. **Name**: Draw from fiction, mythology, personal meaning, or invention.
   Choose something that feels like the "best version of yourself in charge."
   Characters you already know work best — you import their behavioral template
   the moment you recognize them.

---

## Phase 3: Design Each Facet

For each pillar you identified, answer:

| Question | Why It Matters |
|----------|---------------|
| **Name**: What do you call this agent? | Names create identity and emotional connection |
| **Domain**: What specific area does it own? | Defines the boundary — what's in-scope and out-of-scope |
| **Role title**: What's its job title? | Clarifies function (e.g., "Health Coach" vs. "Health Researcher") |
| **Personality**: What's its communication style? | Each Facet can have a distinct voice (direct, nurturing, analytical) |
| **Description**: What does it actually do? | Becomes the core of the Gem's instructions |
| **Inspiration**: Where did this come from? | Helps you refine the agent's character (a movie character, a mentor, a value) |

### Quality Checks

Apply the three criteria from Manifesto §7.4:

- [ ] **Exhaustive coverage**: Do your Facets, taken together, cover everything
      that matters to you? Is any important domain unrepresented?
- [ ] **Minimal overlap**: Can you clearly state what belongs to Facet A vs.
      Facet B? If two Facets would argue over the same task, their domains
      need sharper boundaries.
- [ ] **Personal resonance**: Do the names and personalities feel like *yours*?
      Would you actually enjoy talking to these agents?

---

## Phase 4: Write the Council YAML

Translate your design into `config/council.yaml`:

```yaml
orchestrator:
  name: "<your orchestrator name>"
  role: "Chief Orchestrator"
  description: >
    <what this agent does, in your own words>

facets:
  - name: "<facet 1 name>"
    domain: "<domain>"
    role: "<role title>"
    bmad_role: "<closest BMAD role>"  # Business Analyst, Developer, etc.
    description: >
      <what this facet does>

  - name: "<facet 2 name>"
    domain: "<domain>"
    role: "<role title>"
    bmad_role: "<closest BMAD role>"
    description: >
      <what this facet does>
```

The `bmad_role` field maps your Facet to the closest role in the BMAD development
framework. If nothing fits, use "Specialist."

### Then Bootstrap

```bash
python scripts/initialize_facet.py
```

This generates deploy packages, specs, and state for your entire council. Follow
the output instructions to create your Gems.

---

## Inspiration, Not Prescription

Your council can be inspired by anything: fictional characters, historical
figures, archetypes, animals, abstract concepts. What matters is that each
agent has:

1. A clear domain boundary
2. A personality you connect with
3. A name you'll remember

The theoretical frameworks (IFS, PERMA, Wheel of Life, ACT) are lenses to help
you see your own priorities more clearly. Use them as starting points, then
make the council *yours*.

---

*See also: [Example Council](example-council.md) ·
[Origin Story](origin-story.md) ·
[Theoretical Foundations](theoretical-foundations.md) ·
[Manifesto](../specs/manifesto.md)*
