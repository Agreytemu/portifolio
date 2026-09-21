import type { JourneyItem } from '../types'

/** Project-based only. No employers, titles, or dates are listed on purpose. */
export const journey: JourneyItem[] = [
  {
    id: 'software-development',
    title: 'Software Development',
    description: 'Building web applications and digital products.',
  },
  {
    id: 'commerce-systems',
    title: 'Commerce Systems',
    description: 'Working on commerce and financial application concepts.',
  },
  {
    id: 'full-stack',
    title: 'Full-Stack Development',
    description: 'Frontend, backend, databases, and APIs.',
  },
  {
    id: 'current-focus',
    title: 'Current Focus',
    description: 'Building practical commerce software and developer tools.',
    current: true,
  },
]
