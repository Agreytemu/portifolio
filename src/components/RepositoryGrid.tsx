import type { Project } from '../types'
import { RepositoryCard } from './RepositoryCard'

interface RepositoryGridProps {
  projects: Project[]
  onOpen: (project: Project) => void
}

export function RepositoryGrid({ projects, onOpen }: RepositoryGridProps) {
  const oddCount = projects.length % 2 === 1

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <li key={project.slug} className="flex">
          <RepositoryCard project={project} onOpen={onOpen} />
        </li>
      ))}
      {oddCount && (
        <li className="hidden items-center justify-center rounded-lg border border-dashed border-line p-5 text-center text-sm text-muted md:flex">
          More projects will appear here once they are ready to share.
        </li>
      )}
    </ul>
  )
}
