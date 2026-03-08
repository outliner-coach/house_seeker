import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { AuthProvider } from '@/features/auth/auth-context'
import { HouseholdProvider } from '@/features/household/household-context'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HouseholdProvider>{children}</HouseholdProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
