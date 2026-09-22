import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { githubApiPlugin } from './server/githubApi'

export default defineConfig({
  plugins: [react(), githubApiPlugin()],
  build: { target: 'es2022', sourcemap: false },
})
