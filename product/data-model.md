# Data Model

Last updated: 2026-03-08

This document defines the product-level domain entities and information architecture for the first version of the household item-location service.

It does not define final Firestore collection paths or index configuration. That belongs in the system design.

## 1. Modeling principles

- model locations first, items second
- use one place tree for fixed storage and movable containers
- keep AI-generated proposals separate from confirmed user-facing records
- search against normalized confirmed data
- preserve freshness and activity as first-class concepts
- preserve deletion state explicitly instead of silently removing product meaning

## 2. Core entity map

Primary entities:
- `household`
- `user`
- `householdMember`
- `place`
- `capture`
- `itemCandidate`
- `item`
- `itemLocation`
- `activity`
- `category`

Supporting derived data:
- `searchTokens`
- `aliases`
- `freshnessStatus`
- `placePath`

## 3. Entity definitions

### 3.1 household

Represents one family workspace.

Required fields:
- `id`
- `name`
- `createdAt`
- `createdByUserId`
- `status`

Notes:
- one household contains all places, items, captures, and activity
- first version assumes one user belongs to one household

### 3.2 user

Represents an authenticated person.

Required fields:
- `id`
- `authProvider`
- `displayName`
- `email`
- `createdAt`
- `lastSeenAt`

Notes:
- identity comes from Firebase Auth
- product records only the user data needed by the app

### 3.3 householdMember

Represents the relationship between a user and a household.

Required fields:
- `id`
- `householdId`
- `userId`
- `role`
- `joinedAt`
- `status`

First-version rule:
- all members can read and write
- `role` can still exist for future expansion

### 3.4 place

Represents any stored location in the hierarchy.

Examples:
- room
- cabinet
- shelf
- drawer
- box
- bag

Required fields:
- `id`
- `householdId`
- `name`
- `normalizedName`
- `type`
- `parentPlaceId`
- `placePath`
- `depth`
- `status`
- `latestCaptureId`
- `lastVerifiedAt`
- `freshnessStatus`
- `createdAt`
- `createdByUserId`
- `updatedAt`
- `updatedByUserId`

Important rules:
- `type` should support at least `fixed` and `container`
- `parentPlaceId` enables nested containers
- `placePath` is stored for fast display and retrieval
- `status` should support soft delete

### 3.5 capture

Represents one uploaded photo tied to a place.

Required fields:
- `id`
- `householdId`
- `placeId`
- `photoStoragePath`
- `photoDeleted`
- `status`
- `analysisRequestedAt`
- `analysisCompletedAt`
- `reviewCompletedAt`
- `capturedAt`
- `capturedByUserId`

Suggested statuses:
- `uploaded`
- `analysis_pending`
- `analysis_failed`
- `review_needed`
- `confirmed`
- `photo_deleted`

Notes:
- a place can have many captures over time
- the latest confirmed capture is not necessarily the latest uploaded capture

### 3.6 itemCandidate

Represents a machine-generated proposal from one capture.

Required fields:
- `id`
- `householdId`
- `captureId`
- `placeId`
- `candidateLabel`
- `normalizedName`
- `aliases`
- `category`
- `confidence`
- `regionHint`
- `status`
- `matchedItemId`
- `createdAt`

Suggested statuses:
- `pending_review`
- `accepted`
- `edited`
- `merged`
- `rejected`

Notes:
- candidates are not part of normal search results
- candidate history helps debugging and future model tuning

### 3.7 item

Represents a confirmed household item record.

Required fields:
- `id`
- `householdId`
- `displayName`
- `normalizedName`
- `aliases`
- `searchTokens`
- `categoryId`
- `status`
- `currentPlaceId`
- `currentPlacePath`
- `lastVerifiedAt`
- `lastMovedAt`
- `createdAt`
- `createdByUserId`
- `updatedAt`
- `updatedByUserId`

Suggested statuses:
- `confirmed`
- `warning`
- `stale`
- `soft_deleted`

Notes:
- an item is a search-facing record
- `currentPlacePath` is denormalized for fast results

### 3.8 itemLocation

Represents the location history of an item.

Required fields:
- `id`
- `householdId`
- `itemId`
- `placeId`
- `placePath`
- `source`
- `effectiveAt`
- `createdByUserId`
- `isCurrent`

Why this exists:
- the app needs one current location and a simple historical trail
- move history should not be lost when `item.currentPlaceId` changes

### 3.9 activity

Represents a meaningful user or system action.

Required fields:
- `id`
- `householdId`
- `type`
- `actorUserId`
- `subjectType`
- `subjectId`
- `summary`
- `createdAt`

Examples of activity types:
- `place_created`
- `place_renamed`
- `capture_uploaded`
- `capture_reviewed`
- `item_moved`
- `item_corrected`
- `photo_deleted`

Notes:
- activity helps explain last-write-wins edits in a shared household

### 3.10 category

Represents an item grouping used for browse flows.

Required fields:
- `id`
- `householdId` or `scope`
- `name`
- `slug`
- `status`

Notes:
- first version can use a simple predefined set
- household-specific custom categories can be deferred

## 4. Relationship summary

- one `household` has many `householdMember`
- one `household` has many `place`
- one `place` may have one parent `place`
- one `place` has many child `place`
- one `place` has many `capture`
- one `capture` has many `itemCandidate`
- one `itemCandidate` may resolve to one `item`
- one `item` has one current `place`
- one `item` has many `itemLocation`
- one `household` has many `activity`

## 5. Product states and status fields

### Place freshness

Derived from `lastVerifiedAt`:
- `fresh`
- `warning`
- `stale`

Current recommendation:
- warning after around 30 days
- stale after around 90 days

### Deletion model

- `place`: soft delete
- `item`: soft delete
- `capture.photo`: hard delete for the stored image asset
- `activity`: retained

### Edit conflict model

First version rule:
- last write wins for current active state
- activity provides recovery context

## 6. Search-facing fields

Search should rely on confirmed records only.

Each searchable `item` should include:
- `displayName`
- `normalizedName`
- `aliases`
- `searchTokens`
- `currentPlaceId`
- `currentPlacePath`
- `lastVerifiedAt`
- `freshnessStatus`

Why denormalize:
- search results need fast reads
- full path and freshness must appear directly in results

## 7. Information architecture

### Main user-facing information groupings

- household
- place hierarchy
- review queue
- search results
- category views
- recent activity

### Main user-facing navigation objects

- `Home`
- `Places`
- `Review`
- `Browse`
- `Item detail`
- `Place detail`

### Primary retrieval routes

- by text query -> item -> current place
- by place hierarchy -> place -> confirmed items
- by category -> items -> current place
- by review queue -> capture -> item confirmation

## 8. Data ownership and source of truth

Source of truth by concern:
- authentication identity: Firebase Auth
- original photo asset: storage object
- AI proposal: `itemCandidate`
- searchable location answer: `item`
- current place hierarchy: `place`
- historical movement context: `itemLocation` and `activity`

Rule:
- user-confirmed records outrank AI-generated proposals

## 9. Open modeling questions

- exact initial category set
- whether categories are global, household-level, or mixed
- exact tokenization rules for Korean item names
- whether repeated identical items should be grouped or stored separately
- whether containers should expose additional metadata such as portability

## 10. Recommended next artifact

- `architecture/system-design.md`
