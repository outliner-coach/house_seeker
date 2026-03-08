import { z } from 'zod'
import { freshnessStatusValues, placeStatusValues, placeTypeValues } from '../constants/status'

export const placeSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  name: z.string().min(1),
  normalizedName: z.string(),
  type: z.enum(placeTypeValues),
  parentPlaceId: z.string().nullable(),
  placePath: z.string(),
  depth: z.number().int().min(0),
  status: z.enum(placeStatusValues),
  latestCaptureId: z.string().nullable(),
  lastVerifiedAt: z.string().nullable(),
  freshnessStatus: z.enum(freshnessStatusValues),
  createdAt: z.string(),
  createdByUserId: z.string(),
  updatedAt: z.string(),
  updatedByUserId: z.string(),
})

export type PlaceRecord = z.infer<typeof placeSchema>
