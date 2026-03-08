# Competitive Landscape

Last updated: 2026-03-08

This note tracks the most relevant services for a product that lets users photograph household locations, detect items, and answer "where is X?" later.

## Closest references

### ShelfMonster

- Relevant angle: place-first visual inventory with nested capture and conversational retrieval.
- Benchmark:
  - `shelf -> container -> inner items` drill-down capture instead of a flat item list
  - zero-manual-entry positioning as the default promise
  - conversational commands for locate and bulk move flows
- Caution:
  - public surface emphasizes capture and chat, but does not show how stale data or wrong detections are corrected
- Sources:
  - [ShelfMonster official site](https://www.shelfmonster.com/)

### ItemMap

- Relevant angle: room scan plus spatial search.
- Benchmark:
  - room-level bootstrap by walking through the space with a phone
  - search results tied back to a visual location, not just a text list
  - phone capture plus web dashboard for later browsing
  - sharing room inventories with other people or groups
- Caution:
  - 3D map UX is compelling, but expensive to build and likely unnecessary for an MVP
- Sources:
  - [ItemMap official site](https://itemmap.app/)

### HomeVue

- Relevant angle: family-first household organizer with AI photo intake.
- Benchmark:
  - capture a drawer, box, or shelf and batch-assign one location to all recognized items
  - household sharing with notifications when someone moves something
  - voice-first retrieval via Siri and Apple Watch
  - synonym handling for search terms
  - widgets and quick-share links into family conversations
- Caution:
  - current product is tightly coupled to the Apple ecosystem
- Sources:
  - [HomeVue App Store listing](https://apps.apple.com/us/app/homevue-ai-home-organization/id6754808513)

### Scanlily

- Relevant angle: one-photo multi-item detection with richer capture metadata.
- Benchmark:
  - inventory many items from a single photo
  - optional video capture for shelves, bins, and rooms
  - natural-language search against stored inventory
  - spreadsheet-style editing and full export for user trust
  - attach notes, documents, or maintenance context to an item
- Caution:
  - QR-based flows, packing checklists, and maintenance features can pull the product away from the core "where is it?" use case
- Sources:
  - [Scanlily App Store listing](https://apps.apple.com/us/app/scanlily-organize-with-ai/id1627766472)
  - [Scanlily official site](https://www.scanlily.com/)

### Stuffbee

- Relevant angle: lightweight room or shelf scanning with minimal setup.
- Benchmark:
  - choose between scanning a shelf and scanning a room
  - on-device AI positioning for privacy-sensitive household data
  - fast bootstrap for people who want a usable result before detailed cleanup
- Caution:
  - product framing is still broad, so it is less clear how retrieval and correction flows stay sharp after onboarding
- Sources:
  - [Stuffbee official site](https://www.stuffbee.com/Home)

### 어디뒀지

- Relevant angle: Korean-language consumer app framing the exact "I know it's in the house somewhere" problem.
- Benchmark:
  - lead with `10-second search` instead of generic inventory language
  - show the saved photo and exact location as the search result
  - favorites and recent searches for repeat retrieval
  - "forgotten item" reminders to recover stale or neglected inventory
  - home-screen widget support for quick access
- Caution:
  - public description is strongly item-centric; collaboration and family workflows are not yet obvious
- Sources:
  - [어디뒀지 App Store listing](https://apps.apple.com/kr/app/%EC%96%B4%EB%94%94%EB%92%80%EC%A7%80/id6757179682)

### HomeDex

- Relevant angle: location hierarchy as the backbone of search.
- Benchmark:
  - explicit storage tree such as `Home > Room > Cabinet > Drawer`
  - voice search in addition to typed search
  - drag-and-drop relocation when things move
  - privacy-forward language around household data
- Caution:
  - low-stock reminders and shopping lists are useful, but not core to the first version of this product
- Sources:
  - [HomeDex official site](https://home-dex.com/)

## Useful adjacent references

### HouseBook

- Relevant angle: simple manual inventory that people can actually finish.
- Benchmark:
  - exact-location memory with a photo-first input flow
  - easy collaboration by inviting housemates or sharing a view link
  - flexibility to create a basic whole-house inventory quickly
  - PDF and CSV export for user control
- Caution:
  - weak automation compared with AI-first products
- Sources:
  - [HouseBook App Store listing](https://apps.apple.com/us/app/housebook-home-inventory/id1489866496)

### Itemtopia

- Relevant angle: mature inventory system with strong sharing and multiple intake paths.
- Benchmark:
  - multiple add methods: photo, voice, barcode, receipt forwarding
  - reminders attached to items and locations
  - permissioned collaboration and activity tracking
  - offline access
- Caution:
  - feature breadth is high; copying too much would bury the core household-location use case
- Sources:
  - [Itemtopia App Store listing](https://apps.apple.com/us/app/itemtopia-inventory/id952405279)

### HomeZada

- Relevant angle: room-level photo and video capture for home-wide bootstrap.
- Benchmark:
  - start with room photos instead of item-by-item entry
  - support room video as a fast visual record for later review
  - use close-up shots only when detail is required
- Caution:
  - this product is heavily shaped by insurance workflows, which are out of scope here
- Sources:
  - [HomeZada home inventory page](https://www.homezada.com/homeowners/home-inventory)

## Quick takeaways

- The strongest direct references all reduce manual entry and make the location itself the main unit of capture.
- Search is better when it returns a concrete place, a photo, and a path such as `Utility Room > Top Shelf > Black Box`.
- Family collaboration shows up in the best consumer tools as shared collections, notifications, or share links.
- The clearest gap is not raw recognition quality alone, but keeping location data fresh after people move things.
