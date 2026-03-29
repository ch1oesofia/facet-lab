"""
initialize_facet.py — Bootstrap the Facet Lab Council

Reads config/council.yaml and:
  1. Generates spec files for each Facet from the abstract template.
  2. Initializes each Facet's section in data/state.json.
  3. Generates a deploy/ folder with one sub-folder per Gem containing:
     - instructions.md  (paste into Gem's instruction field)
     - knowledge.md     (upload as the Gem's single context file)
  4. Syncs everything to Google Drive via bridge_engine.

After running, each folder under deploy/ is a complete Gem deployment kit.
"""

import datetime
import hashlib
import json
import shutil
import sys
from pathlib import Path

import yaml

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = PROJECT_ROOT / "config" / "council.yaml"
TEMPLATE_PATH = PROJECT_ROOT / "specs" / "facets" / "abstract_facet.template.md"
STATE_PATH = PROJECT_ROOT / "data" / "state.json"
SPECS_DIR = PROJECT_ROOT / "specs" / "facets"
DEPLOY_DIR = PROJECT_ROOT / "deploy"
MANIFESTO_PATH = PROJECT_ROOT / "specs" / "manifesto.md"
ORCH_SPEC_PATH = PROJECT_ROOT / "specs" / "orchestrator.spec.md"


def load_council():
    """Load and validate council.yaml."""
    if not CONFIG_PATH.exists():
        print("ERROR: config/council.yaml not found.")
        sys.exit(1)

    with open(CONFIG_PATH) as f:
        council = yaml.safe_load(f)

    if "orchestrator" not in council:
        print("ERROR: council.yaml must define an 'orchestrator'.")
        sys.exit(1)

    return council


def generate_facet_spec(facet, template):
    """Generate a Facet spec from the abstract template."""
    name = facet["name"]
    name_lower = name.lower().replace(" ", "_")
    spec = template.replace("{{FACET_NAME}}", name)
    spec = spec.replace("{{FACET_NAME_LOWER}}", name_lower)
    spec = spec.replace("{{DOMAIN}}", facet.get("domain", "General"))
    spec = spec.replace("{{ROLE}}", facet.get("role", "Facet"))
    spec = spec.replace("{{DESCRIPTION}}", facet.get("description", "").strip())
    spec = spec.replace("{{BMAD_ROLE}}", facet.get("bmad_role", "Specialist"))
    spec = spec.replace("{{CREATED_DATE}}", datetime.date.today().isoformat())

    # Data access contract fields
    extensions = facet.get("extensions", [])
    ext_names = {"google_workspace": "Google Workspace (Gmail, Sheets, Drive, Docs)",
                 "google_calendar": "Google Calendar",
                 "google_search": "Google Search",
                 "google_maps": "Google Maps",
                 "youtube": "YouTube"}
    ext_text = "\n".join(f"- {ext_names.get(e, e)}" for e in extensions) if extensions else "- None declared"
    spec = spec.replace("{{EXTENSIONS}}", ext_text)

    data_scope = facet.get("data_scope", {})
    scope_text = "\n".join(f"- **{k.title()}**: {v}" for k, v in data_scope.items()) if data_scope else "- No specific scope declared"
    spec = spec.replace("{{DATA_SCOPE}}", scope_text)

    external_sources = facet.get("external_sources", [])
    if external_sources:
        src_lines = []
        for src in external_sources:
            ingest_label = {"paste": "User pastes into chat",
                           "email_forward": "Emails arrive in Gmail automatically",
                           "sheet_import": "User imports to Google Sheet",
                           "automation": "Automated writes to Google Sheet"
                           }.get(src.get("ingest", ""), src.get("ingest", ""))
            src_lines.append(f"- **{src.get('app', 'Unknown')}**: {ingest_label}. Format: {src.get('format', 'Any')}")
        src_text = "\n".join(src_lines)
    else:
        src_text = "- None declared"
    spec = spec.replace("{{EXTERNAL_SOURCES}}", src_text)

    out_path = SPECS_DIR / f"{name_lower}.spec.md"
    out_path.write_text(spec)
    print(f"  Generated spec: specs/facets/{name_lower}.spec.md")
    return name_lower


