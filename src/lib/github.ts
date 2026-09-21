import type { PortfolioData, Project } from '../types'
import { activityFromCounts } from './activity'
import { languageColor } from './languages'
import { computeStats } from './stats'

/**
 * Optional GitHub sync. It is off by default (see lib/dataSource.ts) and always falls back to the
 * static data when a request fails. It only touches the public, unauthenticated REST API.
 */

const API_ROOT = 'https://api.github.com'

interface GithubRepo {
  name: string
  html_url: string
  stargazers_count: number
  language: string | null
}

interface GithubEvent {
  type: string
  created_at: string
  payload?: { size?: number }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal,
  })
  if (!response.ok) throw new Error(`GitHub API request failed (${response.status}): ${path}`)
  return (await response.json()) as T
}

/** Matches repositories to static projects by name and fills in link, stars, and language. */
function mergeRepos(projects: Project[], repos: GithubRepo[]): Project[] {
  const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo] as const))

  return projects.map((project) => {
    const repo = byName.get(project.name.toLowerCase())
    if (!repo) return project

    return {
      ...project,
      repoUrl: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language ? { name: repo.language, color: languageColor(repo.language) } : project.language,
    }
  })
}

function countPushCommits(events: GithubEvent[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const event of events) {
    if (event.type !== 'PushEvent') continue
    const day = event.created_at.slice(0, 10)
    counts.set(day, (counts.get(day) ?? 0) + Math.max(1, event.payload?.size ?? 1))
  }
  return counts
}

export async function fetchGithubData(
  username: string,
  base: PortfolioData,
  signal?: AbortSignal,
): Promise<PortfolioData> {
  const user = encodeURIComponent(username)

  const [reposResult, eventsResult] = await Promise.allSettled([
    getJson<GithubRepo[]>(`/users/${user}/repos?per_page=100&sort=pushed`, signal),
    getJson<GithubEvent[]>(`/users/${user}/events/public?per_page=100`, signal),
  ])

  const repos = reposResult.status === 'fulfilled' ? reposResult.value : null
  const projects = repos ? mergeRepos(base.projects, repos) : base.projects
  const activity =
    eventsResult.status === 'fulfilled' ? activityFromCounts(countPushCommits(eventsResult.value)) : base.activity

  return { projects, activity, stats: computeStats(projects, repos?.length) }
}
