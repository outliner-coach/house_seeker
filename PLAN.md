# PLAN.md

Last updated: 2026-03-08

## Objective

Build the first working prototype of the household item-location service with a stable baseline for parallel agent work.

## Planning rules

- Update this file whenever a task starts, changes status, or is completed.
- Prefer concrete outputs over vague work items.
- Keep tasks small enough that another agent can pick them up without extra chat context.

## Current phase

Phase:
- implementation baseline and foundation work

Known constraints:
- stay focused on product and UX
- do not spend time on business-model or expansion work
- use the benchmark elements in `references/benchmark-elements.md` as the current baseline
- keep Firebase membership docs keyed by `uid` for rules and bootstrap consistency

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
| Completed | P0 | Scaffold implementation workspace baseline | root workspace config, `prototype/mobile-web/`, `prototype/shared/`, `prototype/functions/`, `prototype/firebase/` | `pnpm` workspace, frontend shell, shared schemas, functions stub, and Firebase config now build |
| Completed | P0 | Finish auth shell and household bootstrap | signed-in shell and automatic household provisioning | Household bootstrap now creates or resolves the member's household |
| In progress | P1 | Build place hierarchy | place list, create flow, parent selection, and path browsing | Create + browse + nested parent flow are live; rename and richer place detail still pending |
| In progress | P1 | Build capture upload flow | camera intake, capture records, Storage upload | Selected place can now upload one photo to Storage and create a capture record |
| Completed | P1 | Establish a local test and smoke path | local mode login, browser-local data path, and reproducible e2e | `pnpm dev:web:local` and `pnpm e2e:local` now work on this machine |
| Completed | P1 | Publish the hosted prototype baseline | Firebase Hosting deploy for the current build | Deployed to `https://house--seeker.web.app` |
| Ready | P1 | Build review queue and confirmation | review list, candidate edits, confirmed item writes | Depends on capture flow and worker stub |
| Ready | P1 | Build deterministic search and browse | search results, browse by place, item detail | Can start against shared item contracts |
| In progress | P1 | Wire emulator and environment setup docs | `.env.example`, README updates, emulator routine | Local mode is documented; Firebase emulators still need Java on this machine |
| Backlog | P2 | Draft privacy and threat boundaries | `architecture/privacy-threat-notes.md` | Use installed `security-threat-model` after system design exists |

## Suggested execution order

1. Start WS7 with the current capture-analysis stub and Firestore writeback path.
2. Start WS8 so uploaded captures can transition into `review_needed` and appear in the review queue.
3. Finish WS5 with rename and richer place detail behavior.
4. Extract the capture flow out of the places screen into a dedicated place-detail or capture surface.

## Parallelization notes

Safe to parallelize:
- WS5 rename and richer place detail flow
- WS7 async analysis worker stub refinement
- WS11 QA, fixtures, and emulator workflow

Better done after product flows are stable:
- privacy and threat notes
- deeper async analysis worker implementation

## Definition of done for this phase

- `pnpm install` works from the repository root.
- the mobile web shell builds and typechecks.
- the place hierarchy supports create and browse flows against Firestore.
- Firebase rules, indexes, and config exist in one predictable location.
- shared contracts exist for the main product entities.
- another agent can start WS6 or WS7 without re-deciding the project baseline.
