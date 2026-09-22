import type { PortfolioData, Project } from '../types'
import { languageColor } from './languages'
import { computeStats } from './stats'

interface GithubRepository {
  name: string
  html_url: string
  homepage: string | null
  description: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  language: string | null
  languages: Record<string, number>
  created_at: string
  updated_at: string
  pushed_at: string | null
  archived: boolean
  fork: boolean
  visibility: string
  owner: { login: string }
  default_branch: string
  latestCommit?: { sha: string; message: string; date?: string }
}

interface GithubResponse {
  username: string
  repositories: GithubRepository[]
  refreshedAt: string
}

async function getJson<T>(username: string, signal?: AbortSignal, forceRefresh = false): Promise<T> {
  const refresh = forceRefresh ? '&refresh=1' : ''
  const response = await fetch(`/api/github/repos?username=${encodeURIComponent(username)}${refresh}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string; status?: number; rateLimitRemaining?: string } | null
    throw new Error(body?.error ?? `Repository API request failed (${response.status})`)
  }
  return (await response.json()) as T
}

function toProject(repo: GithubRepository, base: Project | undefined): Project {
  const languages = Object.keys(repo.languages).sort((a, b) => repo.languages[b] - repo.languages[a])
  const primaryLanguage = repo.language ?? languages[0] ?? base?.language.name ?? 'Other'
  const fallback = base ?? {
    slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title: repo.name,
    summary: repo.description?.trim() || 'No description provided.',
    description: repo.description?.trim() || 'No description provided.',
    language: { name: primaryLanguage, color: languageColor(primaryLanguage) },
    stack: languages.length ? languages.slice(0, 5) : [primaryLanguage],
    technologies: languages,
    status: 'coming-soon' as const,
    liveNote: 'No live demo configured',
    category: 'GitHub repository',
    problem: 'Repository details are maintained on GitHub.',
    solution: repo.description?.trim() || 'No description provided.',
    features: [],
    architecture: [],
  }

  return {
    ...fallback,
    name: repo.name,
    repoUrl: repo.html_url,
    summary: repo.description?.trim() || base?.summary || 'No description provided.',
    description: repo.description?.trim() || base?.description || 'No description provided.',
    language: { name: primaryLanguage, color: languageColor(primaryLanguage) },
    stack: languages.length ? languages.slice(0, 5) : base?.stack ?? [primaryLanguage],
    technologies: languages.length ? languages : base?.technologies ?? [primaryLanguage],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics,
    languageNames: languages,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    latestActivity: repo.pushed_at ?? repo.updated_at,
    repoStatus: repo.archived ? 'archived' : repo.visibility === 'private' ? 'private' : 'public',
    isFork: repo.fork,
    visibility: repo.visibility,
    owner: repo.owner.login,
    defaultBranch: repo.default_branch,
    homepage: repo.homepage ?? undefined,
    liveUrl: repo.homepage ?? base?.liveUrl,
    liveNote: repo.homepage ? 'Live demo available' : base?.liveNote === 'Coming soon' ? 'No live demo configured' : fallback.liveNote,
    latestCommit: repo.latestCommit,
  }
}

export async function fetchGithubData(username: string, base: PortfolioData, signal?: AbortSignal, forceRefresh = false): Promise<PortfolioData> {
  const response = await getJson<GithubResponse>(username, signal, forceRefresh)
  const byName = new Map(base.projects.map((project) => [project.name.toLowerCase(), project] as const))
  const repositories = response.repositories
    .map((repo) => toProject(repo, byName.get(repo.name.toLowerCase())))
    .sort((a, b) => (b.latestActivity ?? '').localeCompare(a.latestActivity ?? ''))
  const projects = base.projects.map((project) => repositories.find((repo) => repo.name === project.name) ?? project)

  return {
    projects,
    repositories,
    activity: { ...base.activity, source: 'github', badge: 'Live GitHub data' },
    stats: computeStats(projects, repositories.length),
  }
}