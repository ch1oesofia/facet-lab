# Facet Lab

> A modular, spec-driven Hierarchical Multi-Agent System (HMAS) framework.
> Define your Inner Council. Let them think for you.

---

## What Is This?

Facet Lab is an **Agentic Kernel** — a local-first framework that lets you define a council of AI agents (powered by Gemini Gems), each with a clear role and domain, coordinated through a structured relay protocol.

You define the council. Facet Lab generates everything needed to spawn each Gem:
paste-ready instructions, bundled knowledge files, and a structured communication
protocol so the Gems work together seamlessly through you.

Your council can represent your life pillars, your team structure, your creative
process — anything that decomposes into distinct domains coordinated by a central
integrator. See **[Design Your Council](docs/design-your-council.md)** for a
guided process grounded in established psychological frameworks (IFS, PERMA,
Wheel of Life, ACT).

| Layer | Implementation | Purpose |
|-------|---------------|---------|
| **The Lab** | Local VS Code + GitHub Copilot | Spec authoring, code execution, deployment generation |
| **The Memory** | `data/state.json` → Google Drive | Shared state contract, synced to Drive for persistence |
| **The Runtime** | Gemini Gems + human relay | Each Gem is a council member; the operator relays structured messages between them |

---

## Why This Exists

Facet Lab started as a personal experiment: what if the internal voices that
manage different parts of your life — career, health, finances, scheduling —
could actually talk back, each as a dedicated AI agent?

The first council was five Gemini Gems inspired by animated films (Big Hero 6,
Inside Out), coordinated through a manual relay protocol. It worked well enough
to extract the architecture into a reusable framework. The design is grounded
in established research from psychology (IFS, self-determination theory),
human-computer interaction (the CASA paradigm, anthropomorphism), and
multi-agent systems theory.

See the **[Origin Story](docs/origin-story.md)** for the full narrative, the
**[Example Council](docs/example-council.md)** for the reference implementation,
and the **[Theoretical Foundations](docs/theoretical-foundations.md)** for the
research behind the design.

---

## How It Works

```
council.yaml  ──►  initialize_facet.py  ──►  deploy/
(you define)       (generates everything)     ├── orchestrator/
                                              │   ├── instructions.md   ← paste into Gem
                                              │   └── knowledge.md      ← upload to Gem
                                              ├── facet_1/
                                              │   ├── instructions.md
                                              │   └── knowledge.md
                                              └── facet_2/
                                                  ├── ...
```

The Orchestrator Gem outputs **Delegation Blocks** you copy-paste into Facet Gems.
Facet Gems output **Report Blocks** you copy-paste back. Your role is mechanical
relay — the Gems handle the reasoning.

---

## Quick Start

### 1. Install Dependencies

```bash
cd facet-lab
pip install -r requirements.txt
```

### 2. Design & Configure the Council

First, read **[Design Your Council](docs/design-your-council.md)** to identify
your life pillars and agent personalities.

Then edit **`config/council.yaml`**:

```yaml
orchestrator:
  name: "<your orchestrator>"
  role: "Chief Orchestrator"
  description: >
    <what this agent does, in your own words>

facets:
  - name: "<facet name>"
    domain: "<life domain>"
    role: "<role title>"
    bmad_role: "Specialist"
    description: >
      <what this facet does>
```

Each entry becomes its own Gemini Gem. Design as many Facets as you have pillars.

### 3. Bootstrap

```bash
python scripts/initialize_facet.py
```

This generates:
- Facet specs from the template (`specs/facets/`)
- Shared state (`data/state.json`)
- **One deploy folder per Gem** (`deploy/<name>/`)
- Optionally syncs to Google Drive

### 4. Create Gems

For each folder in `deploy/`:

