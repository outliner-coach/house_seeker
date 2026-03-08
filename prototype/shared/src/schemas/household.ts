import { z } from 'zod'
import {
  householdMemberRoleValues,
  householdMemberStatusValues,
} from '../constants/status'

export const householdSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string(),
  createdByUserId: z.string(),
  updatedAt: z.string(),
  updatedByUserId: z.string(),
})

export const householdMemberSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  userId: z.string(),
  role: z.enum(householdMemberRoleValues),
  status: z.enum(householdMemberStatusValues),
  displayName: z.string().nullable(),
  email: z.string().email().nullable(),
  joinedAt: z.string(),
  lastSeenAt: z.string().nullable(),
})

export type HouseholdRecord = z.infer<typeof householdSchema>
export type HouseholdMemberRecord = z.infer<typeof householdMemberSchema>
