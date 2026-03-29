<!-- Sync Impact Report
  Version change: 0.0.0 → 1.0.0
  Added sections: All (initial ratification)
  Templates requiring updates: ✅ constitution written from template
  Follow-up TODOs: none
-->

# Facet Lab Constitution

## Core Principles

### I. Spec-First (NON-NEGOTIABLE)

Every component — every agent, script, schema change, or workflow — MUST have a
ratified specification before any implementation code is written or modified.
Specifications live in `/specs/` and are the single source of truth for behavior.
The BMAD Method governs the spec lifecycle: analysis → planning → solutioning →
implementation. No exceptions.

### II. Agent Isolation

Each agent (Facet) in the Inner Council MUST operate exclusively within its
declared domain. Agents MUST NOT read or modify another agent's section in
`state.json`. Cross-domain decisions MUST be deferred to the Orchestrator.
This boundary is enforced by the Manifesto (Article II, §2.2).

### III. Hierarchical Authority

The Orchestrator is the root of the agent hierarchy. All Facets report to the
Orchestrator. The Orchestrator MUST NOT perform domain-specific work — it
delegates, synthesizes, and resolves conflicts. The Manifesto is the supreme
authority; when in conflict, the Manifesto wins over any agent's spec.

### IV. Shared Memory Contract

All inter-agent communication flows through `data/state.json`. The schema is
fixed (Article III, §3.1). Each Facet writes only to its own section. The
Orchestrator is the only agent that reads the full state. Sync to Google Drive
is unidirectional (local → Drive) via `scripts/bridge_engine.py`.

### V. Credential Isolation

`credentials.json` and `token.json` MUST never be committed to version control.
Secrets are listed in `.gitignore`. No agent, script, or automated process may
expose credentials in logs, state, or Drive-synced files.

### VI. Immutable Manifesto

`specs/manifesto.md` may only be amended by the human operator. No agent,
script, or automated process may modify it. Proposed amendments MUST be logged
in `state.json` under `orchestrator.decisions` and await human approval.

### VII. Framework Discipline

Three frameworks govern the development lifecycle:
- **BMAD Method**: Primary SDD methodology. Agent role model. Spec-first gating.
- **Spec Kit**: Formal specification authoring (constitution, specs, plans, tasks).
- **OpenSpec**: Iterative agent-level changes via propose/apply/archive cycle.

Each framework has a defined scope. They do not overlap. BMAD governs the
overall process; Spec Kit produces the artifacts; OpenSpec manages incremental
Facet evolution after the core scaffold is stable.

## Technology Stack

- **Runtime**: Gemini Gems grounded on Google Drive files
- **The Lab**: VS Code with GitHub Copilot (local development environment)
- **The Memory**: `data/state.json` synced to Google Drive via Python
- **Languages**: Python 3.13 (scripts), YAML (config), Markdown (specs), JSON (state)
- **Sync**: Google Drive API v3 via `google-api-python-client`
- **Package management**: pip (Python), npm (Node tooling), uv (Spec Kit CLI)

## Development Workflow

1. **Spec phase**: Use BMAD agents or Spec Kit commands to create/update specs.
   Every change starts with a specification. No code without a spec.
2. **Plan phase**: Use `/speckit.plan` or BMAD architecture workflow to produce
   an implementation plan from the spec.
3. **Task phase**: Use `/speckit.tasks` to break the plan into ordered tasks.
4. **Implement phase**: Use `/speckit.implement` or `bmad-dev-story` to execute.
5. **Iterate phase**: Once core scaffold is stable, use `/opsx:propose` for
   incremental Facet additions/modifications via OpenSpec's delta workflow.
6. **Review phase**: Use `bmad-code-review` for quality validation.

## Governance

This Constitution supersedes all other development practices within Facet Lab.
It is derived from and subordinate to the Manifesto (`specs/manifesto.md`).

- Amendments to this Constitution require documentation and human approval.
- The Manifesto is the supreme authority — this Constitution implements it,
  never contradicts it.
- All specs, plans, and code MUST be verified for compliance with these
  principles before merging.
- Version follows semantic versioning: MAJOR for principle removals/redefinitions,
  MINOR for additions, PATCH for clarifications.

**Version**: 1.0.0 | **Ratified**: 2026-03-28 | **Last Amended**: 2026-03-28
