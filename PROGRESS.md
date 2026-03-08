# PROGRESS.md

Last updated: 2026-03-08

## Current snapshot

Status:
- project initialized as a documentation-first workspace
- project is initialized as a Git repository
- project is published to GitHub on `origin/main`
- competitive benchmark baseline is complete
- collaboration files are now in place
- top-level directory structure is now defined
- workflow commands and skill notes are now documented
- core implementation decisions are now recorded
- default policy choices and AI roles are now documented
- core user flows are now documented
- MVP scope, data model, screen map, and system design are now documented
- detailed implementation workstreams are now documented
- prototype lanes for parallel agents are now defined
- `pnpm` workspace baseline is now created
- mobile web shell and sign-in flow now build locally
- shared schemas, Firebase rules, and functions stub are now wired
- automatic household bootstrap is now wired
- Firestore-backed place creation and hierarchy browsing are now in progress
- selected-place capture upload is now in progress
- local browser mode is now available for testing without Firebase setup
- smoke e2e now passes against the local mode dev server

Current repository contents:
- `.gitignore`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `references/README.md`
- `references/competitive-landscape.md`
- `references/benchmark-elements.md`
- `workflow/README.md`
- `workflow/commands.md`
- `workflow/skills.md`
- `workflow/implementation-plan.md`
- `product/README.md`
- `product/confirmed-decisions.md`
- `product/user-flows.md`
- `product/mvp-spec.md`
- `product/data-model.md`
- `product/screen-map.md`
- `architecture/README.md`
- `architecture/ai-roles.md`
- `architecture/system-design.md`
- `prototype/README.md`
- `prototype/mobile-web/.env.example`
- `prototype/mobile-web/package.json`
- `prototype/mobile-web/README.md`
- `prototype/mobile-web/src/`
- `prototype/functions/README.md`
- `prototype/functions/package.json`
- `prototype/functions/src/`
- `prototype/shared/README.md`
- `prototype/shared/package.json`
- `prototype/shared/src/`
- `prototype/firebase/README.md`
- `prototype/firebase/.firebaserc`
- `prototype/firebase/firebase.json`
- `prototype/firebase/firestore.indexes.json`
- `prototype/firebase/firestore.rules`
- `prototype/firebase/storage.rules`
- `assets/README.md`
- `AGENTS.md`
- `PLAN.md`
- `PROGRESS.md`

Recommended next task:
- write the stub analysis transition and real review queue so uploaded captures can move past `analysis_pending`

## Work log

### 2026-03-08 - Competitive reference baseline

Completed:
- researched similar consumer services for household item-location and home inventory
- created `references/` as the working folder for research artifacts
- added `references/competitive-landscape.md`
- added `references/benchmark-elements.md`
- limited the scope to product, UX, information architecture, trust, and collaboration

Outputs:
- service-by-service notes with official source links
- synthesized benchmark elements with P1, P2, and P3 priorities

Open follow-up:
- convert benchmark findings into user flows and MVP requirements

### 2026-03-08 - Collaboration and handoff docs initialized

Completed:
- added `AGENTS.md` for project rules and delegation guidance
- added `PLAN.md` for active tasks and execution order
- added `PROGRESS.md` for dated work tracking

Outputs:
- a documented workflow for future agents and parallel work
- a starting task board for product-definition work

Open follow-up:
- begin product documentation under a new `product/` folder

### 2026-03-08 - Top-level directory structure defined

Completed:
- added `product/`, `architecture/`, `prototype/`, and `assets/`
- added folder-level `README.md` files to explain what belongs in each location
- updated collaboration docs to reflect the new structure

Outputs:
- a cleaner repository layout for parallel agents
- explicit rules to keep the repository root limited to coordination files

Open follow-up:
- create the first product document under `product/`

### 2026-03-08 - Workflow commands and skills documented

Completed:
- added `workflow/` for operational documentation
- added `workflow/commands.md` with recurring shell commands for repo inspection, research, git hygiene, and skill management
- reviewed installable curated skills and selected the ones useful for this project phase
- installed `security-threat-model`
- installed `security-best-practices`
- added `workflow/skills.md` to record why each relevant skill matters

Outputs:
- a shared command reference for future agents
- a documented skill baseline for planning and future implementation

Open follow-up:
- use `security-threat-model` after the system design is drafted

### 2026-03-08 - Confirmed implementation decisions recorded

Completed:
- captured the confirmed platform, household, search, capture, and photo-policy decisions
- updated collaboration docs so future agents can treat these as fixed constraints

Outputs:
- `product/confirmed-decisions.md`
- narrowed the project open-decisions list to unresolved issues only

Open follow-up:
- convert these confirmed constraints into user flows and the MVP spec

### 2026-03-08 - Default policies and AI roles finalized

Completed:
- applied the recommended defaults for onboarding, place modeling, freshness, deletion, conflict handling, and search normalization
- documented the AI model's role as an async ingestion and enrichment layer

Outputs:
- updated `product/confirmed-decisions.md`
- added `architecture/ai-roles.md`

Open follow-up:
- turn these rules into `product/user-flows.md` and `product/data-model.md`

### 2026-03-08 - Core user flows documented

Completed:
- created `product/user-flows.md`
- defined the main user journeys for setup, place creation, capture, AI review, search, browse, move, recapture, and photo deletion
- aligned flow rules with confirmed product decisions and the AI ingestion model
- updated workflow notes to reflect that the current workspace is not yet a Git repository

Outputs:
- `product/user-flows.md`
- updated `workflow/commands.md`

Open follow-up:
- derive `product/mvp-spec.md` and `product/data-model.md` from the documented flows

### 2026-03-08 - MVP scope, data model, screens, and system design documented

