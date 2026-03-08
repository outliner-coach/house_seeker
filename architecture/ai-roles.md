# AI Roles

Last updated: 2026-03-08

This file defines what the AI model should and should not do in the first version of the product.

## Core principle

AI should help create and enrich inventory data at write time.

AI should not be the only source of truth for retrieval.

Search results should come from stored data in Firestore, not from an LLM call on every query.

## Primary AI responsibilities

### 1. Capture understanding

- analyze an uploaded place photo
- detect likely visible objects
- suggest object labels and coarse categories
- estimate confidence for each suggestion
- optionally suggest rough visual regions for review UIs

AI output at this stage is only a proposal.

### 2. Name normalization

- convert noisy visual labels into stable household-friendly names
- generate `normalizedName`
- generate alias candidates
- generate search tokens for later Firestore queries

Example:
- raw label: `usb cable`
- canonical name: `charging cable`
- aliases: `usb cable`, `phone charger cable`

### 3. Duplicate and move suggestions

- compare new candidate items with existing items in the same place
- suggest whether an item is:
  - already known
  - newly found
  - likely moved from another place

This must still go through user confirmation.

### 4. Review prioritization

- push low-confidence detections into the review queue
- highlight ambiguous cases instead of auto-confirming them
- rank which detections most need user attention

### 5. Optional recapture assistance

- compare a new capture with the previous capture of the same place
- suggest added, removed, or changed items

This is useful, but can be introduced after the first ingestion flow works.

## Non-goals for AI in v1

- do not answer live search queries directly
- do not auto-delete items
- do not auto-move items without user confirmation
- do not override user edits
- do not hide low-confidence uncertainty
- do not become a chat-first assistant for every action

## Recommended pipeline position

The AI model should run here:

```text
upload photo
-> async analysis job
-> candidate items + names + aliases + confidence
-> user review
-> confirmed Firestore records
-> deterministic search and browse
```

## Why this split is important

- Firestore-only retrieval stays cheap and predictable
- search remains fast on mobile web
- user corrections improve data quality
- AI errors are contained in the review step instead of leaking into final answers

## Output contract for v1

For each candidate item, the AI stage should try to produce:
- `candidateLabel`
- `normalizedName`
- `aliases[]`
- `category`
- `confidence`
- `placeId`
- optional `regionHint`

## Human confirmation rules

- low-confidence candidates must require review
- user-confirmed names override model suggestions
- user-confirmed moves override model move guesses
- manual edits should be stored and reused as stronger signals than future model guesses
