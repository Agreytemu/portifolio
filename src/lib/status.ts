import type { ProjectStatus, Tone } from '../types'

export const statusMeta: Record<ProjectStatus, { label: string; tone: Tone; description: string }> = {
  'in-development': {
    label: 'In development',
    tone: 'warn',
    description: 'Actively being built. The repository and demo are private for now.',
  },
  concept: {
    label: 'Concept',
    tone: 'info',
    description: 'An early-stage concept that is still being explored. Nothing is public yet.',
  },
  'coming-soon': {
    label: 'Coming soon',
    tone: 'neutral',
    description: 'Public details, repository and demo links are coming soon.',
  },
}
