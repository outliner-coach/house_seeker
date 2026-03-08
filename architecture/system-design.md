# System Design

Last updated: 2026-03-08

This document proposes the first buildable technical architecture for the household item-location service.

It is based on:
- `product/confirmed-decisions.md`
- `product/mvp-spec.md`
- `product/data-model.md`
- `architecture/ai-roles.md`

## 1. Architecture summary

Recommended stack:
- frontend: React + Vite + TypeScript
- hosting: Firebase Hosting
- auth: Firebase Authentication
- database: Cloud Firestore
- file storage: Cloud Storage for Firebase
- backend logic: Cloud Functions for Firebase
- async jobs: task queue functions backed by Cloud Tasks

Why this fits:
- the app is a mobile-first authenticated web app, not an SEO-heavy public site
- Firebase Hosting is optimized for static and single-page web apps
- Firestore fits the shared household and place-tree model
- Storage fits original photo retention
- task queue functions fit image-analysis jobs and retries

## 2. Official design constraints

The design should respect these Firebase behaviors:
- Firestore supports hierarchical data with subcollections and can nest data up to 100 levels deep
- deleting a Firestore document does not delete its subcollections
- web offline persistence is disabled by default and should be enabled only for trusted-device scenarios when sensitive data is involved
- Firestore synchronization uses last write wins for multiple changes to the same document
- task queue functions use Cloud Tasks and support per-queue retry and rate-limit configuration

## 3. Deployment model

### Frontend deployment

- build the Vite app into static assets
- deploy the app to Firebase Hosting
- configure SPA rewrites to `index.html`
- serve the site over the default Firebase-hosted domain first

### Backend deployment

- deploy Cloud Functions in the same Firebase project
- expose only a minimal set of HTTPS functions if needed
- keep most CRUD operations directly on Firebase SDKs from the client, guarded by Auth and Security Rules
- reserve Functions for trusted operations and async processing

## 4. High-level component map

```text
Mobile Browser
  -> React + Vite app on Firebase Hosting
  -> Firebase Auth
  -> Firestore reads/writes
  -> Storage uploads

Cloud Functions
  -> capture analysis orchestration
  -> task enqueue
  -> trusted write utilities
  -> cleanup and maintenance jobs

Task Queue Worker
  -> image analysis
  -> normalization
  -> candidate generation
  -> duplicate and move suggestions

Firebase Storage
  -> original capture photos

Cloud Firestore
  -> household, place, capture, candidate, item, activity data
```

## 5. Frontend structure

Recommended app modules:
- `auth`
- `household`
- `places`
- `captures`
- `review`
- `search`
- `browse`
- `activity`

Recommended client libraries:
- `react-router-dom` for route structure
- Firebase Web SDK for Auth, Firestore, and Storage
- `@tanstack/react-query` for async query and mutation state
- `zod` for client-side validation and shared payload validation
- `vite-plugin-pwa` for optional PWA support

Recommended folder shape for the first prototype:

```text
prototype/mobile-web/
  src/
    app/
    routes/
    features/
      auth/
      household/
      places/
      captures/
      review/
      search/
      browse/
      activity/
    components/
    lib/
      firebase/
      validation/
      utils/
    styles/
prototype/functions/
  src/
    tasks/
    analysis/
    http/
    utils/
prototype/shared/
  src/
    types/
    schemas/
    constants/
prototype/firebase/
  firebase.json
  .firebaserc
  firestore.rules
  storage.rules
  firestore.indexes.json
```

## 6. Firestore architecture

### Recommended top-level structure

Use one top-level collection for households, then place most product data under the household boundary.

Suggested shape:

```text
households/{householdId}
households/{householdId}/members/{memberId}
households/{householdId}/places/{placeId}
households/{householdId}/captures/{captureId}
households/{householdId}/itemCandidates/{candidateId}
households/{householdId}/items/{itemId}
households/{householdId}/itemLocations/{itemLocationId}
households/{householdId}/activities/{activityId}
```

Why this shape:
- makes household scoping explicit
- simplifies Security Rules
- keeps shared data inside one clear boundary

### Important Firestore caveat

Because deleting a parent document does not delete subcollections, the product should:
- prefer soft delete for `place` and `item`
- use explicit cleanup functions for destructive maintenance
- avoid relying on implicit cascade delete behavior

## 7. Storage architecture

Store original photos in Cloud Storage under household and place paths.

