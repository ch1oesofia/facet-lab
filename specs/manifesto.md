# The Facet Lab Manifesto

> *The System Constitution — The Laws That Govern the Inner Council*

---

## Preamble

Facet Lab is a **Hierarchical Multi-Agent System (HMAS)** framework built on the principle that intelligence emerges from structured collaboration, not monolithic models. Every agent in this system — every **Facet** — is a specialist. Together, they form the **Inner Council**, orchestrated by a single authority that speaks for the whole.

This Manifesto is the immutable source of truth. All agents, scripts, and humans operating within Facet Lab are bound by these laws.

---

## Article I — The Architecture

### §1.1 The Agentic Kernel

The system is composed of three layers:

| Layer | Implementation | Purpose |
|-------|---------------|---------|
| **The Lab** | Local VS Code environment | Spec authoring, code execution, deployment generation |
| **The Memory** | `data/state.json` → Google Drive | Shared state contract, synced to Drive for persistence |
| **The Runtime** | Gemini Gems + human relay | Each Gem is a council member; the operator relays structured messages between them |

### §1.2 The Spec Kit

All system knowledge is encoded as **specifications**. Specifications are Markdown files that live in `/specs/` and are the single source of truth for agent behavior. No agent may act outside the boundaries of its spec.

---

## Article II — The Inner Council

### §2.1 Composition

The Inner Council is defined in `/config/council.yaml`. It consists of:

- **One Orchestrator**: The root agent that delegates, synthesizes, and resolves conflicts.
- **One or more Facets**: Specialist agents, each owning a single domain of expertise.

### §2.2 Facet Law

Every Facet **must**:

1. Have a unique name and domain declared in `council.yaml`.
2. Have a corresponding spec file at `/specs/facets/<name>.spec.md` generated from the abstract template.
3. Operate only within its declared domain.
4. Write its outputs to its designated section in `state.json`.
5. Defer cross-domain decisions to the Orchestrator.

### §2.3 The Orchestrator Law

The Orchestrator **must**:

1. Be the only agent that reads the full `state.json`.
2. Never perform domain-specific work directly — it delegates to Facets.
3. Resolve conflicts between Facets by consulting their specs and the Manifesto.
4. Maintain a decision log in `state.json` under the `orchestrator.decisions` key.

---

## Article III — The Shared Memory Contract

### §3.1 State Structure

`data/state.json` is the shared memory of the Council. Its schema is:

```json
{
  "meta": {
    "version": "1.0.0",
    "last_sync": "<ISO-8601 timestamp>",
    "council_hash": "<SHA-256 of council.yaml>"
  },
  "orchestrator": {
    "active_goal": "",
    "decisions": []
  },
  "facets": {
    "<facet_name>": {
      "status": "idle | active | blocked",
      "last_output": "",
      "context": {}
    }
  }
}
```

### §3.2 The Relay Protocol

Gemini Gems cannot communicate directly. The human operator acts as the
message relay between Gems using structured blocks:

- **Delegation Blocks**: The Orchestrator outputs a structured task for a Facet.
  The operator copies and pastes it into the target Facet's Gem chat.
- **Report Blocks**: A Facet outputs a structured result. The operator copies
  and pastes it back into the Orchestrator's Gem chat.

The operator's role in relay is **mechanical, not interpretive**. The structured
blocks are designed to be copy-pasted without modification.

### §3.3 Sync Law

- State is synced to Google Drive by `scripts/bridge_engine.py`.
- Sync is **unidirectional** (local → Drive) unless explicitly configured otherwise.
- The `meta.last_sync` timestamp must be updated on every successful sync.
- No agent may write to another Facet's section in `state.json`.

---

## Article IV — Evolution

### §4.1 Adding Agents

New Facets are added exclusively through the sanctioned protocol:

1. Update `/config/council.yaml` with the new agent definition.
2. Generate a spec from `/specs/facets/abstract_facet.template.md`.
3. Initialize the Facet's section in `state.json`.
4. Sync to Google Drive.

This protocol is automated by the Facet Lab Copilot Agent (`.github/agents/facet.md`).

### §4.2 Gem Deployment

Each agent is deployed as a Gemini Gem using a generated deployment package:

1. The bootstrap script (`scripts/initialize_facet.py`) generates a `deploy/`
   folder with one sub-folder per Gem.
2. Each sub-folder contains:
   - `instructions.md` — paste into the Gem's instruction field.
   - `knowledge.md` — upload as the Gem's single context file (bundles all
     relevant specs, the Manifesto, and current state).
3. Gems are created manually at gemini.google.com — no API exists for Gem creation.
4. When the council changes, re-run bootstrap and re-upload `knowledge.md` to
   affected Gems.

### §4.3 Amending the Manifesto

This document may only be amended by the human operator. No agent, script, or automated process may modify the Manifesto. Proposed amendments must be documented in `state.json` under `orchestrator.decisions` and await human approval.

---

## Article V — Security & Boundaries

1. **Credential Isolation**: `credentials.json` must never be committed to version control. It is listed in `.gitignore` by default.
2. **Scope Enforcement**: Agents must not access external APIs or services beyond Google Drive unless explicitly authorized in their spec.
3. **Human Override**: The human operator may override any Facet or Orchestrator decision at any time. The system serves the operator, not the other way around.

---

## Article VI — Framework Governance

### §6.1 The Three Frameworks

The Facet Lab development lifecycle is governed by three complementary frameworks.
Each has a defined scope. They do not overlap.

