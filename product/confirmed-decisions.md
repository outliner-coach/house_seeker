# Confirmed Decisions

Last updated: 2026-03-08

This file records implementation-shaping decisions that have already been confirmed.

## Product and platform

- App form: mobile web app
- PWA install is optional, not required for the core flow
- Frontend stack direction: React + Vite + PWA
- Data platform direction: Firebase on Blaze plan
- Search implementation direction: Firestore-only for the first version
- Searchable item records should include normalized fields for deterministic retrieval

## Household model

- One `household` per family
- All signed-in household members can view all data
- All signed-in household members can edit all data
- Recommended sign-in starting point: email link plus Google sign-in

## Location model

- First version must support nested containers such as bags and boxes
- The place model must support both fixed places and movable containers
- Use one `place` entity with a type such as `fixed` or `container`

## Search behavior

- Search answers should return up to 3 candidate results
- Every result should include the last verified timestamp
- Users should also be able to browse lists and categories manually, not only search
- Search records should store `normalizedName`, `aliases`, and `searchTokens`

## Capture and analysis

- Image analysis approach: vision + rules + user confirmation
- Processing flow: upload -> async analysis -> review
- AI output is a suggestion, not the final source of truth
- Low-confidence detections must stay in a review queue until the user confirms them

## Photo policy

- Original photos are stored
- Users must be able to delete stored photos
- Photo deletion should hard-delete the stored image
- Item and place deletion should use soft delete in the first version
- Activity history should be retained

## Freshness and editing policy

- Recommend a `stale warning` around 30 days without verification
- Recommend a `stale` state around 90 days without verification
- Conflict handling direction: last write wins plus activity log

## Implementation implications

- The data model must support nested parent-child location relationships
- The UI must include both search and browse-first retrieval paths
- The system design must include an async analysis worker
- Storage and deletion flows must be explicit in both product and architecture docs

## Still open

- exact initial category taxonomy
- exact confidence thresholds for `auto-suggest` versus `review required`
- household invite UX details
- whether very old activity history should ever be archived
- Korean-specific alias and token normalization rules
