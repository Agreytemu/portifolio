import { stackGroups } from '../data/stack'
import type { ProfileStats, Project } from '../types'

export function computeStats(projects: Project[], repositoryCount?: number): ProfileStats {
  const technologies = new Set(stackGroups.flatMap((group) => group.items)).size
  const linked = repositoryCount ?? projects.filter((project) => project.repoUrl).length

  return {
    projects: projects.length,
    technologies,
    repositories: linked > 0 ? linked : null,
    inDevelopment: projects.filter((project) => project.status === 'in-development').length,
  }
}