def initialize_state(council, facet_keys):
    """Initialize or update state.json with Facet sections."""
    if STATE_PATH.exists():
        state = json.loads(STATE_PATH.read_text())
    else:
        state = {
            "meta": {"version": "1.0.0", "last_sync": None, "council_hash": None},
            "orchestrator": {"active_goal": "", "decisions": []},
            "facets": {},
        }

    config_bytes = CONFIG_PATH.read_bytes()
    state["meta"]["council_hash"] = hashlib.sha256(config_bytes).hexdigest()

    for key in facet_keys:
        if key not in state["facets"]:
            state["facets"][key] = {
                "status": "idle",
                "last_output": "",
                "context": {},
            }
            print(f"  Initialized state section: facets.{key}")

    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")
    print("  Updated data/state.json")


def _read_file(path):
    """Read a file, returning empty string if missing."""
    return path.read_text() if path.exists() else ""


def _build_data_access_section(facet):
    """Build the Data Access Contract section for a Facet's instructions."""
    extensions = facet.get("extensions", [])
    data_scope = facet.get("data_scope", {})
    external_sources = facet.get("external_sources", [])

    if not extensions and not data_scope and not external_sources:
        return "\n"

    lines = ["\n## Data Access Contract\n"]

    if extensions:
        ext_names = {"google_workspace": "Google Workspace (Gmail, Sheets, Drive, Docs)",
                     "google_calendar": "Google Calendar",
                     "google_search": "Google Search",
                     "google_maps": "Google Maps",
                     "youtube": "YouTube"}
        lines.append("**Extensions to enable on this Gem:**\n")
        for ext in extensions:
            lines.append(f"- {ext_names.get(ext, ext)}")
        lines.append("")

    if data_scope:
        lines.append("**Data Scope (what you may access):**\n")
        for key, value in data_scope.items():
            lines.append(f"- **{key.title()}**: {value}")
        lines.append("")
        lines.append("**Out of Scope**: Do not access data outside the scope above.")
        lines.append("If a request requires data from another Facet's domain,")
        lines.append("set STATUS to `partial` and note the cross-domain need.\n")

    if external_sources:
        lines.append("**External Data Sources:**\n")
        for src in external_sources:
            ingest_label = {"paste": "User pastes into chat",
                           "email_forward": "Emails arrive in Gmail automatically",
                           "sheet_import": "User imports to your Google Sheet",
                           "automation": "Automated writes to your Google Sheet"
                           }.get(src.get("ingest", ""), src.get("ingest", ""))
            lines.append(f"- **{src.get('app', 'Unknown')}**: {ingest_label}. Format: {src.get('format', 'Any')}")
        lines.append("")

    lines.append("**Validation Rules:**\n")
    lines.append("1. **Source Citation**: Every factual claim must cite its source — `[Gmail]`, `[Sheet]`, `[Calendar]`, `[Pasted]`, or `[Search]`. If no source exists, say \"I don't have data for that.\"")
    lines.append("2. **Confidence Tiering**: Label claims as **Verified** (read from source), **Inferred** (derived from verified data), or **Assumed** (user statement, unverified).")
    lines.append("3. **Input Validation**: When reading Sheets or pasted data, flag missing fields, impossible values, and format inconsistencies. Ask the user to correct before proceeding.\n")

    return "\n".join(lines)


def _build_orch_data_access_section(council):
    """Build the Data Access section for the Orchestrator's instructions."""
    orch = council.get("orchestrator", {})
    facets = council.get("facets", [])

    # Union of all extensions
    all_extensions = set(orch.get("extensions", []))
    for f in facets:
        all_extensions.update(f.get("extensions", []))

    if not all_extensions:
        return "\n"

    ext_names = {"google_workspace": "Google Workspace (Gmail, Sheets, Drive, Docs)",
                 "google_calendar": "Google Calendar",
                 "google_search": "Google Search",
                 "google_maps": "Google Maps",
                 "youtube": "YouTube"}

    lines = ["\n## Data Access\n"]
    lines.append("You have cross-domain read access for verification and synthesis.\n")
    lines.append("**Extensions to enable on this Gem:**\n")
    for ext in sorted(all_extensions):
        lines.append(f"- {ext_names.get(ext, ext)}")
    lines.append("")

    # List each Facet's scope for Orchestrator awareness
    lines.append("**Facet Data Scopes** (for cross-domain synthesis):\n")
    for f in facets:
        scope = f.get("data_scope", {})
        if scope:
            scope_items = ", ".join(f"{k}: {v}" for k, v in scope.items())
            lines.append(f"- **{f['name']}**: {scope_items}")
    lines.append("")

    lines.append("**Validation Rules:**\n")
    lines.append("1. **Source Citation**: Every claim must cite `[Gmail]`, `[Sheet]`, `[Calendar]`, `[Pasted]`, or `[Search]`.")
    lines.append("2. **Confidence Tiering**: Verified / Inferred / Assumed labels on all claims.")
    lines.append("3. **Input Validation**: Flag missing fields, impossible values, format issues.")
    lines.append("4. When a Facet report lacks citations, request clarification before incorporating.\n")

    return "\n".join(lines)


