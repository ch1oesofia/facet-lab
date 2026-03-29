# Facet Lab — Product Design Document

> **Current Version**: 0.1.0  
> **Status**: Pre-release (MVP)  
> **Last Updated**: 2026-03-29  

---

## Versioning Model

Facet Lab follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):

| Segment | Meaning | Example |
|---------|---------|---------|
| **MAJOR** | Breaking changes to council config, manifesto, or deploy format | 1.0.0 → 2.0.0 |
| **MINOR** | New features, backward-compatible additions | 0.1.0 → 0.2.0 |
| **PATCH** | Bug fixes, doc improvements, style tweaks | 0.1.0 → 0.1.1 |

Pre-1.0 versions (`0.x.y`) are considered pre-release. The public API (council.yaml schema, deploy output format, relay protocol) is not yet frozen and may change between minor versions.

**1.0.0** will be declared when:
- The council.yaml schema is stable
- The relay protocol is validated across multiple council configurations
- The web app covers the full onboarding-to-deploy flow end-to-end

---

## Product Vision

Facet Lab is an **Agentic Kernel** — a local-first framework that lets anyone design a personalized council of AI agents (powered by Gemini Gems), each with a clear role, domain, and data contract, coordinated through a structured relay protocol.

**Core promise**: Your mind already has an Inner Council. Give them a voice.

---

## Version History

### v0.1.0 — Foundation (2026-03-29)

The initial release establishes the core architecture, onboarding flow, and deployment pipeline across two surfaces: a developer CLI path and a no-code web app.

#### Architecture & Specs
- **Manifesto** (system constitution): Articles I–VII + Article V-A (Data Access Governance)
- **Orchestrator spec** (SPEC-001): delegation/report relay protocol, decision logging, cross-domain data governance
- **Abstract Facet template**: domain-locked agent blueprint with Data Access Contract section
- **Council config schema** (`council.yaml`): orchestrator + facets with extensions, data_scope, external_sources

#### Developer Path (CLI)
- `initialize_facet.py` — generates specs, state file, and deploy folders (instructions.md + knowledge.md per Gem) from council.yaml
- `update_state.py` — CLI helper for state reads, report logging, decision logging
- `bridge_engine.py` — Google Drive sync engine for state persistence
- Data Access Contract generation (per-facet and orchestrator-level)

#### Web App (No-Code Path)
- Single-page guided flow: Landing → Discover (life pillars) → Design (facets + orchestrator) → Generate (copy-paste deploy)
- Client-side instruction and knowledge bundle generation (generator.js)
- Data Access configuration UI: extension checkboxes, Gmail/Sheets scope, external app ingest
- Auto-computed orchestrator extensions (union of all facet extensions)
- Council preview with live YAML generation
- Deployed to GitHub Pages

#### Data Access Contract (5-Layer Architecture)
1. **Extensions** — Gemini platform toggles (Workspace, Calendar, Search, Maps, YouTube)
2. **Scope** — Instruction-enforced boundaries (in-scope AND out-of-scope per extension)
3. **External Ingest** — 4 approved methods: email_forward, paste, sheet_import, automation
4. **Validation & Hallucination Guardrails** — Source citation, confidence tiering, input validation
5. **Cross-Domain Isolation** — Only the Orchestrator sees across Facet boundaries

#### Documentation
- Design Your Council — guided onboarding with psychological frameworks (IFS, PERMA, Wheel of Life, ACT)
- Origin Story — project narrative and evolution
- Theoretical Foundations — research grounding (psychology, HCI, multi-agent systems)
- Example Council — the original five-agent reference council (Baymax, Tony, Maddy, Dora, Peso)
- Example Walkthrough — reverse-engineered questionnaire answers for the reference council
- Onboarding Questionnaire — Q1–Q8a structured intake form

#### Known Limitations
- Human relay required — no automated Gem-to-Gem communication
- Gemini Gems context window is the practical scaling bottleneck (~128K tokens)
- External app data must funnel through Google-native channels (Gmail/Sheets)
- No automated testing suite yet
- No state versioning or migration tooling

---

## Roadmap

> Items below are directional, not committed. They will move into version entries as they are implemented.

#### v0.2.0 — Polish & Validation (planned)
- [ ] Automated test suite (Python scripts + web app)
- [ ] State schema validation on read/write
- [ ] Improved error handling in web app flow
- [ ] Mobile-responsive refinements to web UI
- [ ] Facet spec regeneration (edit existing council without starting over)

#### v0.3.0 — Advanced Onboarding (planned)
- [ ] Import/export council configurations (JSON/YAML)
- [ ] Pre-built council templates (starter packs for common use cases)
- [ ] Guided data access wizard with per-extension conditional fields
- [ ] Rolling window strategy for Sheets data (30/60/90 day defaults)

#### v0.4.0 — Intelligence Layer (planned)
- [ ] Decision graph visualization (state.json → rendered timeline)
- [ ] Cross-session memory summarization
- [ ] Delegation analytics (which Facets get used, bottleneck detection)

#### v1.0.0 — Stable Release (criteria)
- [ ] Council.yaml schema frozen with migration tooling
- [ ] Relay protocol validated across 5+ distinct council configurations
- [ ] Web app covers full lifecycle: create, edit, re-deploy, track
- [ ] Documentation coverage for all features
- [ ] Automated CI/CD pipeline with tests

---

## Architecture Summary

```
User
 │
 ├─► Web App (index.html)          No-code path
 │     └─► generator.js            Client-side deploy generation
 │
 ├─► CLI (initialize_facet.py)     Developer path
 │     ├─► update_state.py         State management
 │     └─► bridge_engine.py        Drive sync
 │
 └─► Gemini Gems (Runtime)
       ├── Orchestrator Gem         Delegates, synthesizes, resolves
       ├── Facet Gem 1              Domain specialist
       ├── Facet Gem 2              Domain specialist
       └── Facet Gem N              Domain specialist
```

**Governing documents**: Manifesto (constitution) → Orchestrator Spec (protocol) → Facet Template (blueprint) → Council Config (composition)

---

## Design Principles

1. **Spec-driven** — All behavior is encoded in Markdown specs. No hidden logic.
2. **Local-first** — Everything runs on your machine. No server, no accounts, no vendor lock-in.
3. **Human-in-the-loop** — The operator relays messages. Agents advise; humans decide.
4. **Domain isolation** — Each Facet owns exactly one domain. The Orchestrator is the only cross-domain agent.
5. **Progressive disclosure** — Web app for quick starts; CLI + specs for power users.
