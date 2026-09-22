import { GithubApiError, getCachedRepositories } from '../../server/githubApi'

interface VercelRequest {
  method?: string
  url?: string
}

interface VercelResponse {
  statusCode: number
  setHeader(name: string, value: string): VercelResponse
  end(body: string): void
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    response.statusCode = 405
    response.setHeader('Allow', 'GET')
    response.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  try {
    const requestUrl = new URL(request.url ?? '/', 'https://vercel.local')
    const username = requestUrl.searchParams.get('username')?.trim() || 'Agreytemu'
    const forceRefresh = requestUrl.searchParams.get('refresh') === '1'
    const value = await getCachedRepositories(username, forceRefresh)

    response.statusCode = 200
    response.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=60')
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(value))
  } catch (error) {
    const apiError = error instanceof GithubApiError ? error : undefined
    response.statusCode = apiError?.status === 401 || apiError?.status === 403 ? apiError.status : 502
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({
      error: error instanceof Error ? error.message : 'GitHub API unavailable',
      status: apiError?.status,
      rateLimitRemaining: apiError?.rateLimitRemaining,
      authMode: apiError ? undefined : 'unknown',
    }))
  }
}