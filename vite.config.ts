import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { githubApiPlugin } from './server/githubApi'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const processLike = (globalThis as { process?: { env: Record<string, string | undefined> } }).process
  if (env.GITHUB_TOKEN && processLike) processLike.env.GITHUB_TOKEN = env.GITHUB_TOKEN

  return {
    plugins: [react(), githubApiPlugin()],
    build: { target: 'es2022', sourcemap: false },
  }
})
