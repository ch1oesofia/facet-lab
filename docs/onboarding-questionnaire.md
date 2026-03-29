# Facet Lab — Onboarding Questionnaire

> From the voices in your head to a working council of Gems.

---

## How This Works

You already have an Inner Council. Everyone does. It's the collection of
internal voices that weigh in on different parts of your life — the one that
worries about money, the one that pushes you to exercise, the one that manages
your calendar, the one that won't stop thinking about work.

If you've seen **Inside Out**, you've seen this model in action: distinct agents
at a shared console, each responsible for a different dimension, sometimes
cooperating, sometimes in conflict. That's not fiction — it's how psychologists
describe the mind (see [Theoretical Foundations](theoretical-foundations.md)).

This questionnaire helps you **name those voices, give them roles, and turn
them into Gemini Gems** that actually work together. The output is a populated
`council.yaml` ready to bootstrap.

For a completed example, see the **[Example Walkthrough](example-walkthrough.md)** —
the questionnaire answers that produced the original five-agent council
(Baymax, Tony, Maddy, Dora, Peso). The resulting design is in the
**[Example Council](example-council.md)**.

---

## Part 1 — Discover Your Pillars

> *Think of your internal parts — not a checklist.*

**Q1. The Voices**

Close your eyes for a moment. Think about the last week. What were the
recurring concerns? What parts of you were "talking"?

Write them as "the part of me that..." statements:

> 1. The part of me that _______________
> 2. The part of me that _______________
> 3. The part of me that _______________
> 4. The part of me that _______________
> 5. The part of me that _______________
> 6. *(optional)* The part of me that _______________
> 7. *(optional)* The part of me that _______________

*Don't overthink it. Don't try to be comprehensive. What actually occupies
your mind?*

**Q2. Name the Domains**

Look at your list. Group related "parts" into domains — the life areas they
belong to. Each domain is a candidate Facet.

| "The part of me that..." | Domain |
|--------------------------|--------|
| *Example: worries about debt, tracks spending* | *Finances* |
| *Example: pushes me to work out, tracks sleep* | *Health & Wellness* |
| | |
| | |
| | |
| | |

Aim for 3–7 distinct domains. If two parts feel like the same domain, merge
them. If one part spans two domains, it's probably two parts.

**Q3. Priority Check**

For each domain, rate two things on a 1–5 scale:

| Domain | Importance (1–5) | Satisfaction (1–5) |
|--------|:-:|:-:|
| | | |
| | | |
| | | |
| | | |
| | | |

Domains that are **high importance + low satisfaction** need the most active
guidance. Domains that are **high importance + high satisfaction** benefit from
a maintenance agent. Low-importance domains probably don't need a Facet.

**Q4. Coverage Check**

> Is anything missing? Read your domains back. Together, do they cover
> everything that actually occupies your mental energy?
>
> - [ ] Yes — these are my pillars
> - [ ] Missing: _______________

---

## Part 2 — Design the Orchestrator

> *The calm center that coordinates everything.*

Think of **Baymax** from Big Hero 6: scope-limited, persistent, non-judgmental.
He doesn't do the work — he makes sure the right agent does, and he doesn't
stop until the human says they're satisfied. That's the Orchestrator archetype.

Your Orchestrator doesn't need to be Baymax. But it should have the same
structural qualities: it coordinates, it stabilizes, it doesn't pick favorites
among your Facets.

**Q5. Coordination Style**

> How should your Orchestrator talk to you and manage the council?
>
> - [ ] **Stabilizer** — calm, grounding, balance-focused *(the Baymax model)*
> - [ ] **Commander** — decisive, efficient, action-oriented
> - [ ] **Advisor** — thoughtful, analytical, presents options
> - [ ] **Companion** — warm, encouraging, emotionally supportive
> - [ ] **Custom**: _______________

**Q6. Orchestrator Name**

> Name: _______________
>
> *Draw from fiction, mythology, personal meaning, or invention. The name
> should feel like the "best version of yourself in charge." If nothing
> comes to mind, consider: what character from a film, book, or story
> embodies the coordination style you chose above?*

**Q7. Orchestrator Description**

> In 1–3 sentences, what does this Orchestrator do?
>
> _______________________________________________________________

**Quick resonance check**: Say the name out loud. Does it feel right? If you
wince, try another. You'll be talking to this agent daily.

