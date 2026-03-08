# Implementation Plan

Last updated: 2026-03-08

This document turns the planning artifacts into an execution plan that multiple agents can follow in parallel.

It assumes:
- `product/mvp-spec.md` is the source of feature scope
- `product/data-model.md` is the source of product entities
- `architecture/system-design.md` is the source of technical direction

## 1. Implementation objective

Build the first working prototype of the household item-location service under `prototype/` with:
- mobile web app shell
- Firebase integration
- place hierarchy
- capture and upload
- async analysis stub
- review and confirmation flow
- deterministic search and browse

## 2. Execution strategy

Use parallel workstreams that touch different folders and converge through shared contracts.

The project should avoid:
- multiple agents editing the same file family at once
- blocking frontend progress on the final AI provider choice
- mixing Firebase configuration, frontend UI, and worker code in one task

## 3. Prototype folder ownership

### `prototype/mobile-web/`

Owns:
- React app
- routes
- screens
- feature modules
- UI components
- Firebase client integration

### `prototype/functions/`

Owns:
- Cloud Functions
- task queue workers
- trusted write utilities
- storage cleanup handlers

### `prototype/shared/`

Owns:
- shared schemas
- domain constants
- status enums
- shared type definitions

### `prototype/firebase/`

Owns:
- Firebase config files
- emulator setup
- Firestore rules
- Storage rules
- indexes
- local seed strategy

## 4. Recommended workstreams

### WS1. Foundation and scaffolding

Goal:
- create the runnable workspace structure and base toolchain

Primary outputs:
- `prototype/mobile-web/package.json`
- `prototype/mobile-web/vite.config.*`
- `prototype/mobile-web/src/main.*`
- `prototype/mobile-web/src/app/`
- `prototype/functions/package.json`
- `prototype/shared/`
- `prototype/firebase/`

Tasks:
- scaffold the Vite React app
- add TypeScript
- add routing, React Query, Firebase SDK, Zod
- establish formatting, linting, and environment file patterns

Can start immediately:
- yes

### WS2. Shared domain contracts

Goal:
- define the shared product model in code before feature work spreads

Primary outputs:
- `prototype/shared/src/types/`
- `prototype/shared/src/schemas/`
- `prototype/shared/src/constants/`

Tasks:
- encode place, capture, item, activity, and candidate schemas
- define shared status enums
- define frontend-safe DTO shapes
- define Firestore document shape assumptions

Can start immediately:
- yes

Dependency notes:
- should follow `product/data-model.md`
- should not wait for Firebase implementation

### WS3. Firebase project configuration

Goal:
- make local development and deployment structure predictable

Primary outputs:
- `prototype/firebase/firebase.json`
- `prototype/firebase/.firebaserc`
- `prototype/firebase/firestore.rules`
- `prototype/firebase/storage.rules`
- `prototype/firebase/firestore.indexes.json`
- `prototype/firebase/README.md`

Tasks:
- create emulator configuration
- write initial Security Rules
- define required composite indexes
- document local startup and environment setup

Can start immediately:
- yes

Dependency notes:
- should consume shared schemas and data-model assumptions

### WS4. App shell and auth

Goal:
- get a signed-in mobile web shell running

Primary outputs:
- `prototype/mobile-web/src/routes/`
- `prototype/mobile-web/src/features/auth/`
- `prototype/mobile-web/src/features/household/`
- `prototype/mobile-web/src/components/layout/`

Tasks:
- app shell
- route protection
- sign-in screens
- household bootstrap logic
- tab navigation shell

Can start immediately:
- yes

Dependency notes:
- depends on Firebase client initialization
- can use placeholder household screens until place features land

### WS5. Place hierarchy

Goal:
- make the place tree usable end-to-end

Primary outputs:
- `prototype/mobile-web/src/features/places/`

Tasks:
- place list
- place detail
- add or edit place
- parent-child hierarchy drill down
- path generation integration

Can start after:
- WS1
- WS2 basic schemas
- WS3 basic Firestore rules
- WS4 app shell

### WS6. Capture upload and photo storage

Goal:
- enable mobile capture and upload tied to a place

Primary outputs:
- `prototype/mobile-web/src/features/captures/`
- storage upload helpers in `prototype/mobile-web/src/lib/firebase/`

Tasks:
- camera file intake
- upload confirmation screen
- capture document creation
- Storage upload
- capture status updates

Can start after:
- WS1
- WS3 basic Storage rules
- WS5 place detail exists

### WS7. Async analysis pipeline stub

Goal:
- create the backend shape before the final model provider is chosen

Primary outputs:
- `prototype/functions/src/analysis/`
- `prototype/functions/src/tasks/`
- `prototype/functions/src/triggers/`

