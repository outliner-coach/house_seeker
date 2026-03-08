import type { CaptureAnalysisInput } from '../analysis/adapter.js'
import { stubAnalysisAdapter } from '../analysis/stub-analyzer.js'

export async function createStubCaptureAnalysisJob(input: CaptureAnalysisInput) {
  const candidates = await stubAnalysisAdapter.analyze(input)

  return {
    captureId: input.captureId,
    householdId: input.householdId,
    placeId: input.placeId,
    candidates,
    generatedAt: new Date().toISOString(),
  }
}

export { stubAnalysisAdapter }
