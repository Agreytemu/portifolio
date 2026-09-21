import { useEffect, useState } from 'react'
import { isGithubSyncEnabled, loadGithubPortfolio, loadStaticPortfolio } from '../lib/dataSource'
import type { PortfolioData } from '../types'

/**
 * Returns static data immediately. When GitHub sync is enabled, it swaps in live data
 * once it arrives. Components only ever see PortfolioData, so the UI does not change.
 */
export function usePortfolioData(): PortfolioData {
  const [data, setData] = useState<PortfolioData>(loadStaticPortfolio)

  useEffect(() => {
    if (!isGithubSyncEnabled()) return

    const controller = new AbortController()
    loadGithubPortfolio(controller.signal)
      .then((next) => setData(next))
      .catch(() => {
        // Keep the static data if the request fails or is aborted.
      })

    return () => controller.abort()
  }, [])

  return data
}
