import type { FreshnessStatus, PlaceStatus } from '@house-seeker/shared'

export type PlaceSummary = {
  id: string
  name: string
  path: string
  status: PlaceStatus
  freshness: FreshnessStatus
}

export type PendingReview = {
  id: string
  placePath: string
  capturedAt: string
  lowConfidenceCount: number
}

export type SearchPreview = {
  itemName: string
  placePath: string
  freshness: FreshnessStatus
  lastVerifiedAt: string
}

export const placeSummaries: PlaceSummary[] = [
  {
    id: 'kids-art-box',
    name: 'Blue Art Box',
    path: 'Kids Room > White Cabinet > Blue Art Box',
    status: 'active',
    freshness: 'fresh',
  },
  {
    id: 'kitchen-drawer',
    name: 'Utility Drawer',
    path: 'Kitchen > Utility Drawer',
    status: 'review_needed',
    freshness: 'warning',
  },
  {
    id: 'living-cable-box',
    name: 'Black Cable Box',
    path: 'Living Room > TV Cabinet > Black Cable Box',
    status: 'stale',
    freshness: 'stale',
  },
]

export const pendingReviews: PendingReview[] = [
  {
    id: 'capture-kitchen-drawer-1',
    placePath: 'Kitchen > Utility Drawer',
    capturedAt: '2026-03-08 18:10',
    lowConfidenceCount: 2,
  },
]

export const searchPreviewResults: SearchPreview[] = [
  {
    itemName: 'Glue Gun',
    placePath: 'Kids Room > White Cabinet > Blue Art Box',
    freshness: 'fresh',
    lastVerifiedAt: '2026-03-08',
  },
  {
    itemName: 'Phone Charger',
    placePath: 'Living Room > TV Cabinet > Black Cable Box',
    freshness: 'warning',
    lastVerifiedAt: '2026-02-10',
  },
]
