# PLAN.md

Last updated: 2026-03-08

## Objective

Define and prepare a buildable product for the household item-location service before implementation starts.

## Planning rules

- Update this file whenever a task starts, changes status, or is completed.
- Prefer concrete outputs over vague work items.
- Keep tasks small enough that another agent can pick them up without extra chat context.

## Current phase

Phase:
- implementation planning and parallel workstream setup

Known constraints:
- stay focused on product and UX
- do not spend time on business-model or expansion work
- use the benchmark elements in `references/benchmark-elements.md` as the current baseline

## Task board

| Status | Priority | Task | Expected output | Notes |
| --- | --- | --- | --- | --- |
| Completed | P0 | Build competitive reference baseline | `references/competitive-landscape.md`, `references/benchmark-elements.md` | Official sources only |
| Completed | P0 | Initialize collaboration docs | `AGENTS.md`, `PLAN.md`, `PROGRESS.md` | Establish shared workflow |
| Completed | P0 | Define top-level directory structure | `product/`, `architecture/`, `prototype/`, `assets/` | Keep root reserved for coordination files |
| Completed | P0 | Document workflow commands and skill setup | `workflow/commands.md`, `workflow/skills.md` | Includes installed skills for this phase |
| Completed | P0 | Record confirmed implementation decisions | `product/confirmed-decisions.md` | Reflects user-confirmed product constraints |
| Completed | P0 | Resolve default policy choices and define AI roles | `product/confirmed-decisions.md`, `architecture/ai-roles.md` | Captures agreed defaults before system design |
| Completed | P1 | Turn benchmark findings into target user flows | `product/user-flows.md` | Covers setup, capture, review, search, browse, move, and recapture |
| Completed | P0 | Initialize Git and publish the planning workspace | `.gitignore`, Git remote, initial push | Remote: `outliner-coach/house_seeker` |
| Completed | P1 | Define MVP functional spec | `product/mvp-spec.md` | Buildable scope, states, and acceptance criteria documented |
| Completed | P1 | Define core entities and information architecture | `product/data-model.md` | Product entities, relationships, and status model documented |
| Completed | P2 | Draft screen map and navigation model | `product/screen-map.md` | Mobile-first screen hierarchy and navigation documented |
| Completed | P2 | Draft system design for image analysis and retrieval | `architecture/system-design.md` | Firebase-based architecture and async analysis flow documented |
| Completed | P1 | Define detailed implementation workstreams | `workflow/implementation-plan.md` | Parallel execution plan and ownership rules documented |
| Completed | P1 | Define prototype subfolder ownership | `prototype/mobile-web/`, `prototype/functions/`, `prototype/shared/`, `prototype/firebase/` | Parallel lanes created for agents |
| Backlog | P2 | Draft privacy and threat boundaries | `architecture/privacy-threat-notes.md` | Use installed `security-threat-model` after system design exists |
| Ready | P1 | Scaffold base workspace and shared contracts | prototype starter files | Start WS1, WS2, WS3 from `workflow/implementation-plan.md` |
| Ready | P1 | Build auth shell and household bootstrap | frontend auth flow | Start after Firebase client initialization exists |
| Backlog | P2 | Build place hierarchy | place CRUD and path browsing | Depends on shared contracts and app shell |
| Backlog | P2 | Build capture-upload-review loop | capture, task enqueue, review queue | Depends on place detail and worker stub |
| Backlog | P2 | Build search, browse, and item detail | retrieval flows | Depends on confirmed item writes |

## Suggested execution order

1. Draft `architecture/privacy-threat-notes.md` if security review is needed before coding.
2. Start WS1, WS2, and WS3 in parallel from `workflow/implementation-plan.md`.
3. Start WS4 once Firebase client initialization exists.
4. Implement the place hierarchy before the capture-review loop.

## Parallelization notes

Safe to parallelize:
- WS1 Foundation and scaffolding
- WS2 Shared domain contracts
- WS3 Firebase project configuration
- WS4 App shell and auth once Firebase client init exists

Better done after product flows are stable:
- privacy and threat notes
- async analysis worker implementation

## Definition of done for this phase

- The product has a clear MVP scope.
- Core flows are documented.
- The minimum data model is documented.
- Freshness and trust behavior are defined.
- Another agent can start prototyping without guessing the product basics.
