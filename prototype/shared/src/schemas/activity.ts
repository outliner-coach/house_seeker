import { z } from 'zod'

export const activitySchema = z.object({
  id: z.string(),
  householdId: z.string(),
  type: z.string(),
  actorUserId: z.string(),
  subjectType: z.string(),
  subjectId: z.string(),
  summary: z.string(),
  createdAt: z.string(),
})

export type ActivityRecord = z.infer<typeof activitySchema>
