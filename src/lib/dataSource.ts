import { projects } from '../data/projects'
import { site } from '../data/site'
import type { PortfolioData } from '../types'
import { generateDemoActivity } from './activity'
import { fetchGithubData } from './github'
import { computeStats } from './stats'

/** Everything the UI needs, built synchronously from static data so the page never waits on a network. */
export function loadStaticPortfolio(): PortfolioData {
  return {
    projects,
    repositories: [],
    activity: generateDemoActivity(),
    stats: computeStats(projects),
  }
}

/** The repository API is server-backed, so the browser never calls GitHub directly. */
export function isGithubSyncEnabled(): boolean {
  return site.githubUsername.length > 0
}

export function loadGithubPortfolio(signal?: AbortSignal, forceRefresh = false): Promise<PortfolioData> {
  return fetchGithubData(site.githubUsername, loadStaticPortfolio(), signal, forceRefresh)
}