Suggested path shape:

```text
households/{householdId}/places/{placeId}/captures/{captureId}/original.jpg
```

Why:
- household ownership stays clear
- deletion jobs can target one capture asset precisely
- Storage Rules can mirror Firestore household boundaries

## 8. Core runtime flows

### 8.1 Sign-in and household bootstrap

1. User authenticates with Firebase Auth.
2. Client checks whether a household membership exists.
3. If not, client creates a household document and the first member record.
4. Client routes into the shared workspace.

### 8.2 Place CRUD

1. Client writes or updates a place document in the household scope.
2. Client recalculates and stores `placePath` and `depth`.
3. Activity entry is written for important edits.

### 8.3 Capture upload

1. Client creates a capture document with `uploaded` or `analysis_pending` state.
2. Client uploads the image to Storage.
3. Client updates the capture with the storage path.
4. Client or trusted backend enqueues analysis.

### 8.4 Async analysis

1. A task queue function receives a capture job.
2. The worker downloads the image from Storage.
3. The worker runs vision analysis and normalization logic.
4. The worker writes `itemCandidate` records and updates capture state to `review_needed`.

### 8.5 Review confirmation

1. Client loads candidates for a capture.
2. User accepts, edits, merges, or rejects candidates.
3. Client writes confirmed `item` updates and current `itemLocation` entries.
4. Client updates the place and item `lastVerifiedAt`.
5. Client writes activity entries and marks the capture as `confirmed`.

### 8.6 Search

1. Client searches household-scoped confirmed items only.
2. Query matches normalized names, aliases, or search tokens.
3. Client ranks results using exactness and freshness.
4. Client shows up to 3 candidates with place path and last verified time.

### 8.7 Move correction

1. Client updates the item's current place fields.
2. Client appends an `itemLocation` history entry.
3. Client writes an activity entry.
4. Last write wins if another edit happened first.

## 9. AI pipeline design

### Responsibilities

The AI stage should:
- identify likely visible items
- propose normalized names
- generate aliases and search tokens
- estimate confidence
- suggest duplicates or moved-item matches

### Non-responsibilities

The AI stage should not:
- answer search queries live
- auto-confirm low-confidence results
- overwrite user edits
- auto-delete or auto-move records

### Worker output

For each candidate:
- `candidateLabel`
- `normalizedName`
- `aliases`
- `category`
- `confidence`
- `placeId`
- optional `regionHint`

## 10. Search design

First-version search should stay deterministic and Firestore-backed.

Recommended strategy:
- store `normalizedName`
- store `aliases`
- store `searchTokens`
- store `currentPlacePath`
- rank exact and fresher results first in application logic

Reason:
- avoids LLM latency and cost for routine household retrieval
- keeps search predictable and debuggable

## 11. Security and data-boundary direction

### Authentication

- use Firebase Auth on the client
- every data read and write must be scoped to the user's household membership

### Firestore Rules direction

Rules should enforce:
- only authenticated users can access household data
- users can access only households they belong to
- write access is limited to household members
- deleted or protected states cannot be bypassed by direct client writes

### Storage Rules direction

Rules should enforce:
- only household members can upload or read household photos
- delete access follows the same household boundary

### Trusted operations

Use Cloud Functions for:
- task enqueue
- destructive cleanup
- any cross-document or cross-service write that should not rely only on the client

## 12. Offline and caching direction

Recommended first-version behavior:
- do not make offline support a core dependency
- keep Firestore web offline persistence disabled by default
- revisit trusted-device-based persistence after privacy behavior is defined more tightly

Why:
- the app stores private household photos and location data
- web persistence can keep cached data across sessions on the device

## 13. Reliability and operations

Recommended baseline:
- use Firebase Emulator Suite during development
- use task queue retries for transient analysis failures
- keep capture status explicit so failed jobs can be retried safely
- write activity entries for high-impact user actions

## 14. Open implementation questions

- final Firebase project layout between app and functions directories
- exact AI model provider and invocation method
- exact Firestore query shapes for Korean token matching
- whether review confirmation should be client-driven or function-mediated
- whether category definitions live in code or in Firestore

## 15. Source notes

This design direction was cross-checked against official Firebase documentation for:
- Firebase Auth on web
- Firestore data modeling
- Firestore offline persistence on web
- Cloud Storage for Firebase on web
- task queue functions backed by Cloud Tasks
- Firebase Hosting for static and SPA deployment
