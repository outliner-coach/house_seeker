import { createContext } from 'react'
import type { HouseholdMemberRecord, HouseholdRecord } from '@house-seeker/shared'

type BootstrapMode = 'unavailable' | 'existing' | 'created'

export type HouseholdContextValue = {
  bootstrapMode: BootstrapMode
  error: string | null
  household: HouseholdRecord | null
  householdId: string | null
  loading: boolean
  member: HouseholdMemberRecord | null
  refresh: () => void
}

export const HouseholdContext = createContext<HouseholdContextValue | null>(null)
