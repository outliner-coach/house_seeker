# MVP Spec

Last updated: 2026-03-08

This document defines the first buildable version of the household item-location service.

It is derived from:
- `product/confirmed-decisions.md`
- `product/user-flows.md`
- `architecture/ai-roles.md`

## 1. MVP goal

Help a shared household answer `where is this item?` by:
- registering places and containers
- capturing photos of those places
- extracting candidate items with AI
- letting users confirm the results
- returning up to 3 likely locations with freshness context

## 2. Product promise

The product should act as a shared household memory for item locations.

The first version is successful if a family can:
- register important storage places
- confirm item lists without heavy manual entry
- search or browse to find likely item locations
- correct moved items with low effort
- understand how fresh or stale the answer is

## 3. Target users

Primary users:
- parents managing a shared home

Secondary users:
- children searching for items without knowing the full storage hierarchy

## 4. In-scope surfaces

- mobile web app
- optional PWA installation
- authenticated household workspace

## 5. Core MVP features

### 5.1 Authentication and household entry

Must support:
- sign in with email link
- sign in with Google
- create one new household for the first user
- enter an existing household for already-linked users

MVP rule:
- one user belongs to one household
- all household members have the same read and write access

### 5.2 Place hierarchy

Must support:
- create, rename, and browse places
- set a parent place
- support both fixed places and movable containers
- show the exact full path of a place

Examples:
- `Kitchen > Pantry > Top Shelf`
- `Kids Room > White Cabinet > Blue Art Box`

### 5.3 Photo capture and upload

Must support:
- capture a photo from mobile web
- upload and store the original photo
- create a capture record tied to a place
- show upload and analysis status

Must not require:
- video capture
- multi-photo stitching

### 5.4 Async AI analysis

Must support:
- background analysis after upload
- candidate item generation
- candidate name normalization
- candidate alias generation
- confidence scoring

MVP rule:
- AI suggestions are not searchable until user confirmation

### 5.5 Review queue

Must support:
- review pending analysis results
- accept, rename, merge, reclassify, or reject candidates
- preserve incomplete review state if the user leaves
- clearly mark low-confidence candidates

Success bar:
- one place review should feel like a short confirmation pass, not manual database entry

### 5.6 Confirmed item records

Must support:
- create or update confirmed items from review
- tie items to the current place
- preserve aliases and normalized names for search
- preserve the latest verification timestamp

### 5.7 Search

Must support:
- text search against confirmed items only
- return up to 3 candidate results
- match against normalized names, aliases, and search tokens
- display stale or warning state

Each result must show:
- item name
- exact place path
- last verified timestamp
- freshness state

MVP rule:
- do not answer search with a live LLM response

### 5.8 Browse

Must support:
- browse by place hierarchy
- browse by item category
- open place details and view the latest photo
- see confirmed items within a place

Purpose:
- support users who do not know the exact search term

### 5.9 Item move and correction

Must support:
- move an item to another place
- correct an item name or category
- preserve a move or edit activity entry
- use last write wins for the current location

MVP rule:
- moving an item should be easier than re-registering it

### 5.10 Freshness and recapture

Must support:
- `last verified` on items and places
- warning state after around 30 days without verification
- stale state after around 90 days without verification
- recapture flow for a stale place

MVP behavior:
- new captures can suggest changes versus prior confirmed data
- old confirmed data remains active until the new review is confirmed

### 5.11 Photo deletion

Must support:
- delete an original stored photo
- hard-delete the image asset
- preserve confirmed item records unless separately removed
- keep an activity trail of the deletion

### 5.12 Activity history

Must support:
- log key actions such as create place, review capture, move item, delete photo
- show enough context to understand recent changes

MVP limit:
- activity feed can be simple and chronological

## 6. Required user-visible states

Places must support:
- empty
- active
- analysis pending
- review needed
- warning
- stale
- soft deleted

Items must support:
- confirmed
- warning
- stale
- soft deleted

Captures must support:
- uploaded
- analysis pending
- analysis failed
- review needed
- confirmed
- photo deleted

## 7. Information shown in key views

### Home

Must show:
- search entry
- pending reviews count
- stale places count
- recent places or recent activity

### Place detail

Must show:
- place name
- full path
- latest photo if available
- place status
- confirmed items
- child places
- capture and recapture actions

### Review screen

Must show:
- uploaded photo
- candidate items
- confidence hints
- actions to accept, edit, merge, or reject

### Search results

Must show:
- up to 3 candidates
- item name
- full location path
- freshness state
- last verified timestamp

## 8. Non-goals for MVP

- live conversational AI search
- voice search
- push notifications as a dependency for core flows
- QR stickers
- barcode workflows
- shopping list or stock tracking
- resale, donation, or warranty workflows
- insurance-specific inventory flows
- advanced permissions by family member
- automatic item moves without confirmation

## 9. Assumptions and placeholders

- exact first-launch category taxonomy is still open
- exact AI confidence thresholds are still open
- household invite UX detail is still open
- Korean alias normalization rules are still open

The MVP should be designed so these can be refined without changing the core entity model.

## 10. Acceptance criteria for MVP readiness

The MVP scope is ready for implementation when:
- a family member can create a place tree with nested containers
- a family member can capture one place photo and reach a review state
- confirmed items become searchable and browsable
- search returns up to 3 candidate locations with freshness context
- a family member can move an item and the new location becomes the active one
- stale places can be recaptured and reviewed
- original photos can be deleted without breaking the rest of the item records

## 11. Recommended next artifacts

- `product/data-model.md`
- `product/screen-map.md`
- `architecture/system-design.md`
