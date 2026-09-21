import type { NavItem } from '../types'

/** Every section id on the page, in DOM order. Used for scroll tracking. */
export const sectionIds = [
  'overview',
  'about',
  'featured',
  'projects',
  'activity',
  'stack',
  'build',
  'journey',
  'terminal',
  'contact',
] as const

export const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview', sections: ['overview', 'about'] },
  { id: 'projects', label: 'Projects', href: '#featured', sections: ['featured', 'projects'] },
  { id: 'experience', label: 'Experience', href: '#journey', sections: ['build', 'journey', 'terminal'] },
  { id: 'stack', label: 'Stack', href: '#stack', sections: ['stack'] },
  { id: 'activity', label: 'Activity', href: '#activity', sections: ['activity'] },
]
