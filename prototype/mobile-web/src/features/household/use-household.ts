import { useContext } from 'react'
import { HouseholdContext } from './household-context-store'

export function useHousehold() {
  const value = useContext(HouseholdContext)

  if (!value) {
    throw new Error('useHousehold must be used within HouseholdProvider.')
  }

  return value
}
