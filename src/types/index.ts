export type Tone = 'accent' | 'warn' | 'info' | 'neutral'

export type ProjectStatus = 'in-development' | 'concept' | 'coming-soon'

export interface ProjectLanguage {
  name: string
  color: string
}

export interface ArchitectureNode {
  layer: string
  label: string
  detail: string
}

export interface Project {
  slug: string
  /** Repository-style name, shown in monospace. */
  name: string
  title: string
  /** One-line description used on repository cards. */
  summary: string
  /** Longer description used on the featured panel and in the modal. */
  description: string
  language: ProjectLanguage
  /** Short stack shown on repository cards. */
  stack: string[]
  /** Complete technology list shown in the featured panel and modal. */
  technologies: string[]
  status: ProjectStatus
  featured?: boolean
  /** Only set when a real repository exists. Never invent one. */
  repoUrl?: string
  /** Only set when a real public demo exists. Never invent one. */
  liveUrl?: string
  /** Shown when there is no liveUrl. */
  liveNote: string
  stars?: number
  forks?: number
  topics?: string[]
  languageNames?: string[]
  createdAt?: string
  updatedAt?: string
  latestActivity?: string
  repoStatus?: 'public' | 'private' | 'archived'
  isFork?: boolean
  visibility?: string
  owner?: string
  defaultBranch?: string
  homepage?: string
  latestCommit?: {
    sha: string
    message: string
    date?: string
  }
  /** Short classification shown as card metadata, e.g. "Commerce / Fintech". */
  category: string
  problem: string
  solution: string
  features: string[]
  architecture: ArchitectureNode[]
  /** "flow" draws the architecture as a connected request path instead of grouped layers. */
  architectureView?: 'flow'
}

export interface StackGroup {
  id: string
  label: string
  /** One-line description of what the group is for. */
  purpose: string
  items: string[]
  highlight?: string[]
}

export interface Principle {
  id: string
  title: string
  body: string
  outputs: string[]
}

export interface JourneyItem {
  id: string
  title: string
  description: string
  current?: boolean
}

export type ActivityLevel = 0 | 1 | 2 | 3 | 4

export interface ActivityDay {
  /** ISO date, YYYY-MM-DD (UTC). */
  date: string
  level: ActivityLevel
}

export interface ActivityData {
  /** Columns of the graph, Sunday first. */
  weeks: ActivityDay[][]
  source: 'demo' | 'github'
  title: string
  badge: string
  note: string
}

export interface ProfileStats {
  projects: number
  technologies: number
  /** null when no repositories are linked yet. */
  repositories: number | null
  inDevelopment: number
}

export interface PortfolioData {
  projects: Project[]
  repositories: Project[]
  activity: ActivityData
  stats: ProfileStats
}

export type SocialId = 'github' | 'linkedin' | 'instagram' | 'tiktok' | 'email'

export interface SocialLink {
  id: SocialId
  label: string
  /** Undefined until a real URL is configured in data/site.ts. */
  href?: string
  hint: string
}

export interface NavItem {
  id: string
  label: string
  href: string
  /** Section ids that keep this tab highlighted while scrolling. */
  sections: string[]
}

export interface BuildLogEntry {
  id: string
  projectSlug: string
  topic: string
}

export interface TerminalLine {
  kind: 'command' | 'output'
  text: string
}
