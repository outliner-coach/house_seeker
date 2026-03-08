import { z } from 'zod'
import { freshnessStatusValues, itemStatusValues } from '../constants/status'

export const itemSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  displayName: z.string().min(1),
  normalizedName: z.string(),
  aliases: z.array(z.string()),
  searchTokens: z.array(z.string()),
  categoryId: z.string(),
  status: z.enum(itemStatusValues),
  currentPlaceId: z.string(),
  currentPlacePath: z.string(),
  lastVerifiedAt: z.string().nullable(),
  lastMovedAt: z.string().nullable(),
  freshnessStatus: z.enum(freshnessStatusValues),
  createdAt: z.string(),
  createdByUserId: z.string(),
  updatedAt: z.string(),
  updatedByUserId: z.string(),
})

export const itemLocationSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  itemId: z.string(),
  placeId: z.string(),
  placePath: z.string(),
  source: z.string(),
  effectiveAt: z.string(),
  createdByUserId: z.string(),
  isCurrent: z.boolean(),
})

export type ItemRecord = z.infer<typeof itemSchema>
export type ItemLocationRecord = z.infer<typeof itemLocationSchema>
