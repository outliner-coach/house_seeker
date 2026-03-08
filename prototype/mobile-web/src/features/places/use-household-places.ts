import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activitySchema, placeSchema, type PlaceRecord, type PlaceType } from '@house-seeker/shared'
import { collection, doc, getDocs, orderBy, query, writeBatch } from 'firebase/firestore'
import { useAuth } from '@/features/auth/use-auth'
import { useHousehold } from '@/features/household/use-household'
import { getFirebaseServices } from '@/lib/firebase/client'
import { createLocalPlace, listLocalPlaces } from '@/lib/local/local-store'

type CreatePlaceInput = {
  name: string
  parentPlaceId: string | null
  type: PlaceType
}

function placesQueryKey(householdId: string | null) {
  return ['households', householdId, 'places'] as const
}

function normalizePlaceName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function useHouseholdPlaces() {
  const { appConfigured, user } = useAuth()
  const { householdId } = useHousehold()
  const queryClient = useQueryClient()
  const services = getFirebaseServices()

  const places = useQuery({
    queryKey: placesQueryKey(householdId),
    enabled: Boolean(appConfigured && householdId),
    queryFn: async () => {
      if (!householdId) {
        return [] as PlaceRecord[]
      }

      if (services.localMode) {
        return listLocalPlaces()
      }

      if (!services.db) {
        return [] as PlaceRecord[]
      }

      const placesRef = collection(services.db, 'households', householdId, 'places')
      const placesSnapshot = await getDocs(query(placesRef, orderBy('placePath')))

      return placesSnapshot.docs.map((snapshot) =>
        placeSchema.parse({
          id: snapshot.id,
          ...snapshot.data(),
        }),
      )
    },
    staleTime: 30_000,
  })

  const createPlace = useMutation({
    mutationFn: async (input: CreatePlaceInput) => {
      if (!householdId || !user) {
        throw new Error('error.place.creationUnavailable')
      }

      const name = input.name.trim()

      if (!name) {
        throw new Error('error.place.nameRequired')
      }

      const parentPlace = input.parentPlaceId
        ? (places.data ?? []).find((place) => place.id === input.parentPlaceId) ?? null
        : null

      if (input.parentPlaceId && !parentPlace) {
        throw new Error('error.place.parentMissing')
      }

      if (services.localMode) {
        return createLocalPlace({
          householdId,
          name,
          parentPlaceId: parentPlace?.id ?? null,
          places: places.data ?? [],
          type: input.type,
          user,
        })
      }

      if (!services.db) {
        throw new Error('error.place.creationUnavailable')
      }

      const now = new Date().toISOString()
      const placeRef = doc(collection(services.db, 'households', householdId, 'places'))
      const activityRef = doc(collection(services.db, 'households', householdId, 'activities'))
      const depth = parentPlace ? parentPlace.depth + 1 : 0
      const placePath = parentPlace ? `${parentPlace.placePath} > ${name}` : name

      const nextPlace = placeSchema.parse({
        id: placeRef.id,
        householdId,
        name,
        normalizedName: normalizePlaceName(name),
        type: input.type,
        parentPlaceId: parentPlace?.id ?? null,
        placePath,
        depth,
        status: 'empty',
        latestCaptureId: null,
        lastVerifiedAt: null,
        freshnessStatus: 'fresh',
        createdAt: now,
        createdByUserId: user.uid,
        updatedAt: now,
        updatedByUserId: user.uid,
      })

      const activity = activitySchema.parse({
        id: activityRef.id,
        householdId,
        type: 'place_created',
        actorUserId: user.uid,
        subjectType: 'place',
        subjectId: nextPlace.id,
        summary: `Created place ${nextPlace.placePath}`,
        createdAt: now,
      })

      const batch = writeBatch(services.db)
      batch.set(placeRef, nextPlace)
      batch.set(activityRef, activity)
      await batch.commit()

      return nextPlace
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: placesQueryKey(householdId),
      })
    },
  })

  return {
    createPlace: createPlace.mutateAsync,
    createPlaceError: createPlace.error instanceof Error ? createPlace.error.message : null,
    isCreatingPlace: createPlace.isPending,
    isShellMode: !appConfigured || (!services.localMode && !services.db) || !householdId,
    places: places.data ?? [],
    placesError: places.error instanceof Error ? places.error.message : null,
    placesLoading: places.isLoading,
  }
}