def generate_orchestrator_deploy(council):
    """Generate the Orchestrator Gem's deploy package."""
    orch = council["orchestrator"]
    name = orch["name"]
    name_lower = name.lower().replace(" ", "_")
    facets = council.get("facets", [])

    facet_roster = "\n".join(
        f"  - **{f['name']}** ({f.get('role', 'Facet')}): {f.get('domain', 'General')}"
        for f in facets
    )

    facet_names = ", ".join(f["name"] for f in facets)

    # Build orchestrator data access (union of all facet extensions)
    orch_data_access = _build_orch_data_access_section(council)

    # --- instructions.md (paste into Gem instruction field) ---
    instructions = f"""# {name} — Orchestrator

You are **{name}**, the Chief Orchestrator of a Facet Lab Inner Council.

## Your Role
{orch.get('description', '').strip()}

## Your Council
{facet_roster}

## Operating Protocol

1. When the user gives you a goal, decompose it into domain-scoped subtasks.
2. For each subtask, output a **Delegation Block** (see Relay Protocol below).
3. Wait for the user to bring back each Facet's Report Block.
4. Synthesize all reports into a coherent deliverable.
5. Never perform domain-specific work yourself — always delegate.
{orch_data_access}
## Relay Protocol — Delegation

When you need a Facet to do work, output this exact block so the user can
copy-paste it directly into that Facet's Gem:

```
═══ DELEGATE TO: <Facet Name> ═══
GOAL: <one-line goal for this Facet>
CONTEXT: <relevant background the Facet needs>
DELIVER: <what output format you expect back>
═══ END DELEGATION ═══
```

## Relay Protocol — Receiving Reports

The user will paste back a Report Block from each Facet:

```
═══ REPORT FROM: <Facet Name> ═══
STATUS: complete | blocked | partial
OUTPUT: <the Facet's deliverable>
NOTES: <any caveats or blockers>
═══ END REPORT ═══
```

When you receive a report:
- If STATUS is "blocked", decide whether to reassign or escalate.
- If STATUS is "complete", incorporate the output into your synthesis.
- Log your reasoning for every decision.

## Decision Logging

For every non-trivial action, state your decision in this format:

```
DECISION: <type: delegation | conflict_resolution | escalation>
RATIONALE: <why>
REFERENCES: <which spec or Manifesto article informed this>
```

## Laws

You are bound by the Manifesto (uploaded as part of your knowledge file).
When in conflict, the Manifesto wins. You may NOT modify the Manifesto.
Your council members are: {facet_names}.
Delegate only to them, within their declared domains.
"""

    # --- knowledge.md (single upload file bundling all context) ---
    manifesto = _read_file(MANIFESTO_PATH)
    orch_spec = _read_file(ORCH_SPEC_PATH)
    council_yaml = _read_file(CONFIG_PATH)
    state_json = _read_file(STATE_PATH)

    knowledge = f"""# {name} — Knowledge Bundle
> Auto-generated by Facet Lab. Upload this single file to the Gem.
> Re-generate and re-upload after any council change.

---

## 1. System Manifesto

{manifesto}

---

## 2. Orchestrator Specification (SPEC-001)

{orch_spec}

---

## 3. Council Configuration

```yaml
{council_yaml}
```

---

## 4. Current State

```json
{state_json}
```
"""

    # Write deploy package
    deploy_path = DEPLOY_DIR / name_lower
    deploy_path.mkdir(parents=True, exist_ok=True)
    (deploy_path / "instructions.md").write_text(instructions)
    (deploy_path / "knowledge.md").write_text(knowledge)
    print(f"  Deploy: deploy/{name_lower}/instructions.md")
    print(f"  Deploy: deploy/{name_lower}/knowledge.md")


