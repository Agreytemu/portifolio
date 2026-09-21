import type { BuildLogEntry } from '../types'

/**
 * Current engineering work, grouped by project. Deliberately undated: add a date field only when you
 * have real ones. projectSlug must match a slug in data/projects.ts.
 */
export const buildLog: BuildLogEntry[] = [
  { id: 'vicoba-payments', projectSlug: 'vicoba-digital', topic: 'Payment architecture' },
  { id: 'vicoba-contributions', projectSlug: 'vicoba-digital', topic: 'Contribution workflow' },
  { id: 'agreyflix-backend', projectSlug: 'agreyflix', topic: 'Backend integration' },
  { id: 'remori-architecture', projectSlug: 'remori', topic: 'System architecture' },
]
