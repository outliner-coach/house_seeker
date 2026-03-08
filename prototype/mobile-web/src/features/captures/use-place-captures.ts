import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activitySchema, captureSchema, placeSchema, type CaptureRecord, type PlaceRecord } from '@house-seeker/shared'
import { collection, doc, getDocs, orderBy, query, writeBatch } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import { useAuth } from '@/features/auth/use-auth'
import { useHousehold } from '@/features/household/use-household'
import { getFirebaseServices } from '@/lib/firebase/client'
import { createLocalCapture, listLocalCaptures } from '@/lib/local/local-store'

function captureQueryKey(householdId: string | null, placeId: string | null) {
  return ['households', householdId, 'places', placeId, 'captures'] as const
}

function placesQueryKey(householdId: string | null) {
  return ['households', householdId, 'places'] as const
}

function inferFileExtension(file: File) {
  const nameParts = file.name.split('.')

  if (nameParts.length > 1) {
    return nameParts.at(-1)?.toLowerCase() ?? 'jpg'
  }

  const contentType = file.type.split('/')[1]
  return contentType || 'jpg'
}

export function usePlaceCaptures(place: PlaceRecord | null) {
  const { appConfigured, user } = useAuth()
  const { householdId } = useHousehold()
  const queryClient = useQueryClient()
  const services = getFirebaseServices()

  const captures = useQuery({
    queryKey: captureQueryKey(householdId, place?.id ?? null),
    enabled: Boolean(appConfigured && householdId && place),
    queryFn: async () => {
      if (!householdId || !place) {
        return [] as CaptureRecord[]
      }

      if (services.localMode) {
        return listLocalCaptures(place.id)
      }

      if (!services.db) {
        return [] as CaptureRecord[]
      }

      const capturesRef = collection(services.db, 'households', householdId, 'captures')
      const capturesSnapshot = await getDocs(query(capturesRef, orderBy('capturedAt', 'desc')))

      return capturesSnapshot.docs
        .map((snapshot) =>
          captureSchema.parse({
            id: snapshot.id,
            ...snapshot.data(),
          }),
        )
        .filter((capture) => capture.placeId === place.id)
    },
    staleTime: 30_000,
  })

  const uploadCapture = useMutation({
    mutationFn: async (file: File) => {
      if (!householdId || !user || !place) {
        throw new Error('Capture upload is unavailable.')
      }

      if (services.localMode) {
        return createLocalCapture({
          fileName: file.name,
          householdId,
          place,
          user,
        })
      }

      if (!services.db || !services.storage) {
        throw new Error('Capture upload is unavailable.')
      }

      const now = new Date().toISOString()
      const captureRef = doc(collection(services.db, 'households', householdId, 'captures'))
      const activityRef = doc(collection(services.db, 'households', householdId, 'activities'))
      const fileExtension = inferFileExtension(file)
      const photoStoragePath = `households/${householdId}/places/${place.id}/captures/${captureRef.id}/original.${fileExtension}`
      const photoRef = ref(services.storage, photoStoragePath)

      await uploadBytes(photoRef, file, {
        contentType: file.type || undefined,
      })

      const capture = captureSchema.parse({
        id: captureRef.id,
        householdId,
        placeId: place.id,
        photoStoragePath,
        photoDeleted: false,
        status: 'analysis_pending',
        analysisRequestedAt: now,
        analysisCompletedAt: null,
        reviewCompletedAt: null,
        capturedAt: now,
        capturedByUserId: user.uid,
      })

      const nextPlace = placeSchema.parse({
        ...place,
        latestCaptureId: capture.id,
        status: 'analysis_pending',
        updatedAt: now,
        updatedByUserId: user.uid,
      })

      const activity = activitySchema.parse({
        id: activityRef.id,
        householdId,
        type: 'capture_uploaded',
        actorUserId: user.uid,
        subjectType: 'capture',
        subjectId: capture.id,
        summary: `Uploaded capture for ${place.placePath}`,
        createdAt: now,
      })

      const batch = writeBatch(services.db)
      batch.set(captureRef, capture)
      batch.set(doc(services.db, 'households', householdId, 'places', place.id), nextPlace)
      batch.set(activityRef, activity)
      await batch.commit()

      return capture
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: captureQueryKey(householdId, place?.id ?? null),
        }),
        queryClient.invalidateQueries({
          queryKey: placesQueryKey(householdId),
        }),
      ])
    },
  })

  return {
    captures: captures.data ?? [],
    capturesError: captures.error instanceof Error ? captures.error.message : null,
    capturesLoading: captures.isLoading,
    isUploadingCapture: uploadCapture.isPending,
    uploadCapture: uploadCapture.mutateAsync,
    uploadCaptureError: uploadCapture.error instanceof Error ? uploadCapture.error.message : null,
  }
}
