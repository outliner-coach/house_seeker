# Screen Map

Last updated: 2026-03-08

This document maps the first-version mobile web app into screens, navigation paths, and key screen responsibilities.

It is based on:
- `product/user-flows.md`
- `product/mvp-spec.md`
- `product/data-model.md`

## 1. Navigation model

The app should use a mobile-first tab structure with a few deep detail screens.

Recommended primary tabs:
- `Home`
- `Places`
- `Review`
- `Browse`
- `Settings`

Recommended global patterns:
- persistent search entry from `Home`
- back navigation on all detail screens
- floating or fixed `Capture` action on place detail only, not globally

## 2. Top-level screen map

### 2.1 Home

Purpose:
- fast retrieval and task awareness

Must include:
- main search bar
- pending review summary
- stale place summary
- recent searches
- recent places or recent activity

Primary actions:
- search for an item
- open a pending review
- open a stale place

### 2.2 Places

Purpose:
- browse and manage the place hierarchy

Must include:
- root-level place list
- parent-child drill down
- add place action
- place status indicators

Primary actions:
- open place detail
- add child place
- rename or reorganize place

### 2.3 Review

Purpose:
- show all captures waiting for user confirmation

Must include:
- list of pending captures
- place name and path
- capture timestamp
- confidence or urgency hint

Primary actions:
- open review detail
- resume unfinished review

### 2.4 Browse

Purpose:
- support non-search retrieval

Must include:
- browse by category
- browse by recent or favorites if added later
- item lists with current place paths

Primary actions:
- open category item list
- open item detail

### 2.5 Settings

Purpose:
- account and household utilities

Must include:
- current household name
- signed-in user info
- member list placeholder
- sign-out action

May include later:
- invite flow
- trusted-device or offline settings

## 3. Detail screens

### 3.1 Search results

Entry points:
- home search bar

Must include:
- up to 3 item candidates
- exact place path
- freshness label
- last verified timestamp
- shortcut into place detail

Empty state:
- no confirmed result found
- offer browse by place or category

### 3.2 Place detail

Entry points:
- places tab
- search result
- stale alert

Must include:
- place name
- full place path
- place type
- freshness state
- latest photo
- child places
- confirmed items
- capture history preview

Primary actions:
- capture
- recapture
- add child place
- rename place
- move place

### 3.3 Place create or edit

Must include:
- place name input
- place type selector
- parent selector

Validation:
- block empty names
- prevent circular parent assignment

### 3.4 Capture confirm

Entry points:
- place detail

Must include:
- camera preview or selected image
- place name and path
- retake
- upload

System states:
- upload in progress
- upload failed

### 3.5 Review detail

Entry points:
- review tab
- place detail after analysis

Must include:
- uploaded photo
- candidate cards
- suggested name
- confidence hint
- category selector
- accept, edit, merge, reject controls

Primary actions:
- confirm reviewed set
- save partial progress

### 3.6 Item detail

Entry points:
- search result
- place item list
- category list

Must include:
- item display name
- aliases if helpful
- current place path
- last verified timestamp
- last moved timestamp if available
- related latest place photo

Primary actions:
- move item
- rename item
- change category
- soft delete item

### 3.7 Move item

Must include:
- current location
- recent places
- place search
- place hierarchy picker
- confirm move

### 3.8 Category list

Entry points:
- browse tab

Must include:
- category names
- item counts

### 3.9 Capture history or photo detail

Entry points:
- place detail

Must include:
- capture date
- capture status
- photo preview
- delete photo action

## 4. Screen hierarchy

```text
Home
  -> Search Results
    -> Item Detail
      -> Move Item
    -> Place Detail

Places
  -> Place Detail
    -> Place Create/Edit
    -> Capture Confirm
    -> Review Detail
    -> Capture History/Photo Detail

Review
  -> Review Detail

Browse
  -> Category List
    -> Item Detail
      -> Move Item

Settings
```

## 5. Required badges and status indicators

### Place-level indicators

- `analysis pending`
- `review needed`
- `warning`
- `stale`

### Item-level indicators

- `warning`
- `stale`

### Review-level indicators

- `high confidence`
- `needs attention`
- `unfinished`

## 6. Mobile interaction priorities

- make search reachable within one tap from launch
- keep place drilling readable on narrow screens
- keep review interactions large and low-friction
- minimize typing during capture review
- avoid deep modal stacks

## 7. Deferred screens

Do not design as MVP blockers:
- chat-first assistant screen
- analytics dashboard
- advanced member permissions
- push notification inbox
- export management

## 8. Recommended next artifact

- `architecture/system-design.md`
