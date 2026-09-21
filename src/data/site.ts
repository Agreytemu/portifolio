import type { SocialLink } from '../types'

interface SiteConfig {
  name: string
  role: string
  tagline: string
  location: string
  /** Shown in the "Now" panel next to the profile. */
  nowFocus: string[]
  availability: string
  statusText: string
  focus: string[]
  about: string[]
  /** Fill these in to switch the placeholder links on. Leave empty until they are real. */
  githubUsername: string
  linkedinUrl: string
  email: string
  /** Path or URL of a profile photo, e.g. "/avatar.jpg" (put the file in /public). Empty shows a monogram. */
  avatarSrc: string
}

export const site: SiteConfig = {
  name: 'Agrey Temu',
  role: 'Full-Stack Developer',
  tagline: 'Building commerce applications with React, APIs, PostgreSQL, payment integrations, and backend services.',
  location: 'Tanzania',
  nowFocus: ['Commerce Applications', 'Financial Systems', 'Full-Stack Architecture'],
  availability: 'Software projects / collaborations',
  statusText: 'Building software',
  focus: ['Commerce Applications', 'Fintech Systems', 'Web Applications', 'APIs', 'Developer Tools'],
  about: [
    'Agrey Temu is a Tanzanian software developer focused on building practical digital products.',
    'He works across frontend, backend, databases, APIs, authentication, payments, and deployment.',
    'His current focus is building commerce and financial software that solves real-world problems.',
  ],
  githubUsername: '',
  linkedinUrl: '',
  email: '',
  avatarSrc: '',
}

export function getSocialLinks(): SocialLink[] {
  return [
    {
      id: 'github',
      label: 'GitHub',
      href: site.githubUsername ? `https://github.com/${site.githubUsername}` : undefined,
      hint: 'GitHub link not added yet',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: site.linkedinUrl || undefined,
      hint: 'LinkedIn link not added yet',
    },
    {
      id: 'email',
      label: 'Email',
      href: site.email ? `mailto:${site.email}` : undefined,
      hint: 'Email address not added yet',
    },
  ]
}
