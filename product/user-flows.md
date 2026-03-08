# User Flows

Last updated: 2026-03-08

This document defines the core user flows for the first version of the household item-location service.

It is based on:
- `product/confirmed-decisions.md`
- `references/benchmark-elements.md`
- `architecture/ai-roles.md`

## Scope

This document covers the primary user-facing flows required before implementation:
- sign in and enter a household
- create and organize places
- capture a place photo
- review AI-generated item candidates
- search for an item
- browse locations and categories
- move or correct item locations
- recapture stale places
- delete stored photos

## Shared assumptions

- The product is a mobile web app.
- One family uses one shared `household`.
- All household members can view and edit the same data.
- AI runs asynchronously after photo upload.
- Search results come from confirmed Firestore data, not from live LLM answers.
- A `place` can be either fixed or movable.

## Flow map

1. Sign in and join the household
2. Create the initial place structure
3. Capture a fixed place
4. Capture a nested container
5. Review and confirm AI suggestions
6. Search for an item
7. Browse by place or category
8. Move or correct an item
9. Recapture a stale place
10. Delete a stored photo

## 1. Sign in and join the household

Goal:
- let a family member enter the shared household with minimal setup

Primary actor:
- parent or other household member

Entry point:
- open the mobile web app

Main path:
1. User chooses sign-in with email link or Google.
2. If the user already belongs to a household, the app opens the main home screen.
3. If the user is the first user, the app creates a new household and asks for a household name.
4. The app lands the user on an empty-state home screen with a prompt to add the first place.

System behavior:
- store the authenticated user
- link the user to exactly one household
- create an initial member record with edit permission

Notes:
- invite UX details are still open
- first version should optimize for one parent creating the household and later adding other members

## 2. Create the initial place structure

Goal:
- let users define where things live before item-level detail exists

Primary actor:
- any household member

Main path:
1. User taps `Add place`.
2. User chooses a place type such as room, cabinet, shelf, drawer, box, or bag.
3. User enters a household-friendly name.
4. User optionally chooses a parent place.
5. The app saves the place and returns to the place browser.

System behavior:
- save the place as a node in the location hierarchy
- allow both fixed places and containers
- show the full path after save

Success criteria:
- users can create a path such as `Kids Room > White Cabinet > Blue Art Box`

Failure or correction path:
- if a place name is too generic, users can rename it later
- if the parent was wrong, users can move the place under another parent

## 3. Capture a fixed place

Goal:
- let users photograph one real storage location and turn it into searchable data

Primary actor:
- any household member

Trigger:
- user selects a fixed place such as a drawer or shelf

Main path:
1. User opens a place detail screen.
2. User taps `Capture`.
3. The camera opens and the app guides the user to photograph one place only.
4. User confirms the photo and uploads it.
5. The app stores the original photo and marks the place as `analysis pending`.
6. The user returns to the place detail screen and sees a pending analysis state.

System behavior:
- create a capture record
- upload the original photo
- enqueue async analysis
- keep the place usable while analysis is running

Review-state behavior:
- when analysis finishes, the place shows `review needed`
- low-confidence candidates are clearly marked

Failure or correction path:
- if upload fails, keep the user on the capture confirmation step and allow retry
- if analysis fails, show a retry action and keep the photo record

## 4. Capture a nested container

Goal:
- support bags, boxes, and smaller containers inside another place

Primary actor:
- any household member

Trigger:
- user notices a container inside a parent place or wants to register one directly

Main path:
1. User opens the parent place detail.
2. User adds a child place and chooses a container type.
3. User names the container.
4. User captures the container photo from that child place.
5. The system analyzes the container independently from the parent place.

System behavior:
- treat the container as a normal place node with a parent reference
- let searches return the full path including the container

Example:
- `Living Room > TV Cabinet > Black Cable Box`

Why this matters:
- many household items live inside bags and boxes, not only fixed furniture

## 5. Review and confirm AI suggestions

Goal:
- turn AI proposals into trusted, searchable records

Primary actor:
- any household member

Trigger:
- analysis completes for a capture

Main path:
1. User opens the review screen for a capture.
2. The app shows item candidates with confidence, suggested name, and optional region hint.
3. User accepts, renames, merges, reclassifies, or removes each candidate.
4. User confirms the reviewed set.
5. The app writes confirmed item records and updates the place freshness timestamp.

