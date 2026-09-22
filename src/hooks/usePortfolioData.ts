import { useEffect, useState } from 'react'
import { isGithubSyncEnabled, loadGithubPortfolio, loadStaticPortfolio } from '../lib/dataSource'
import type { PortfolioData } from '../types'

/**
 * Returns static data immediately. When GitHub sync is enabled, it swaps in live data
 * once it arrives. Components only ever see PortfolioData, so the UI does not change.
 */
export function usePortfolioData(): PortfolioData & { githubLoading: boolean; githubError: string | null; refreshGithub: () => void } {
  const [data, setData] = useState<PortfolioData>(loadStaticPortfolio)
  const [githubLoading, setGithubLoading] = useState(isGithubSyncEnabled)
  const [githubError, setGithubError] = useState<string | null>(null)

  const syncGithub = (signal: AbortSignal, forceRefresh: boolean) => {
    if (!isGithubSyncEnabled()) return

    setGithubLoading(true)
    setGithubError(null)
    loadGithubPortfolio(signal, forceRefresh)
      .then((next) => {
        setData(next)
        setGithubLoading(false)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setGithubLoading(false)
        setGithubError(error instanceof Error ? error.message : 'GitHub data could not be loaded.')
      })

  }

  const refreshGithub = () => {
    syncGithub(new AbortController().signal, true)
  }

  useEffect(() => {
    const controller = new AbortController()
    syncGithub(controller.signal, false)

    return () => controller.abort()
  }, [])

  return { ...data, githubLoading, githubError, refreshGithub }
}
