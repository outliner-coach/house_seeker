export const freshnessStatusValues = ['fresh', 'warning', 'stale'] as const
export const placeTypeValues = ['fixed', 'container'] as const
export const placeStatusValues = [
  'empty',
  'active',
  'analysis_pending',
  'review_needed',
  'warning',
  'stale',
  'soft_deleted',
] as const
export const captureStatusValues = [
  'uploaded',
  'analysis_pending',
  'analysis_failed',
  'review_needed',
  'confirmed',
  'photo_deleted',
] as const
export const itemCandidateStatusValues = [
  'pending_review',
  'accepted',
  'edited',
  'merged',
  'rejected',
] as const
export const itemStatusValues = ['confirmed', 'warning', 'stale', 'soft_deleted'] as const
export const householdMemberRoleValues = ['owner', 'editor'] as const
export const householdMemberStatusValues = ['active', 'removed'] as const

export type FreshnessStatus = (typeof freshnessStatusValues)[number]
export type PlaceType = (typeof placeTypeValues)[number]
export type PlaceStatus = (typeof placeStatusValues)[number]
export type CaptureStatus = (typeof captureStatusValues)[number]
export type ItemCandidateStatus = (typeof itemCandidateStatusValues)[number]
export type ItemStatus = (typeof itemStatusValues)[number]
export type HouseholdMemberRole = (typeof householdMemberRoleValues)[number]
export type HouseholdMemberStatus = (typeof householdMemberStatusValues)[number]
