import type { CaptureAnalysisAdapter, CaptureAnalysisCandidate, CaptureAnalysisInput } from './adapter.js'

function pickStarterCandidates(input: CaptureAnalysisInput): CaptureAnalysisCandidate[] {
  const path = input.photoStoragePath.toLowerCase()

  if (path.includes('cable') || path.includes('charger')) {
    return [
      {
        candidateLabel: 'charging cable',
        normalizedName: 'charging cable',
        aliases: ['usb cable', 'phone charger cable'],
        category: 'charging',
        confidence: 0.86,
      },
      {
        candidateLabel: 'power adapter',
        normalizedName: 'power adapter',
        aliases: ['charger brick'],
        category: 'charging',
        confidence: 0.73,
      },
    ]
  }

  return [
    {
      candidateLabel: 'scissors',
      normalizedName: 'scissors',
      aliases: ['craft scissors'],
      category: 'stationery',
      confidence: 0.68,
    },
    {
      candidateLabel: 'glue stick',
      normalizedName: 'glue stick',
      aliases: ['school glue'],
      category: 'craft-supplies',
      confidence: 0.62,
    },
  ]
}

export const stubAnalysisAdapter: CaptureAnalysisAdapter = {
  async analyze(input: CaptureAnalysisInput) {
    return pickStarterCandidates(input)
  },
}
