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
- product discovery and structured planning

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
| Ready | P1 | Define MVP functional spec | `product/mvp-spec.md` | Keep centered on P1 benchmark features |
| Ready | P1 | Define core entities and information architecture | `product/data-model.md` | Include place hierarchy, item records, freshness, and activity |
| Backlog | P2 | Draft screen map and navigation model | `product/screen-map.md` | Mobile-first unless later changed |
| Backlog | P2 | Draft system design for image analysis and retrieval | `architecture/system-design.md` | Should follow product spec, not precede it |
| Backlog | P2 | Draft privacy and threat boundaries | `architecture/privacy-threat-notes.md` | Use installed `security-threat-model` after system design exists |
| Backlog | P3 | Choose implementation target and scaffold first prototype | repo structure and starter app | Start only after MVP scope is stable |

## Suggested execution order

1. Create `product/mvp-spec.md`.
2. Create `product/data-model.md`.
3. Create `product/screen-map.md`.
4. Create `architecture/system-design.md`.
5. Decide prototype target and start implementation.

## Parallelization notes

Safe to parallelize:
- `product/data-model.md`

Better done after product flows are stable:
- `product/mvp-spec.md`
- `product/screen-map.md`
- `architecture/system-design.md`

## Definition of done for this phase

- The product has a clear MVP scope.
- Core flows are documented.
- The minimum data model is documented.
- Freshness and trust behavior are defined.
- Another agent can start prototyping without guessing the product basics.