Tasks:
- task queue enqueue entrypoint
- mock or rule-based analysis adapter
- candidate writeback
- failure and retry states

Can start after:
- WS1
- WS2 schemas
- WS3 Firebase config

Important implementation rule:
- start with a provider-agnostic adapter interface
- use a stub or deterministic mock worker first
- do not block the whole implementation on the final model choice

### WS8. Review queue and confirmation

Goal:
- turn candidates into confirmed item records

Primary outputs:
- `prototype/mobile-web/src/features/review/`
- item confirmation write logic

Tasks:
- review queue list
- review detail screen
- accept, edit, merge, reject actions
- confirmed item creation
- place freshness update

Can start after:
- WS6
- WS7

### WS9. Search, browse, and item detail

Goal:
- make confirmed inventory retrievable

Primary outputs:
- `prototype/mobile-web/src/features/search/`
- `prototype/mobile-web/src/features/browse/`
- `prototype/mobile-web/src/features/items/`

Tasks:
- search result screen
- browse by place
- browse by category
- item detail
- ranking logic for up to 3 results

Can start after:
- WS2
- WS5
- WS8 minimum confirmed item writes

### WS10. Move, recapture, and freshness

Goal:
- complete the trust-maintenance loop

Primary outputs:
- item move flow
- recapture flow
- stale and warning badges
- activity entries for corrections

Can start after:
- WS8
- WS9

### WS11. QA, fixtures, and developer workflow

Goal:
- make parallel development testable and repeatable

Primary outputs:
- test fixtures
- seed scripts
- smoke test checklist
- emulator startup guide

Can start after:
- WS1
- WS3

## 5. Parallelization matrix

Can run in parallel from day 1:
- WS1 Foundation and scaffolding
- WS2 Shared domain contracts
- WS3 Firebase project configuration
- WS4 App shell and auth

Can run in parallel once the shell exists:
- WS5 Place hierarchy
- WS7 Async analysis pipeline stub
- WS11 QA, fixtures, and developer workflow

Can run in parallel once upload and candidates exist:
- WS8 Review queue and confirmation
- WS9 Search, browse, and item detail

Should land last:
- WS10 Move, recapture, and freshness

## 6. Integration milestones

### M0. Runnable shell

Definition:
- app boots locally
- Firebase config loads
- authentication shell works

Required workstreams:
- WS1
- WS3
- WS4

### M1. Place management

Definition:
- user can create, browse, and edit nested places

Required workstreams:
- WS2
- WS5

### M2. Capture to review

Definition:
- user can capture a place photo
- upload succeeds
- async worker writes candidates
- review queue displays pending captures

Required workstreams:
- WS6
- WS7
- WS8 initial queue

### M3. Searchable confirmed inventory

Definition:
- reviewed items become confirmed records
- search returns top 3 candidates
- browse views are usable

Required workstreams:
- WS8
- WS9

### M4. Trust maintenance

Definition:
- user can move items
- stale places are visible
- recapture works
- photo deletion works

Required workstreams:
- WS10

## 7. File ownership rules for parallel agents

- one agent owns one feature folder at a time
- shared contracts must land before downstream feature wiring
- avoid editing `prototype/shared/` and `prototype/mobile-web/src/features/*` in the same task unless the task is integration-only
- Firebase rules and indexes should be changed in dedicated tasks because they affect all agents

Safe ownership split:
- Agent A: `prototype/mobile-web/src/features/auth/**`, `prototype/mobile-web/src/app/**`
- Agent B: `prototype/shared/**`
- Agent C: `prototype/firebase/**`
- Agent D: `prototype/mobile-web/src/features/places/**`
- Agent E: `prototype/functions/**`

## 8. Contract-first decisions

These should be treated as implementation contracts before broad parallel work:
- shared status enums
- place document shape
- capture document shape
- item candidate document shape
- confirmed item document shape
- activity event shape

Recommended rule:
- land these in `prototype/shared/` first and reference them everywhere else

## 9. Open items that should not block the prototype

- exact initial category taxonomy
- exact AI confidence thresholds
- final household invite UX
- Korean-specific alias normalization rules
- final external model provider

Recommended approach:
- use a fixed starter category list
- use conservative review-required defaults
- postpone invite UX beyond the first signed-in household owner path
- use simple lowercase and whitespace-trim normalization first
- hide the AI provider behind an adapter interface

## 10. Handoff expectations per workstream

Each workstream handoff should include:
- files created or changed
- local run command
- assumptions made
- known gaps
- integration points for the next workstream

## 11. Recommended immediate next moves

1. Start WS1, WS2, and WS3 in parallel.
2. Start WS4 once Firebase client initialization exists.
3. Land shared schemas before broad feature branching.
4. Build the place hierarchy before capture review, because place selection anchors almost every later flow.
