import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  limit,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  householdMemberSchema,
  householdSchema,
} from '@house-seeker/shared'
import { useAuth } from '@/features/auth/use-auth'
import { getFirebaseServices } from '@/lib/firebase/client'
import { ensureLocalHousehold } from '@/lib/local/local-store'
import { HouseholdContext, type HouseholdContextValue } from './household-context-store'

function normalizeHouseholdError(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    switch (error.code) {
      case 'permission-denied':
        return 'error.firestore.permissionDenied'
      case 'unauthenticated':
        return 'error.firestore.unauthenticated'
      default:
        break
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'error.household.syncFailed'
}

function buildDefaultHouseholdName(displayName: string | null, email: string | null) {
  if (displayName) {
    return `${displayName} household`
  }

  if (email) {
    const localPart = email.split('@')[0]
    return `${localPart} household`
  }

  return 'My household'
}

async function createHouseholdForUser(
  userId: string,
  displayName: string | null,
  email: string | null,
) {
  const services = getFirebaseServices()

  if (!services.db) {
    throw new Error('error.household.firestoreUnavailable')
  }

  const now = new Date().toISOString()
  const householdRef = doc(collection(services.db, 'households'))
  const memberRef = doc(collection(householdRef, 'members'), userId)

  const household = householdSchema.parse({
    id: householdRef.id,
    name: buildDefaultHouseholdName(displayName, email),
    createdAt: now,
    createdByUserId: userId,
    updatedAt: now,
    updatedByUserId: userId,
  })

  const member = householdMemberSchema.parse({
    id: userId,
    householdId: householdRef.id,
    userId,
    role: 'owner',
    status: 'active',
    displayName,
    email,
    joinedAt: now,
    lastSeenAt: now,
  })

  const batch = writeBatch(services.db)
  batch.set(householdRef, household)
  batch.set(memberRef, member)
  await batch.commit()

  return {
    household,
    householdId: householdRef.id,
    member,
  }
}

export function HouseholdProvider({ children }: PropsWithChildren) {
  const { appConfigured, user } = useAuth()
  const services = useMemo(() => getFirebaseServices(), [])
  const [refreshToken, setRefreshToken] = useState(0)
  const [state, setState] = useState<HouseholdContextValue>({
    bootstrapMode: 'unavailable',
    error: null,
    household: null,
    householdId: null,
    loading: false,
    member: null,
    refresh: () => setRefreshToken((value) => value + 1),
  })

  useEffect(() => {
    async function syncHousehold() {
      if (!user || !appConfigured || !services.db) {
        if (services.localMode && user) {
          const localHousehold = ensureLocalHousehold(user)

          setState((previous) => ({
            ...previous,
            bootstrapMode: 'created',
            error: null,
            household: localHousehold.household,
            householdId: localHousehold.householdId,
            loading: false,
            member: localHousehold.member,
          }))
          return
        }

        setState((previous) => ({
          ...previous,
          bootstrapMode: 'unavailable',
          error: null,
          household: null,
          householdId: null,
          loading: false,
          member: null,
        }))
        return
      }

      setState((previous) => ({
        ...previous,
        error: null,
        loading: true,
      }))

      try {
        const membershipQuery = query(
          collectionGroup(services.db, 'members'),
          where('userId', '==', user.uid),
          limit(1),
        )
        const membershipSnapshot = await getDocs(membershipQuery)

        if (membershipSnapshot.empty) {
          const created = await createHouseholdForUser(user.uid, user.displayName, user.email)

          setState((previous) => ({
            ...previous,
            bootstrapMode: 'created',
            error: null,
            household: created.household,
            householdId: created.householdId,
            loading: false,
            member: created.member,
          }))
          return
        }

        const memberDocument = membershipSnapshot.docs[0]
        const householdId = memberDocument.ref.parent.parent?.id

        if (!householdId) {
          throw new Error('error.household.missingPath')
        }

        const parsedMember = householdMemberSchema.safeParse({
          id: memberDocument.id,
          householdId,
          ...memberDocument.data(),
        })

        if (!parsedMember.success) {
          throw new Error('error.household.invalidMember')
        }

        setState((previous) => ({
          ...previous,
          bootstrapMode: 'existing',
          error: null,
          household: null,
          householdId,
          loading: false,
          member: parsedMember.data,
        }))
      } catch (error) {
        setState((previous) => ({
          ...previous,
          bootstrapMode: 'unavailable',
          error: normalizeHouseholdError(error),
          household: null,
          householdId: null,
          loading: false,
          member: null,
        }))
      }
    }

    void syncHousehold()
  }, [appConfigured, refreshToken, services.db, services.localMode, user])

  const value = useMemo(
    () => ({
      ...state,
      refresh: () => setRefreshToken((current) => current + 1),
    }),
    [state],
  )

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>
}