1. Go to [gemini.google.com](https://gemini.google.com/) → Explore Gems → **New Gem**
2. **Paste** the contents of `instructions.md` into the instruction field
3. Click **Add files** → upload `knowledge.md`
4. **Save**

That's it. Your council is live.

### 5. Use the Council

1. Chat with your **Orchestrator Gem** — give it a goal.
2. It responds with a Delegation Block targeting a specific Facet.
3. **Copy** the Delegation Block → **paste** into that Facet's Gem.
4. The Facet responds with a Report Block.
5. **Copy** the Report Block → **paste** back into the Orchestrator Gem.
6. Repeat until the Orchestrator synthesizes a final deliverable.

### 6. Track State (Optional)

```bash
# View current state
python scripts/update_state.py status

# Record a Facet's output
python scripts/update_state.py report scout complete "Market analysis brief"

# Log a decision
python scripts/update_state.py decision delegation "Assigned research to Scout" "Goal is research-oriented"

# Sync to Drive
python scripts/bridge_engine.py
```

### 7. Evolve the Council

To add, modify, or remove a Facet:

1. Edit `council.yaml`
2. Re-run `python scripts/initialize_facet.py`
3. Create the new Gem from its deploy folder
4. Re-upload `knowledge.md` to existing Gems (council roster changed)

Or use `@facet` in Copilot Chat: *"Add a new agent named Forge for Code & Engineering"*

---

## Project Structure

```
facet-lab/
├── docs/
│   ├── design-your-council.md          # ← START HERE — guided onboarding
│   ├── example-council.md              # Reference: the original five-agent council
│   ├── origin-story.md                 # How the project evolved
│   └── theoretical-foundations.md      # Research grounding
├── specs/
│   ├── manifesto.md                    # System constitution (immutable)
│   ├── orchestrator.spec.md            # Orchestrator protocol (SPEC-001)
│   └── facets/
│       └── abstract_facet.template.md  # Facet blueprint template
├── config/
│   └── council.yaml                    # Inner Council composition
├── data/
│   └── state.json                      # Shared memory contract
├── deploy/                             # ← GENERATED — one folder per Gem
│   ├── <orchestrator>/
│   │   ├── instructions.md             # Paste into Gem
│   │   └── knowledge.md               # Upload to Gem
│   └── <facet>/
│       ├── instructions.md
│       └── knowledge.md
├── scripts/
│   ├── initialize_facet.py             # Bootstrap + deploy generation
│   ├── bridge_engine.py                # Google Drive sync engine
│   └── update_state.py                 # CLI state helper
├── .specify/                           # Spec Kit configuration
├── openspec/                           # OpenSpec configuration
├── _bmad/                              # BMAD Method module
└── .github/
    └── agents/facet.agent.md           # Copilot @facet agent
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [docs/design-your-council.md](docs/design-your-council.md) | Guided onboarding — identify your pillars, design your agents || [docs/example-council.md](docs/example-council.md) | Worked reference — the original five-agent council in full detail |
| [docs/origin-story.md](docs/origin-story.md) | How a personal experiment became a reusable framework |
| [docs/theoretical-foundations.md](docs/theoretical-foundations.md) | Research grounding — psychology, HCI, and social engineering || [specs/manifesto.md](specs/manifesto.md) | System constitution — all agents are bound by it |
| [specs/orchestrator.spec.md](specs/orchestrator.spec.md) | Orchestrator relay protocol and decision logging |
| [config/council.yaml](config/council.yaml) | Who's on the council and what they do |

---

## Prerequisites

- **Python 3.9+** with `pyyaml` and `google-api-python-client` (`pip install -r requirements.txt`)
- **Google Cloud project** with Drive API enabled + OAuth credentials ([setup guide](https://console.cloud.google.com/)) — only needed for Drive sync
- **Gemini App access** at [gemini.google.com](https://gemini.google.com/) (free tier works, AI Pro recommended for larger knowledge files)

---

*Governed by the [Manifesto](specs/manifesto.md). Built with BMAD Method, Spec Kit, and OpenSpec.
See the [Origin Story](docs/origin-story.md) for how this project came to be.*
