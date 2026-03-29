# Origin Story

> How a personal experiment in AI coordination became a reusable framework.

---

## The Problem

Modern AI assistants are powerful but singular. You get one conversation, one
personality, one context window. For simple questions that's fine. But life isn't
a single domain — it's a system of competing priorities, each requiring different
expertise, different tone, different context.

What if, instead of one general-purpose AI, you had a **team** — each member an
expert in a domain that matters to you, coordinated by an integrator that holds
the big picture?

---

## The Spark: Animated Inner Worlds

The initial inspiration came from two films that externalize the invisible:

**Inside Out** (Pixar, 2015) gives personality to the emotions inside a child's
mind. Joy, Sadness, Anger, Fear, and Disgust aren't metaphors — they're *agents*,
each with a clear role, each acting on behalf of the whole person. They coordinate
(sometimes badly) at a shared console. The film's genius is making an internal
system visible, relatable, and functional.

**Big Hero 6** (Disney, 2014) introduces Baymax — a healthcare companion whose
entire identity is defined by a single directive: *"I cannot deactivate until you
say you are satisfied with your care."* Baymax is calm, persistent, and
scope-limited. He doesn't try to be everything. He's a stabilizer — the agent
you'd want coordinating the others.

These aren't just fun references. They're intuitive demonstrations of multi-agent
architectures: distinct roles, clear boundaries, a shared mission, and a
coordination layer that keeps the system coherent.

---

## The Proof of Concept: A Personal Council

The idea became concrete with Google's Gemini Gems. Gems let you create custom
AI personas with specific instructions and grounding documents — effectively,
you can build specialist agents.

The first council was personal — four Facets and one Orchestrator, designed
around the creator's own life pillars:

| Agent | Inspiration | Domain | Role |
|-------|------------|--------|------|
| **Baymax** | Big Hero 6 | HQ / Coordination | Orchestrator — the calm stabilizer |
| **Tony** | — | Career | Professional growth and strategy |
| **Maddy** | — | Health & Wellness | Physical and mental wellbeing |
| **Dora** | — | Calendar & Scheduling | Time coordination and dispatch |
| **Peso** | — | Finances | Economic security and planning |

These weren't chosen from a textbook. They came from asking a simple question:
*What are the domains I actually think about every day?* Career, health, time,
and money. Four pillars. Four agents. One coordinator.

The Orchestrator — named Baymax — set the tone. His personality was drawn
directly from the film: calm, patient, focused on balance, never overstepping.
When two Facets had competing demands on time, Baymax didn't pick a winner — he
synthesized a response that honored both.

Communication between Gems used a manual relay protocol: the Orchestrator would
output structured Delegation Blocks, which the operator would copy-paste into
the target Facet's Gem. The Facet would respond with a Report Block, pasted
back to the Orchestrator. Mechanical relay, structured reasoning.

It worked. The system produced better outputs than a single general-purpose
chat because each Facet maintained deep context in its domain, and the
Orchestrator prevented any single domain from monopolizing attention.

---

## From Personal Tool to Framework

The proof of concept revealed a pattern: the architecture was domain-agnostic.
Everything specific to the creator's life — the names, the domains, the
personalities — was configuration, not code. The underlying structure was
always the same:

1. Define domains
2. Assign agents to domains
3. Give each agent instructions and context
4. Coordinate through a single root agent
5. Communicate through a shared protocol

If that structure could be extracted into a template, anyone could build their
own council from their own priorities. That extraction became **Facet Lab**.

### What Changed

| POC (personal) | Framework (Facet Lab) |
|----------------|----------------------|
| Hardcoded agent instructions | Generated from `council.yaml` + template |
| Manual state tracking | Structured `state.json` shared contract |
| Ad-hoc relay messages | Formal Delegation/Report Block protocol |
| One council (the creator's) | Any council, from any user's pillars |
| No onboarding | Guided design process with psychological frameworks |
| No governance | Manifesto, Constitution, spec-first discipline |

### Key Design Decisions

- **Local-first**: The Lab (VS Code) owns the specs and generates everything.
  Gems are the runtime, not the source of truth.
- **Spec-driven**: The BMAD Method enforces that every component has a
  specification before it has an implementation. This prevents agent drift.
- **Human relay by design**: The copy-paste protocol isn't a limitation — it's
  a feature. The operator stays in the loop, maintaining oversight and trust.
  When Gem-to-Gem communication becomes possible, the protocol can be automated
  without changing the architecture.
- **Personality matters**: The frameworks in [Design Your Council](design-your-council.md)
  aren't decoration. Research in human-computer interaction shows that
  anthropomorphism, naming, and personality design significantly affect user
  engagement and trust. See [Theoretical Foundations](theoretical-foundations.md).

---

## Where It's Going

Facet Lab is now a framework, not a personal tool. The creator's council (Baymax,
Tony, Maddy, Dora, Peso) lives on as the [reference example](example-council.md)
— a proof that the architecture works in practice.

The system is designed to evolve:

- New Facets can be added through the [OpenSpec](../openspec/config.yaml) cycle
- The [Manifesto](../specs/manifesto.md) governs the laws; the human operator
  governs the Manifesto
- The theoretical foundation continues to deepen as evidence-based research is
  integrated into the design rationale

Facet Lab started as a question: *What if my internal board of advisors could
actually talk?* It turns out the answer is an architecture.

---

*See also: [Example Council](example-council.md) ·
[Theoretical Foundations](theoretical-foundations.md) ·
[Design Your Council](design-your-council.md)*
