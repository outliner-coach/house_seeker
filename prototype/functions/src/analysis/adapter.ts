export type CaptureAnalysisInput = {
  captureId: string
  householdId: string
  placeId: string
  photoStoragePath: string
}

export type CaptureAnalysisCandidate = {
  candidateLabel: string
  normalizedName: string
  aliases: string[]
  category: string
  confidence: number
}

export type CaptureAnalysisAdapter = {
  analyze: (input: CaptureAnalysisInput) => Promise<CaptureAnalysisCandidate[]>
}
