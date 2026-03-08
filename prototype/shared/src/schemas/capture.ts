import { z } from 'zod'
import { captureStatusValues, itemCandidateStatusValues } from '../constants/status'

export const captureSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  placeId: z.string(),
  photoStoragePath: z.string(),
  photoDeleted: z.boolean(),
  status: z.enum(captureStatusValues),
  analysisRequestedAt: z.string().nullable(),
  analysisCompletedAt: z.string().nullable(),
  reviewCompletedAt: z.string().nullable(),
  capturedAt: z.string(),
  capturedByUserId: z.string(),
})

export const itemCandidateSchema = z.object({
  id: z.string(),
  householdId: z.string(),
  captureId: z.string(),
  placeId: z.string(),
  candidateLabel: z.string(),
  normalizedName: z.string(),
  aliases: z.array(z.string()),
  category: z.string(),
  confidence: z.number().min(0).max(1),
  regionHint: z
    .object({
      left: z.number(),
      top: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .nullable(),
  status: z.enum(itemCandidateStatusValues),
  matchedItemId: z.string().nullable(),
  createdAt: z.string(),
})

export type CaptureRecord = z.infer<typeof captureSchema>
export type ItemCandidateRecord = z.infer<typeof itemCandidateSchema>