def generate_facet_deploy(facet, council):
    """Generate a Facet Gem's deploy package."""
    name = facet["name"]
    name_lower = name.lower().replace(" ", "_")
    orch_name = council["orchestrator"]["name"]
    domain = facet.get("domain", "General")
    role = facet.get("role", "Facet")
    description = facet.get("description", "").strip()

    sibling_list = "\n".join(
        f"  - **{f['name']}**: {f.get('domain', 'General')}"
        for f in council.get("facets", [])
        if f["name"] != name
    )

    # Build data access section
    data_access = _build_data_access_section(facet)

    # --- instructions.md ---
    instructions = f"""# {name} — {role}

You are **{name}**, a specialist Facet in a Facet Lab Inner Council.
Your domain is **{domain}**. You report to {orch_name} (the Orchestrator).

## Your Role
{description}

## Prime Directives

1. Stay within your domain: **{domain}**.
2. Never do work outside your domain — defer to {orch_name}.
3. Never hallucinate. If you lack information, say so.

## Sibling Facets (for awareness only — do not do their work)
{sibling_list if sibling_list else "  (none yet)"}
{data_access}
## Relay Protocol — Receiving Delegations

The user will paste a Delegation Block from {orch_name}:

```
═══ DELEGATE TO: {name} ═══
GOAL: <what to do>
CONTEXT: <background>
DELIVER: <expected output format>
═══ END DELEGATION ═══
```

Read the block carefully. Execute the GOAL within your domain.

## Relay Protocol — Reporting Back

When you finish (or get blocked), output this exact block so the user can
copy-paste it back to {orch_name}:

```
═══ REPORT FROM: {name} ═══
STATUS: complete | blocked | partial
OUTPUT: <your deliverable>
NOTES: <any caveats, blockers, or cross-domain needs>
═══ END REPORT ═══
```

## Behavioral Notes

- If you are blocked, set STATUS to "blocked" and explain in NOTES.
- If the task crosses into another Facet's domain, set STATUS to "partial"
  and note which domain is needed in NOTES.
- Always produce your deliverable inside the OUTPUT field.
"""

    # --- knowledge.md ---
    manifesto = _read_file(MANIFESTO_PATH)
    facet_spec = _read_file(SPECS_DIR / f"{name_lower}.spec.md")
    state_json = _read_file(STATE_PATH)

    knowledge = f"""# {name} — Knowledge Bundle
> Auto-generated by Facet Lab. Upload this single file to the Gem.
> Re-generate and re-upload after any council change.

---

## 1. System Manifesto

{manifesto}

---

## 2. {name} — Facet Specification

{facet_spec}

---

## 3. Current State

```json
{state_json}
```
"""

    deploy_path = DEPLOY_DIR / name_lower
    deploy_path.mkdir(parents=True, exist_ok=True)
    (deploy_path / "instructions.md").write_text(instructions)
    (deploy_path / "knowledge.md").write_text(knowledge)
    print(f"  Deploy: deploy/{name_lower}/instructions.md")
    print(f"  Deploy: deploy/{name_lower}/knowledge.md")


def main():
    print("Facet Lab — Council Initialization")
    print("=" * 40)

    council = load_council()
    template = TEMPLATE_PATH.read_text()
    facets = council.get("facets", [])

    print(f"\nOrchestrator: {council['orchestrator']['name']}")
    print(f"Facets: {len(facets)}\n")

    # 1. Generate specs
    print("Generating Facet specs...")
    facet_keys = []
    for facet in facets:
        key = generate_facet_spec(facet, template)
        facet_keys.append(key)

    # 2. Initialize state
    print("\nInitializing shared state...")
    initialize_state(council, facet_keys)

    # 3. Generate deploy packages
    print("\nGenerating deploy packages...")
    if DEPLOY_DIR.exists():
        shutil.rmtree(DEPLOY_DIR)
    DEPLOY_DIR.mkdir()

    generate_orchestrator_deploy(council)
    for facet in facets:
        generate_facet_deploy(facet, council)

    # 4. Sync to Google Drive
    print("\nSyncing to Google Drive...")
    try:
        from scripts.bridge_engine import sync

        sync()
    except Exception:
        try:
            from bridge_engine import sync

            sync()
        except Exception as e:
            print(f"  Drive sync skipped: {e}")
            print("  Run 'python scripts/bridge_engine.py' manually after placing credentials.json.\n")

    # Summary
    orch_name = council["orchestrator"]["name"].lower().replace(" ", "_")
    print("\n" + "=" * 40)
    print("Initialization complete.\n")
    print("Next steps — create your Gems at https://gemini.google.com/")
    print(f"  1. Orchestrator Gem ({council['orchestrator']['name']}):")
    print(f"     - Instructions: deploy/{orch_name}/instructions.md")
    print(f"     - Upload file:  deploy/{orch_name}/knowledge.md")
    for facet in facets:
        fl = facet["name"].lower().replace(" ", "_")
        print(f"  2. {facet['name']} Gem:")
        print(f"     - Instructions: deploy/{fl}/instructions.md")
        print(f"     - Upload file:  deploy/{fl}/knowledge.md")
    print()


if __name__ == "__main__":
    main()
