import type { ProjectLanguage } from '../types'

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  Kotlin: '#A97BFF',
}

const FALLBACK = '#8E9AA2'

export function languageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? FALLBACK
}

export function language(name: string): ProjectLanguage {
  return { name, color: languageColor(name) }
}
