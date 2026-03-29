# Product Positioning

> Why Facet Lab exists, what it adds over baseline Gemini Gems, and how it
> exemplifies Spec-Driven Development (SDD) and Hierarchical Multi-Agent
> Systems (HMAS).

---

## Facet Lab vs. Gemini Gems Alone

Gemini Gems are powerful but they're single-agent tools. You get one Gem with
one system prompt. The user has to carry all the context in their head —
manually deciding which Gem to open, what to tell it, how to frame the request,
and what to do with the output.

Facet Lab adds three things Gems don't have:

1. **Structure** — a defined hierarchy (one Orchestrator, N specialists) so the
   *system* knows who owns what, not just the user. Cross-domain questions have
   a protocol instead of just confusion.

2. **Protocol** — the Delegation Block / Report Block relay pattern turns
   freeform chat into a structured handoff system. Responses are predictable,
   auditable, and composable.

3. **Council coherence** — each Gem's instructions reference the others by
   name, domain, and boundary. Tony knows Peso owns financial tradeoffs. Dora
   knows she doesn't prioritize — Baymax does. This produces meaningfully
   better answers than five unrelated Gems.

The result: Facet Lab turns Gemini Gems from a drawer of tools into a
functioning team.

---

## How Facet Lab Specs Differ from Baseline Gemini Gem Specs

**Baseline Gemini Gem spec** is a single free-text "Instructions" field —
essentially a system prompt you write yourself. There's no schema, no enforced
structure, no relationship to other Gems. It's a blank textarea.

**Facet Lab's generated spec** has five structural layers the baseline doesn't:

1. **Identity section** — `# Name — Role` header, explicit domain ownership,
   and a named reporting relationship (`"You report to Baymax"`). The agent
   knows its place in the hierarchy.

2. **Boundary enforcement** — an explicit *Prime Directives* block that names
   what the agent must NOT do and which sibling owns the adjacent domain.
   Baseline Gems have no concept of siblings.

3. **Data Access Contract** — declared extensions, Gmail scope, Sheets name,
   and external ingest sources are written directly into the spec. Baseline
   Gems let the model hallucinate what data it has access to.

4. **Relay Protocol** — structured Delegation Block / Report Block templates
   are embedded in every Facet and the Orchestrator. The communication format
   is part of the spec, not an afterthought.

5. **Council awareness** — each spec includes the full roster of sibling Facets
   with their domains. The agent knows who else exists. A baseline Gem knows
   nothing outside its own prompt.

The practical effect: a Facet Lab spec produces an agent that knows its role,
its limits, its collaborators, and its communication protocol. A baseline Gem
spec produces an agent that knows its topic. Every Facet Lab spec is also
reproducible — it's rendered from `council.yaml`, not handwritten.

---

## How Facet Lab Exemplifies HMAS

A Hierarchical Multi-Agent System distributes cognition across specialized
agents arranged in a command hierarchy — a coordinator at the top delegates to
domain experts below. Facet Lab is a textbook instance:

- **Hierarchy** — one Orchestrator holds the top node. It never handles domain
  work itself; it routes, delegates, and synthesizes.
- **Specialization** — each Facet owns a single life domain and is explicitly
  prohibited from crossing boundaries via the Data Access Contract.
- **Structured communication** — agents don't free-chat. The Orchestrator emits
  a *Delegation Block*; the Facet returns a *Report Block*. The protocol is
  fixed, making the system predictable and auditable.
- **Emergent intelligence** — no single Gem understands your whole life, but
  the council collectively does. Meaning arises from the relay, not any one
  agent.

The human acts as the message bus — intentionally. This keeps the user in
control and Gemini's sandboxed Gems from needing cross-agent APIs that don't
exist yet.

---

## How Facet Lab Is Spec-Driven Development (SDD)

Every agent is generated from a *specification*, not from freeform prompting:

- `council.yaml` is the source of truth — names, roles, domains, data access.
- Each Gem's system prompt is deterministically rendered from that spec.
- Changes to the spec (via the web app) propagate uniformly to all agents.

This is SDD: **write the spec → generate the artifact → the artifact is the
product**. The council is the spec. The Gems are the build output.
Re-generating is equivalent to recompiling — if the spec changes, the Gems
change consistently. You're not wrangling prompts; you're maintaining a
specification.

---

## Competitive Summary

| Dimension | Gemini Gems (baseline) | Facet Lab |
|---|---|---|
| Agent count | One per Gem | N specialists + 1 Orchestrator |
| Hierarchy | None | Defined (Orchestrator → Facets) |
| Cross-agent awareness | None | Full roster in every spec |
| Communication protocol | Freeform | Delegation/Report Block relay |
| Data boundaries | Implicit | Declared via Data Access Contract |
| Spec format | Free-text textarea | Schema-rendered from `council.yaml` |
| Reproducibility | Manual | Deterministic re-generation |
| User cognitive load | High (user routes everything) | Low (Orchestrator routes) |