System behavior:
- keep original AI suggestions separate from confirmed item records
- prefer existing known names and aliases when matching duplicates
- save manual edits as stronger signals than AI guesses

Failure or correction path:
- if the user leaves mid-review, partial review state should be preserved
- low-confidence results must not auto-publish as confirmed items

Success criteria:
- the user should be able to confirm one place in a short pass, not by filling a long form

## 6. Search for an item

Goal:
- answer `where is it?` quickly with trusted candidate locations

Primary actor:
- any household member, including children

Entry point:
- the main search bar on the home screen

Main path:
1. User enters a household-style query such as `glue`, `passport case`, or `phone charger`.
2. The app searches confirmed item records using normalized names, aliases, and search tokens.
3. The app returns up to 3 candidates.
4. Each result shows:
   - item name
   - exact place path
   - last verified timestamp
   - stale or warning state if needed
5. User opens the result to view the place and the latest photo.

System behavior:
- prefer confirmed matches over low-confidence unresolved candidates
- rank fresher and more exact matches higher
- never fabricate a location from a live model call

Failure or correction path:
- if no result exists, offer browse actions and recent places
- if results are stale, show that clearly instead of pretending certainty

Success criteria:
- a child should be able to search without understanding the place hierarchy

## 7. Browse by place or category

Goal:
- support retrieval without relying only on search text

Primary actor:
- any household member

Entry points:
- place browser
- category browser

Main path for place browsing:
1. User opens the place browser.
2. User drills into the hierarchy from room to shelf, drawer, or container.
3. The app shows child places, latest photo, and confirmed items for that node.

Main path for category browsing:
1. User opens the category browser.
2. User selects a category such as stationery, charging, documents, or craft supplies.
3. The app shows items and their current locations.

System behavior:
- allow browsing even if the user does not know the exact item name
- keep search and browse results consistent because both use the same confirmed records

## 8. Move or correct an item

Goal:
- make household corrections cheap after something moves

Primary actor:
- any household member

Trigger:
- user finds an item in the wrong place result or physically moves something

Main path:
1. User opens an item result or item detail.
2. User taps `Move` or `Correct location`.
3. User chooses the new place from recent places, search, or hierarchy browse.
4. User confirms the move.
5. The app updates the item location and writes an activity entry.

System behavior:
- apply last write wins for the current location
- preserve move history in the activity log
- update freshness for the destination place if appropriate

Failure or correction path:
- if the move was wrong, another member can move the item again
- the activity log provides recovery context

Success criteria:
- moving an item should take fewer steps than re-registering it

## 9. Recapture a stale place

Goal:
- keep results trustworthy over time

Primary actor:
- any household member

Trigger:
- a place enters warning or stale state based on last verification age

Main path:
1. User sees a stale warning on a place or a search result.
2. User opens the place and taps `Recapture`.
3. User takes a new photo.
4. The app runs async analysis and compares the new capture against existing confirmed items.
5. User reviews changes and confirms the updated set.

System behavior:
- show the user what likely changed
- keep older confirmed data until the new review is confirmed
- refresh `last verified` when review completes

Success criteria:
- users can restore trust in a place without rebuilding it from scratch

## 10. Delete a stored photo

Goal:
- let users remove household photos while keeping the rest of the inventory usable

Primary actor:
- any household member

Trigger:
- user opens a capture or photo detail

Main path:
1. User selects `Delete photo`.
2. The app explains that the stored image will be permanently removed.
3. User confirms deletion.
4. The app hard-deletes the photo from storage.
5. The app keeps related confirmed item records unless the user separately deletes them.

System behavior:
- remove the original image asset
- preserve the audit trail of the delete action
- keep text records available unless later removed through item or place flows

Failure or correction path:
- if delete fails, show retry and do not leave a partial UI state

## Cross-flow rules

- Search should only use confirmed data.
- Manual edits always override AI suggestions.
- Low-confidence AI output must remain visible as uncertain.
- Every item result should answer `what`, `where`, and `how fresh`.
- Every place should support later recapture and review.
- Browse and search must converge on the same underlying records.

## Remaining design questions that affect flows

- exact category set for first launch
- how household member invitations should work in detail
- exact thresholds for warning and stale states
- Korean alias normalization rules for search tokens
