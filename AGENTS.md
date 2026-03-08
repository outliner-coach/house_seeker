# AGENTS.md

Last updated: 2026-03-08

## Project summary

This project is for a household item-location service.

Core idea:
- users photograph storage places in the home such as drawers, shelves, boxes, cabinets, and closets
- the system extracts visible items, stores them under a location hierarchy, and later answers questions like `Where is the glue gun?`

Current phase:
- implementation planning completed
- prototype scaffolding can now begin in parallel workstreams

## Product scope

In scope:
- place-first capture
- multi-item extraction from one image
- storage hierarchy and exact location paths
- natural-language retrieval
- shared household editing and relocation
- freshness and trust signals such as `last verified`

Out of scope for now:
- monetization and business-model work
- growth, expansion, and go-to-market planning
- insurance workflows
- resale, donation, and warranty management
- shopping lists and low-stock systems
- generic smart-home automation features

## Current repository map

- root: coordination files only
- `references/README.md`: reference folder scope and source policy
- `references/competitive-landscape.md`: service-by-service notes
- `references/benchmark-elements.md`: synthesized benchmark patterns and priorities
- `workflow/README.md`: workflow-documentation folder guide
- `workflow/commands.md`: shared shell commands for recurring tasks
- `workflow/skills.md`: relevant installed skills and selection notes
- `workflow/implementation-plan.md`: detailed parallel execution plan for implementation
- `product/README.md`: product-documentation folder guide
- `product/confirmed-decisions.md`: confirmed product constraints and remaining open questions
- `product/mvp-spec.md`: MVP scope and acceptance criteria
- `product/data-model.md`: product entities and relationships
- `product/screen-map.md`: mobile screen hierarchy and navigation
- `architecture/README.md`: technical-design folder guide
- `architecture/ai-roles.md`: AI responsibilities and non-goals
- `architecture/system-design.md`: Firebase-based technical architecture
- `prototype/README.md`: prototype-code folder guide
- `prototype/mobile-web/README.md`: frontend prototype lane
- `prototype/functions/README.md`: backend worker lane
- `prototype/shared/README.md`: shared contract lane
- `prototype/firebase/README.md`: Firebase config lane
- `assets/README.md`: assets folder guide
- `PLAN.md`: current task queue and execution order
- `PROGRESS.md`: dated work log and current snapshot

## Directory structure

Top-level folders:
- `references/`: external research and benchmark material
- `workflow/`: operational docs, commands, and skill notes
- `product/`: user flows, specs, screen maps, and product decisions
- `architecture/`: system design and technical planning
- `prototype/`: code prototypes and implementation experiments
- `assets/`: screenshots, diagrams, and supporting media

Root-level files:
- `AGENTS.md`
- `PLAN.md`
- `PROGRESS.md`

Directory rule:
- keep the repository root clean
- add new work under an existing top-level folder whenever possible
- only add a new top-level folder if the existing structure is clearly insufficient

## Startup checklist for any agent

Before starting a task:
1. Read `AGENTS.md`, `PLAN.md`, and `PROGRESS.md`.
2. Read the relevant files in `references/` and `workflow/`.
3. Choose the smallest useful task and record it in `PLAN.md`.
4. State assumptions clearly if the task depends on unresolved product decisions.

After finishing a task:
1. Update `PROGRESS.md` with date, task, outputs, and open issues.
2. Update `PLAN.md` to reflect status changes and next steps.
3. Leave artifacts in a predictable file path.

## Working rules

- Keep documentation factual and concise.
- Separate observed facts from inference when summarizing external products.
- Prefer official sites and official App Store listings for competitive notes.
- Do not introduce business-model or expansion analysis unless explicitly requested.
- Optimize for artifacts that unblock the next agent, not long narrative notes.
- Do not place ad hoc work files in the repository root.

## Collaboration rules

- One agent should own one file at a time when possible.
- Prefer splitting work by artifact, not by editing the same file in parallel.
- If parallel work is needed, create separate files and merge later.
- Record handoff context in `PROGRESS.md`, not only in chat.

Recommended parallel work lanes:
- `references/`: competitive research and benchmark notes
- `workflow/`: commands, skills, and collaboration process
- `product/`: user flows, requirements, information architecture
- `architecture/`: data model, AI pipeline, system design
- `prototype/mobile-web/`: frontend application
- `prototype/functions/`: async workers and trusted backend logic
- `prototype/shared/`: shared schemas and constants
- `prototype/firebase/`: rules, indexes, emulator, and Firebase config

## Deliverable standards

Research artifacts:
- put competitive and benchmark notes under `references/`
- include source links
- do not copy long quotes from sources

Product artifacts:
- focus on flows, screens, entities, trust model, and error handling
- include explicit assumptions and unresolved decisions

Technical artifacts:
- tie system design back to the product flow
- define the minimum viable data model before proposing infrastructure

## Current product principles

- The location is the primary unit of capture.
- The system should answer `what`, `where`, and `how sure are we`.
- AI suggestions are helpful, but user correction defines ground truth.
- AI should enrich data during ingestion, not answer every search query live.
- Search results should show an exact location path and a recent verification signal.
- Relocation must be easier than initial entry.
- The product should work for a shared family household, not a single-user collector.

## Open decisions

- exact initial category taxonomy
- exact confidence thresholds for `auto-suggest` versus `review required`
- household invite UX details
- whether very old activity history should ever be archived
- Korean-specific alias and token normalization rules

## Handoff template

When handing off work to another agent, include:
- task
- files touched
- assumptions
- outputs created
- unresolved questions
- recommended next step
