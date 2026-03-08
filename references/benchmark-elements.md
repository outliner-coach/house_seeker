# Benchmark Elements

Last updated: 2026-03-08

This note distills benchmarkable product elements from similar services. It is intentionally limited to product, UX, and information architecture.

## 1. Capture flow

### Place-first capture

- Benchmark the unit of capture as a place: drawer, shelf, box, cabinet, closet section.
- Avoid starting from a blank item form whenever possible.
- Good references:
  - ShelfMonster
  - HomeVue
  - HomeZada

### Nested capture

- Support drilling down from one photo into another container inside that photo.
- This matters because real homes store items inside boxes, pouches, drawers, and bags.
- Good references:
  - ShelfMonster
  - ItemMap

### Multi-item extraction from one image

- One photo should create many items when the scene is structured enough.
- The review checkpoint should be "confirm or fix" rather than "type everything yourself."
- Good references:
  - HomeVue
  - Scanlily
  - Stuffbee

### Fast bootstrap modes

- Consider two entry modes:
  - `Quick place capture`: one drawer or shelf
  - `Room walkthrough`: faster onboarding for a full room
- Good references:
  - ItemMap
  - Stuffbee
  - HomeZada

## 2. Location model

### Storage hierarchy

- Build the model around a storage tree rather than a flat tag list.
- Minimum useful structure:
  - `Home > Room > Storage > Sub-storage`
- Good references:
  - HomeDex
  - Itemtopia

### Exact path display

- Search results should show a full path, not only a room name.
- Example:
  - `Kids Room > White Cabinet > Second Drawer`
- Good references:
  - ItemMap
  - HouseBook

### Aliases and grouped items

- Support synonyms such as `flashlight` vs `torch`, or `passport case` vs `document pouch`.
- Group similar items when users care more about "do we have it?" than which exact unit it is.
- Good references:
  - HomeVue
  - Itemtopia

## 3. Retrieval flow

### Natural-language search

- Optimize for everyday questions, not database queries.
- Example intents:
  - `Where is the glue gun?`
  - `What is in the camping box?`
  - `Do we still have extra batteries?`
- Good references:
  - ShelfMonster
  - ItemMap
  - Scanlily
  - HomeVue

### Search result composition

- A strong result should include:
  - item name
  - exact location path
  - location photo or cropped visual cue
  - last verified or last moved timestamp
  - optional `moved by` context in shared households
- Good references:
  - 어디뒀지
  - HomeVue

### Repeat retrieval shortcuts

- Keep favorites, recent searches, and widgets close to the home screen.
- Household retrieval is repetitive; shortcuts matter more than deep filtering.
- Good references:
  - 어디뒀지
  - HomeVue

## 4. Shared household workflows

### Shared editing

- Multiple family members should be able to add, correct, and move items.
- The service should treat corrections as a first-class action, not an edge case.
- Good references:
  - HomeVue
  - HouseBook
  - Itemtopia

### Activity and notifications

- Show when someone moved or reclassified an item.
- Notifications are especially useful when the household shares responsibility for storage.
- Good references:
  - HomeVue
  - Itemtopia

### Shareable result links

- Consider sharing a direct item or location result into chat, rather than only sharing the whole database.
- Good references:
  - HouseBook
  - HomeVue

## 5. Trust and freshness

### Last-seen confidence

- Inventory without freshness decays quickly.
- Benchmark a visible freshness layer:
  - `last verified`
  - `last moved`
  - `stale - needs recapture`
- This is a product gap across many references and should likely be stronger here.

### Easy relocation

- Updating a moved item must be cheap.
- Drag-and-drop or one-tap move actions are better than editing a long form.
- Good references:
  - HomeDex
  - ShelfMonster

### User-owned data

- Exports and offline/privacy language increase trust for a service that stores photos of private spaces.
- Good references:
  - Scanlily
  - Itemtopia
  - HomeVue

## 6. What to skip in early product design

- QR-sticker-first workflows
- Insurance valuation and claim reporting
- Selling, donating, or resale flows
- Asset depreciation, receipts, and warranty-heavy screens
- Deep enterprise permissions
- Shopping lists and low-stock systems

These all show up in adjacent products, but they dilute the core household-location experience.

## 7. Priority benchmark list for our product

### P1

- Place-first capture
- Multi-item extraction from one image
- Storage hierarchy
- Exact location path in search results
- Family sharing and correction flow
- Last-verified freshness signal

### P2

- Nested capture
- Voice search
- Favorites, recents, and widgets
- Activity feed for moved items
- One-tap relocation

### P3

- Room walkthrough bootstrap
- Video capture
- Spatial or 3D visualization
- Full export and admin tooling

## 8. Benchmark questions to use during design

- Can a parent register one drawer in under 20 seconds?
- Can a child search for an item without understanding the storage taxonomy?
- Does every search result answer `what`, `where`, and `how sure are we`?
- Can another family member correct the result in one or two taps?
- Can the service represent `item inside container inside cabinet` cleanly?
- Can it survive natural synonym usage without forcing exact naming?
