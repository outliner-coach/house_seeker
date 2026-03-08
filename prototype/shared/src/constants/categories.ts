export const starterCategories = [
  'stationery',
  'charging',
  'documents',
  'craft-supplies',
  'tools',
  'school-supplies',
] as const

export type StarterCategory = (typeof starterCategories)[number]