---

## Part 3 — Design Each Facet

> *Give each voice a name, a role, and a boundary.*

Repeat this block for each domain from Q2. For a worked example, see how the
[Example Council](example-council.md) defines Tony (Career), Maddy (Health),
Dora (Calendar), and Peso (Finances).

**Q8. Facet Profile** *(copy for each Facet)*

> **Domain**: _______________ *(from Q2)*
>
> **Name**: _______________
> *What do you call this voice? Draw from fiction, personal meaning, or
> invention. Characters you already know work best — you'll trust them
> faster because you already "know" how they behave.*
>
> **Role title**: _______________
> *Job title. (e.g., "Health Coach", "Financial Strategist", "Schedule Keeper")*
>
> **Domain boundary**: _______________
> *One sentence: what is IN scope and what is OUT? Think about where this
> Facet's domain ends and another Facet's begins.*
>
> **Personality**:
> - [ ] Direct and no-nonsense
> - [ ] Warm and encouraging
> - [ ] Analytical and data-driven
> - [ ] Creative and exploratory
> - [ ] Custom: _______________
>
> **Description** (1–3 sentences):
> *What does this agent do? What does it produce?*
>
> _______________________________________________________________
>
> **Closest BMAD role**:
> - [ ] Business Analyst (research, requirements, analysis)
> - [ ] Developer (building, implementation, technical work)
> - [ ] UX Designer (design, user experience, aesthetics)
> - [ ] Product Manager (planning, prioritization, roadmap)
> - [ ] Tech Writer (documentation, communication, knowledge)
> - [ ] Specialist (none of the above)
>
> **Resonance check**: Does this name + personality feel like *yours*?
> Would you enjoy talking to this agent?
> - [ ] Yes
> - [ ] No — rethink: _______________

**Q8a. Data Access** *(for each Facet)*

> **Gemini Extensions**: Which Google tools does this Facet need?
> - [ ] Google Workspace (Gmail, Sheets, Drive, Docs)
> - [ ] Google Calendar
> - [ ] Google Search
> - [ ] Google Maps
> - [ ] YouTube
>
> **Data Scope**: Within those extensions, what specifically should this
> Facet access? Be precise — this creates isolation between agents.
>
> | Extension | What to access | What to ignore |
> |-----------|---------------|----------------|
> | Gmail     | _______________| _______________|
> | Sheets    | _______________| _______________|
> | Calendar  | _______________| _______________|
> | Drive     | _______________| _______________|
> | Search    | _______________| _______________|
>
> **External Apps**: What non-Google apps feed data into this domain?
>
> | App | How data enters | Format |
> |-----|----------------|--------|
> | ___ | [ ] Email arrives automatically / [ ] Paste into chat / [ ] Import to Sheet | ___ |
> | ___ | [ ] Email arrives automatically / [ ] Paste into chat / [ ] Import to Sheet | ___ |
>
> *If the app already emails you summaries (gym receipts, bank alerts,
> job notifications), choose "Email arrives automatically" — zero effort.*

---

## Part 4 — Validate the Council

**Q9. Overlap Check**

> For each pair of Facets, can you clearly say "this goes to A, that goes
> to B"? If two Facets would both claim a task, their boundary needs work.
>
> - [ ] Boundaries are clear
> - [ ] Overlap between _______________ and _______________
>   - Resolution: _______________

**Q10. Final Read**

> Read the full council — Orchestrator name and description, then each
> Facet's name, role, and boundary. This is your team.
>
> - [ ] This is my council
> - [ ] Something feels off: _______________

---

## After the Questionnaire

Translate your answers into `config/council.yaml`:

| Answer | Maps To |
|--------|---------|
| Q6 (name) | `orchestrator.name` |
| Q7 (description) | `orchestrator.description` |
| Q8 (per Facet) | `facets[]` entries: name, domain, role, bmad_role, description || Q8a (per Facet) | `facets[]` entries: extensions, data_scope, external_sources |
Then run:

```bash
python scripts/initialize_facet.py
```

Your council is ready. See the [README](../README.md) for next steps.

---

*Grounded in the [Theoretical Foundations](theoretical-foundations.md).
Guided by the [Design Your Council](design-your-council.md) process.
Example: [Walkthrough](example-walkthrough.md) · [Council](example-council.md).*
