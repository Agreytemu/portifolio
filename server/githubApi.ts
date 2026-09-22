import type { Plugin } from 'vite'

const CACHE_TTL_MS = 10 * 60 * 1000
const DEFAULT_USERNAME = 'Agreytemu'
const API_ROOT = 'https://api.github.com'

interface CacheEntry {
  expiresAt: number
  value: GithubResponse
}

interface GithubResponse {
  username: string
  authMode: 'public' | 'authenticated'
  repositories: GithubRepository[]
  refreshedAt: string
}

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

interface GithubApiRepository extends Omit<GithubRepository, 'languages'> {
  languages_url: string
  commits_url: string
}

interface GithubCommit {
  sha: string
  commit: { message: string; author?: { date?: string } | null }
}

class GithubApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly rateLimitRemaining?: string | null,
  ) {
    super(message)
  }
}

interface ApiRequest {
  method?: string
  originalUrl?: string
  url?: string
}

interface ApiResponse {
  statusCode: number
  setHeader(name: string, value: string): void
  end(body: string): void
}

const cache = new Map<string, CacheEntry>()

function serverToken(): string | undefined {
  const processLike = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return processLike?.env?.GITHUB_TOKEN
}

function headers(): HeadersInit {
  const token = serverToken()
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function githubJson<T>(url: string): Promise<{ data: T; response: Response }> {
  const response = await fetch(url, { headers: headers() })
  if (!response.ok) {
    let detail = ''
    try {
      const body = (await response.json()) as { message?: string }
      detail = body.message ? `: ${body.message}` : ''
    } catch {
      // Keep the HTTP status when GitHub does not return JSON.
    }
    throw new GithubApiError(`GitHub API request failed (${response.status})${detail}`, response.status, response.headers.get('x-ratelimit-remaining'))
  }
  return { data: (await response.json()) as T, response }
}

function nextPage(response: Response): string | undefined {
  const link = response.headers.get('Link')
  const match = link?.match(/<([^>]+)>; rel="next"/)
  return match?.[1]
}

async function fetchRepositories(username: string): Promise<GithubResponse> {
  const repositories: GithubApiRepository[] = []
  const authenticated = Boolean(serverToken())
  if (authenticated) {
    const { data: account } = await githubJson<{ login: string }>(`${API_ROOT}/user`)
    if (account.login.toLowerCase() !== username.toLowerCase()) {
      throw new GithubApiError(`GITHUB_TOKEN belongs to ${account.login}, not ${username}`, 403)
    }
  }
  let url: string | undefined = authenticated
    ? `${API_ROOT}/user/repos?per_page=100&sort=pushed&visibility=all&affiliation=owner`
    : `${API_ROOT}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&type=owner`

  while (url) {
    const result = await githubJson<GithubApiRepository[]>(url)
    repositories.push(...result.data.filter((repository) => repository.owner.login.toLowerCase() === username.toLowerCase()))
    url = nextPage(result.response)
  }

  const enriched = await Promise.all(
    repositories.map(async (repository) => {
      try {
        const { data: languages } = await githubJson<Record<string, number>>(repository.languages_url)
        let latestCommit: GithubRepository['latestCommit']
        try {
          const { data: commits } = await githubJson<GithubCommit[]>(repository.commits_url.replace('{/sha}', '?per_page=1'))
          const commit = commits[0]
          if (commit) latestCommit = { sha: commit.sha, message: commit.commit.message, date: commit.commit.author?.date }
        } catch {
          latestCommit = undefined
        }
        return { ...repository, languages, latestCommit }
      } catch {
        return { ...repository, languages: {} }
      }
    }),
  )

  return {
    username,
    authMode: authenticated ? 'authenticated' : 'public',
    repositories: enriched,
    refreshedAt: new Date().toISOString(),
  }
}

async function getCachedRepositories(username: string, forceRefresh: boolean): Promise<GithubResponse> {
  const cacheKey = `${username}:${Boolean(serverToken())}`
  const current = cache.get(cacheKey)
  if (!forceRefresh && current && current.expiresAt > Date.now()) return current.value

  const value = await fetchRepositories(username)
  cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS })
  return value
}

function attachGithubRoute(server: { middlewares: { use: (path: string, handler: (request: ApiRequest, response: ApiResponse, next: () => void) => Promise<void>) => void } }) {
  server.middlewares.use('/api/github/repos', async (request: ApiRequest, response: ApiResponse, next: () => void) => {
        if (request.method !== 'GET') return next()

        try {
          const requestUrl = new URL(request.originalUrl ?? request.url ?? '/', 'http://localhost')
          const username = requestUrl.searchParams.get('username')?.trim() || DEFAULT_USERNAME
          const forceRefresh = requestUrl.searchParams.get('refresh') === '1'
          const value = await getCachedRepositories(username, forceRefresh)
          response.setHeader('Cache-Control', `public, max-age=${Math.floor(CACHE_TTL_MS / 1000)}`)
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(value))
        } catch (error) {
          const apiError = error instanceof GithubApiError ? error : undefined
          response.statusCode = apiError?.status === 401 || apiError?.status === 403 ? apiError.status : 502
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({
            error: error instanceof Error ? error.message : 'GitHub API unavailable',
            status: apiError?.status,
            rateLimitRemaining: apiError?.rateLimitRemaining,
            authMode: serverToken() ? 'authenticated' : 'public',
          }))
        }
  })
}

export function githubApiPlugin(): Plugin {
  return {
    name: 'github-repository-api',
    configureServer(server) {
      attachGithubRoute(server)
    },
    configurePreviewServer(server) {
      attachGithubRoute(server)
    },
  }
}