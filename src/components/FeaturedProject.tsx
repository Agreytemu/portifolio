import { GitBranch } from 'lucide-react'
import type { Project } from '../types'
import { ArchitectureFlow } from './ArchitectureFlow'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'
import { SystemOverview } from './SystemOverview'
import { TechBadgeList } from './TechBadgeList'

interface FeaturedProjectProps {
  project: Project
  onOpen: (project: Project) => void
}

export function FeaturedProject({ project, onOpen }: FeaturedProjectProps) {
  const titleId = `${project.slug}-featured-title`
  const isFlow = project.architectureView === 'flow'

  return (
    <article
      aria-labelledby={titleId}
      className="grid grid-cols-1 overflow-hidden rounded-lg border border-line bg-surface shadow-panel lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
    >
      <div className="min-w-0 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 id={titleId} className="text-2xl font-semibold tracking-tight">
            {project.title}
          </h3>
          <StatusBadge tone={project.liveUrl ? 'accent' : 'warn'}>
            {project.liveUrl ? 'Live' : project.liveNote}
          </StatusBadge>
        </div>

        <p className="mt-3 max-w-[62ch] text-soft">{project.description}</p>

        <h4 className="mt-6 text-sm font-semibold">What it handles</h4>
        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 xl:grid-cols-3">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-soft">
              <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-[1px] bg-accent" />
              {feature}
            </li>
          ))}
        </ul>

        <TechBadgeList items={project.technologies} label={`${project.title} technologies`} className="mt-6" />

        <div className="mt-7 flex flex-wrap gap-2">
          <Button variant="primary" aria-haspopup="dialog" onClick={() => onOpen(project)}>
            View Project
          </Button>
          <Button
            href={project.repoUrl}
            external
            unavailableReason={project.repoUrl ? undefined : 'Repository is private or not linked yet'}
          >
            <GitBranch size={16} aria-hidden="true" />
            GitHub
          </Button>
        </div>
      </div>

      <div className="min-w-0 border-t border-line bg-canvas/50 p-5 sm:p-7 lg:border-l lg:border-t-0">
        <h4 className="text-sm font-semibold">{isFlow ? 'System overview' : 'Architecture'}</h4>
        <p className="mb-4 mt-1 text-[13px] text-muted">
          {isFlow ? 'How a request moves through the platform.' : 'The layers this project is built from.'}
        </p>
        {isFlow ? <SystemOverview nodes={project.architecture} /> : <ArchitectureFlow nodes={project.architecture} />}
      </div>
    </article>
  )
}
