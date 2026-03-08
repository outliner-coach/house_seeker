import {
  activitySchema,
  captureSchema,
  householdMemberSchema,
  householdSchema,
  placeSchema,
  type ActivityRecord,
  type CaptureRecord,
  type HouseholdMemberRecord,
  type HouseholdRecord,
  type PlaceRecord,
  type PlaceType,
} from '@house-seeker/shared'
import type { AppUser } from '@/features/auth/auth-context-store'

type LocalState = {
  activities: ActivityRecord[]
  captures: CaptureRecord[]
  household: HouseholdRecord | null
  member: HouseholdMemberRecord | null
  places: PlaceRecord[]
}

const storageKey = 'house-seeker.local-state.v1'

function emptyState(): LocalState {
  return {
    activities: [],
    captures: [],
    household: null,
    member: null,
    places: [],
  }
}

function ensureBrowser() {
  if (typeof window === 'undefined') {
    throw new Error('Local mode requires a browser environment.')
  }
}

function readState(): LocalState {
  ensureBrowser()
  const raw = window.localStorage.getItem(storageKey)

  if (!raw) {
    return emptyState()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocalState>

    return {
      activities: Array.isArray(parsed.activities)
        ? parsed.activities.map((activity) => activitySchema.parse(activity))
        : [],
      captures: Array.isArray(parsed.captures)
        ? parsed.captures.map((capture) => captureSchema.parse(capture))
        : [],
      household: parsed.household ? householdSchema.parse(parsed.household) : null,
      member: parsed.member ? householdMemberSchema.parse(parsed.member) : null,
      places: Array.isArray(parsed.places)
        ? parsed.places.map((place) => placeSchema.parse(place))
        : [],
    }
  } catch {
    return emptyState()
  }
}

function writeState(state: LocalState) {
  ensureBrowser()
  window.localStorage.setItem(storageKey, JSON.stringify(state))
}

function nextId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export function clearLocalSessionUser() {
  ensureBrowser()
  window.localStorage.removeItem('house-seeker.local-user')
}

export function readLocalSessionUser(): AppUser | null {
  ensureBrowser()
  const raw = window.localStorage.getItem('house-seeker.local-user')

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AppUser
  } catch {
    return null
  }
}

export function writeLocalSessionUser(user: AppUser) {
  ensureBrowser()
  window.localStorage.setItem('house-seeker.local-user', JSON.stringify(user))
}

export function ensureLocalHousehold(user: AppUser) {
  const state = readState()

  if (state.household && state.member?.userId === user.uid) {
    return {
      household: state.household,
      householdId: state.household.id,
      member: state.member,
    }
  }

  const now = new Date().toISOString()
  const household = householdSchema.parse({
    id: nextId('household'),
    name: user.displayName ? `${user.displayName} household` : 'Local household',
    createdAt: now,
    createdByUserId: user.uid,
    updatedAt: now,
    updatedByUserId: user.uid,
  })
  const member = householdMemberSchema.parse({
    id: user.uid,
    householdId: household.id,
    userId: user.uid,
    role: 'owner',
    status: 'active',
    displayName: user.displayName,
    email: user.email,
    joinedAt: now,
    lastSeenAt: now,
  })

  const nextState: LocalState = {
    ...emptyState(),
    household,
    member,
  }
  writeState(nextState)

  return {
    household,
    householdId: household.id,
    member,
  }
}

export function listLocalPlaces() {
  return readState().places.sort((left, right) => left.placePath.localeCompare(right.placePath))
}

export function createLocalPlace(input: {
  householdId: string
  name: string
  parentPlaceId: string | null
  places: PlaceRecord[]
  type: PlaceType
  user: AppUser
}) {
  const state = readState()
  const now = new Date().toISOString()
  const parentPlace = input.parentPlaceId
    ? input.places.find((place) => place.id === input.parentPlaceId) ?? null
    : null
  const place = placeSchema.parse({
    id: nextId('place'),
    householdId: input.householdId,
    name: input.name,
    normalizedName: input.name.trim().toLowerCase().replace(/\s+/g, ' '),
    type: input.type,
    parentPlaceId: parentPlace?.id ?? null,
    placePath: parentPlace ? `${parentPlace.placePath} > ${input.name}` : input.name,
    depth: parentPlace ? parentPlace.depth + 1 : 0,
    status: 'empty',
    latestCaptureId: null,
    lastVerifiedAt: null,
    freshnessStatus: 'fresh',
    createdAt: now,
    createdByUserId: input.user.uid,
    updatedAt: now,
    updatedByUserId: input.user.uid,
  })
  const activity = activitySchema.parse({
    id: nextId('activity'),
    householdId: input.householdId,
    type: 'place_created',
    actorUserId: input.user.uid,
    subjectType: 'place',
    subjectId: place.id,
    summary: `Created place ${place.placePath}`,
    createdAt: now,
  })

  writeState({
    ...state,
    activities: [activity, ...state.activities],
    places: [...state.places, place].sort((left, right) => left.placePath.localeCompare(right.placePath)),
  })

  return place
}

export function listLocalCaptures(placeId?: string | null) {
  const captures = readState().captures
    .slice()
    .sort((left, right) => right.capturedAt.localeCompare(left.capturedAt))

  if (!placeId) {
    return captures
  }

  return captures.filter((capture) => capture.placeId === placeId)
}

export function createLocalCapture(input: {
  fileName: string
  householdId: string
  place: PlaceRecord
  user: AppUser
}) {
  const state = readState()
  const now = new Date().toISOString()
  const capture = captureSchema.parse({
    id: nextId('capture'),
    householdId: input.householdId,
    placeId: input.place.id,
    photoStoragePath: `local://captures/${input.place.id}/${input.fileName}`,
    photoDeleted: false,
    status: 'analysis_pending',
    analysisRequestedAt: now,
    analysisCompletedAt: null,
    reviewCompletedAt: null,
    capturedAt: now,
    capturedByUserId: input.user.uid,
  })
  const activity = activitySchema.parse({
    id: nextId('activity'),
    householdId: input.householdId,
    type: 'capture_uploaded',
    actorUserId: input.user.uid,
    subjectType: 'capture',
    subjectId: capture.id,
    summary: `Uploaded capture for ${input.place.placePath}`,
    createdAt: now,
  })
  const places = state.places.map((place) =>
    place.id === input.place.id
      ? placeSchema.parse({
          ...place,
          latestCaptureId: capture.id,
          status: 'analysis_pending',
          updatedAt: now,
          updatedByUserId: input.user.uid,
        })
      : place,
  )

  writeState({
    ...state,
    activities: [activity, ...state.activities],
    captures: [capture, ...state.captures],
    places,
  })

  return capture
}