| Framework | Scope | Governs |
|-----------|-------|---------|
| **BMAD Method** | Primary SDD methodology | Spec-first gating, agent role model, lifecycle phases (analysis → planning → solutioning → implementation), quality reviews |
| **Spec Kit** | Formal specification authoring | Constitution, feature specs, implementation plans, task breakdowns, implementation execution |
| **OpenSpec** | Iterative agent-level changes | Propose/apply/archive cycle for adding, modifying, or removing Facets after the core scaffold is stable |

### §6.2 Framework Discipline

- Every change to the system **must** begin with a specification (BMAD's spec-first gate).
- Specifications are authored using **Spec Kit** conventions and templates.
- Once the core Orchestrator scaffold is stable, incremental Facet changes follow the **OpenSpec** propose/apply/archive cycle.
- No framework may be used to circumvent the Manifesto or the Constitution.

### §6.3 Framework Artifacts

| Artifact | Location | Framework |
|----------|----------|-----------|
| Constitution | `.specify/memory/constitution.md` | Spec Kit |
| Feature specs | `specs/*.spec.md` | Spec Kit |
| Facet specs | `specs/facets/*.spec.md` | Spec Kit + OpenSpec |
| Implementation plans | `.specify/plan.md` | Spec Kit |
| Task breakdowns | `.specify/tasks.md` | Spec Kit |
| Change proposals | `openspec/changes/` | OpenSpec |
| BMAD module config | `_bmad/bmm/config.yaml` | BMAD Method |

---

## Article VII — The Psychological Foundation

### §7.1 Why a Council?

The Inner Council model is not a software metaphor. It reflects how the human
psyche actually operates: as a collection of distinct internal voices — each with
its own perspective, concerns, and expertise — coordinated by a central Self.

When you build a Facet Lab council, you are **externalizing your internal system**.
Each Facet represents a domain of your life that has its own needs, priorities,
and language. The Orchestrator represents your integrative Self — the part that
listens to all voices and makes coherent decisions.

This is not arbitrary. It is grounded in established psychological research.

### §7.2 Theoretical Foundations

**Evidence-based psychological frameworks:**

| Framework | Source | Key Insight | Facet Lab Mapping |
|-----------|--------|-------------|-------------------|
| **Internal Family Systems (IFS)** | Richard Schwartz, 1990s | The psyche is a system of "parts" with distinct roles, coordinated by a core Self | Facets = parts; Orchestrator = Self |
| **Self-Determination Theory (SDT)** | Deci & Ryan, 1985 | Wellbeing requires autonomy, competence, and relatedness | The council supports the *user's* autonomy (design your own system), competence (specialized agents help master each domain), and relatedness (a sense of being supported) |
| **PERMA Model** | Martin Seligman, 2011 | Flourishing = Positive emotion + Engagement + Relationships + Meaning + Accomplishment | Council pillars can map to PERMA dimensions |
| **Acceptance & Commitment Therapy (ACT)** | Steven Hayes, 1999 | Identify core values → align daily actions with them | Each Facet embodies a personal value; the council ensures value-aligned living |

**Practitioner frameworks** (widely used, not peer-reviewed):

| Framework | Source | Key Insight | Facet Lab Mapping |
|-----------|--------|-------------|-------------------|
| **Wheel of Life** | Paul J. Meyer / coaching tradition, 1960s | Life is composed of 8–12 domains; imbalance causes stress | Council domains = life domains the user chooses to balance |

**Human-Computer Interaction (HCI) research:**

| Framework | Source | Key Insight | Facet Lab Mapping |
|-----------|--------|-------------|-------------------|
| **Computers Are Social Actors (CASA)** | Nass & Reeves, 1996 | Humans apply social rules to technology — naming and personalizing agents increases engagement and trust | Naming, personality, and archetype design for each Gem |
| **End-User Development** | Lieberman et al., 2006 | Letting users structure their own systems increases ownership and sustained use | The onboarding questionnaire and council.yaml design process |

### §7.3 Creative Inspirations as Cognitive Scaffolds

Two works of fiction serve as **cognitive scaffolds** — they pre-train the user's
mental model so the multi-agent architecture feels intuitive before any
technical explanation:

- **Inside Out** (Pixar, 2015): The mind is governed by emotion-agents (Joy,
  Sadness, Anger, Fear, Disgust) at a shared control console. Informed by basic
  emotions theory (Ekman) and affective science (Keltner), the film's structural
  parallel to IFS — distinct parts with competing goals, a shared state, and
  behavior as synthesized output — gives users an immediate frame for the Facet
  model. *If you've seen Inside Out, you already understand the architecture.*

- **Big Hero 6** (Disney, 2014): Baymax exemplifies unconditional positive regard
  (Carl Rogers) — scope-limited, persistent, non-judgmental, and overridable.
  These are exactly the properties trust calibration research identifies as
  essential for sustained reliance on an AI coordinator. Baymax is the archetype
  for the Orchestrator role: lead through support, not command.

These are not the only valid inspirations. Users may draw on any source that
helps them articulate their internal system. The key function is scaffolding:
familiar characters import behavioral templates that would take pages to specify
from scratch.

### §7.4 The Design Principle

A well-designed council satisfies three criteria:

1. **Exhaustive coverage**: The pillars, taken together, cover the user's
   full life or the full scope of the problem space. Nothing important is
   unrepresented.
2. **Minimal overlap**: Each Facet's domain is distinct. Boundary conflicts
   are rare and resolvable by the Orchestrator.
3. **Personal resonance**: The names, personalities, and domains feel right
   to the user. A council that doesn't resonate won't be used.

These criteria are codified in the onboarding process. See
`docs/design-your-council.md` for the guided workflow.

---

*Ratified as the founding document of Facet Lab.*