Completed:
- created `product/mvp-spec.md`
- created `product/data-model.md`
- created `product/screen-map.md`
- created `architecture/system-design.md`
- cross-checked the Firebase-based system design direction against official Firebase documentation

Outputs:
- `product/mvp-spec.md`
- `product/data-model.md`
- `product/screen-map.md`
- `architecture/system-design.md`

Open follow-up:
- start the first prototype with the place hierarchy and capture-review loop

### 2026-03-08 - Detailed implementation plan and parallel lanes defined

Completed:
- created `workflow/implementation-plan.md`
- split the prototype workspace into frontend, functions, shared, and Firebase lanes
- documented workstream ownership, dependencies, milestones, and handoff expectations
- updated collaboration docs to treat the project as ready for parallel prototype work

Outputs:
- `workflow/implementation-plan.md`
- `prototype/mobile-web/README.md`
- `prototype/functions/README.md`
- `prototype/shared/README.md`
- `prototype/firebase/README.md`

Open follow-up:
- start WS1, WS2, and WS3 in parallel and keep file ownership strict

### 2026-03-08 - Implementation baseline scaffolded

Completed:
- created a root `pnpm` workspace with shared scripts for build, typecheck, and Firebase emulators
- scaffolded the Vite React mobile web app under `prototype/mobile-web/`
- added the first app shell, tab navigation, Firebase client setup, and sign-in flows
- added shared Zod schemas and constants under `prototype/shared/`
- added Firebase Functions stubs for healthcheck and capture-analysis orchestration
- added initial Firebase Hosting, Firestore Rules, Storage Rules, and index config under `prototype/firebase/`
- started wiring real household bootstrap logic so signed-in users can find or create their first household
- verified `pnpm typecheck`, `pnpm build:web`, and `pnpm --filter @house-seeker/functions build`

Outputs:
- root workspace files: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json`
- frontend baseline under `prototype/mobile-web/`
- shared contracts under `prototype/shared/`
- functions baseline under `prototype/functions/`
- Firebase config baseline under `prototype/firebase/`

Open follow-up:
- complete household bootstrap and replace more shell-mode data with Firestore-backed reads
- build place CRUD and path browsing next
- document emulator and environment setup for other agents

### 2026-03-08 - Place hierarchy baseline wired

Completed:
- added a shared place data hook backed by Firestore queries and mutations
- implemented place creation with parent selection, path preview, and activity logging
- implemented hierarchy browsing with root and child-place navigation
- connected the home screen place counts to live Firestore data when Firebase config is present
- kept shell-mode fallback cards for environments without Firebase config
- re-ran `pnpm typecheck`, `pnpm lint:web`, and `pnpm build`

Outputs:
- `prototype/mobile-web/src/features/places/use-household-places.ts`
- updated `prototype/mobile-web/src/features/places/places-page.tsx`
- updated `prototype/mobile-web/src/features/home/home-page.tsx`
- updated `prototype/mobile-web/src/styles/global.css`

Open follow-up:
- add rename and dedicated place detail behavior
- start capture upload from the selected place
- reduce the large frontend bundle once core flows are in place

### 2026-03-08 - Capture upload baseline wired

Completed:
- added a selected-place capture hook backed by Firebase Storage and Firestore writes
- upload now creates a `capture` record, updates the place status to `analysis_pending`, and logs an activity entry
- wired a basic file-input capture action into the selected place view
- listed prior captures for the selected place inside the places screen
- re-ran `pnpm typecheck`, `pnpm lint:web`, and `pnpm build`

Outputs:
- `prototype/mobile-web/src/features/captures/use-place-captures.ts`
- updated `prototype/mobile-web/src/features/places/places-page.tsx`

Open follow-up:
- move capture UI out of the places list screen into dedicated place detail or capture screens
- enqueue or simulate analysis work after upload
- add retry/error handling for partially uploaded captures

### 2026-03-08 - Local testing path and smoke e2e completed

Completed:
- added browser-local test mode so the app can run without Firebase credentials or local emulators
- kept Firebase emulator mode available, while documenting that Firestore emulators need Java on this machine
- added a committed Playwright smoke script for local login, place creation, and capture upload
- added local-mode and emulator-mode env examples and root scripts for reproducible runs
- ran the smoke test successfully against `pnpm dev:web:local`

Outputs:
- `prototype/mobile-web/src/lib/local/local-store.ts`
- `prototype/mobile-web/e2e/local-smoke.mjs`
- `prototype/mobile-web/e2e/fixtures/fixture-capture.svg`
- updated `prototype/mobile-web/src/features/auth/`
- updated `prototype/mobile-web/src/lib/firebase/client.ts`
- updated root `package.json`

Verified commands:
- `pnpm lint:web`
- `pnpm typecheck`
- `pnpm build`
- `pnpm dev:web:local`
- `BASE_URL=http://127.0.0.1:4173 pnpm e2e:local`

Open follow-up:
- build the review queue and stub analysis transition on top of the now-tested upload flow
- reduce the frontend bundle size once the core slice is stable

### 2026-03-08 - Git initialized and prepared for publishing

Completed:
- initialized the local Git repository
- added a minimal `.gitignore`
- updated workflow notes for a Git-backed workspace
- configured the GitHub remote `https://github.com/outliner-coach/house_seeker.git`
- created the initial commit
- pushed `main` to GitHub

Outputs:
- `.gitignore`
- updated `workflow/commands.md`
- Git remote `origin`
- initial commit on `main`

Open follow-up:
- continue product-definition work on the Git-backed workspace

## Update format for future entries

Use this structure for each new task:
- date
- task title
- completed work
- outputs
- open follow-up
