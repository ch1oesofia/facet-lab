"""
update_state.py — CLI helper to update state.json without manual JSON editing.

Usage:
  python scripts/update_state.py goal "Research competitor landscape"
  python scripts/update_state.py goal --clear
  python scripts/update_state.py report <facet> <status> "<output>"
  python scripts/update_state.py decision <type> "<summary>" "<rationale>"
  python scripts/update_state.py status
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
STATE_PATH = PROJECT_ROOT / "data" / "state.json"


def load_state():
    if not STATE_PATH.exists():
        print("ERROR: data/state.json not found. Run initialize_facet.py first.")
        sys.exit(1)
    return json.loads(STATE_PATH.read_text())


def save_state(state):
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")


def cmd_goal(args):
    """Set or clear the active goal."""
    state = load_state()
    if args and args[0] == "--clear":
        state["orchestrator"]["active_goal"] = ""
        print("Active goal cleared.")
    elif args:
        state["orchestrator"]["active_goal"] = " ".join(args)
        print(f"Active goal set: {state['orchestrator']['active_goal']}")
    else:
        print("Usage: update_state.py goal \"<goal text>\" | --clear")
        return
    save_state(state)


def cmd_report(args):
    """Record a Facet's output into state.json."""
    if len(args) < 3:
        print("Usage: update_state.py report <facet_name> <status> \"<output>\"")
        print("  status: idle | active | blocked | complete")
        return

    facet = args[0].lower().replace(" ", "_")
    status = args[1]
    output = " ".join(args[2:])

    state = load_state()
    if facet not in state.get("facets", {}):
        print(f"ERROR: Facet '{facet}' not found in state.json.")
        print(f"  Known facets: {', '.join(state.get('facets', {}).keys())}")
        return

    state["facets"][facet]["status"] = status
    state["facets"][facet]["last_output"] = output
    save_state(state)
    print(f"Updated facets.{facet}: status={status}")


def cmd_decision(args):
    """Append a decision to the Orchestrator's decision log."""
    if len(args) < 3:
        print('Usage: update_state.py decision <type> "<summary>" "<rationale>"')
        print("  type: delegation | conflict_resolution | escalation | amendment_proposal")
        return

    dtype = args[0]
    summary = args[1]
    rationale = " ".join(args[2:])

    state = load_state()
    state["orchestrator"]["decisions"].append({
        "type": dtype,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "summary": summary,
        "rationale": rationale,
    })
    save_state(state)
    print(f"Decision logged: [{dtype}] {summary}")


def cmd_status(args):
    """Print current state summary."""
    state = load_state()
    goal = state["orchestrator"]["active_goal"] or "(none)"
    decisions = len(state["orchestrator"]["decisions"])
    print(f"Active goal: {goal}")
    print(f"Decisions logged: {decisions}")
    print(f"Facets:")
    for name, data in state.get("facets", {}).items():
        s = data.get("status", "?")
        out = data.get("last_output", "")
        preview = (out[:60] + "...") if len(out) > 60 else out
        print(f"  {name}: {s}" + (f" — {preview}" if preview else ""))


COMMANDS = {
    "goal": cmd_goal,
    "report": cmd_report,
    "decision": cmd_decision,
    "status": cmd_status,
}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print("Facet Lab — State Helper")
        print("Commands: goal, report, decision, status")
        print("Run with --help or see script docstring for usage.")
        sys.exit(0)

    COMMANDS[sys.argv[1]](sys.argv[2:])
