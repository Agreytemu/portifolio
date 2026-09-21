/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "true" (and fill in githubUsername) to load repositories and activity from the GitHub API. */
  readonly VITE_GITHUB_SYNC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
