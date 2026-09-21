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
    activity: generateDemoActivity(),
    stats: computeStats(projects),
  }
}

/** True only when a GitHub username is set and VITE_GITHUB_SYNC=true. */
export function isGithubSyncEnabled(): boolean {
  return import.meta.env.VITE_GITHUB_SYNC === 'true' && site.githubUsername.length > 0
}

export function loadGithubPortfolio(signal?: AbortSignal): Promise<PortfolioData> {
  return fetchGithubData(site.githubUsername, loadStaticPortfolio(), signal)
}
