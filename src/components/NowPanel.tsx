import { site } from '../data/site'
import type { Project } from '../types'
import { TechBadgeList } from './TechBadgeList'

interface NowPanelProps {
  projects: Project[]
  onOpenProject: (project: Project) => void
}

/** Compact "what am I doing right now" panel, derived from project status and site.nowFocus. */
export function NowPanel({ projects, onOpenProject }: NowPanelProps) {
  const building = projects.filter((project) => project.status === 'in-development')

  return (
    <aside
      aria-labelledby="now-heading"
      className="min-w-0 self-start rounded-lg border border-line bg-canvas/60 shadow-panel"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
        <h2 id="now-heading" className="label-mono text-fg">
          Now
        </h2>
      </div>

      <dl className="space-y-5 p-4">
        {building.length > 0 && (
          <div>
            <dt className="label-mono">Currently building</dt>
            <dd className="mt-2.5 space-y-4">
              {building.map((project) => (
                <div key={project.slug}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => onOpenProject(project)}
                    className="group block w-full rounded text-left"
                  >
                    <span className="text-[15px] font-semibold text-fg group-hover:text-accent">{project.title}</span>
                    <span className="mt-1 block text-[13px] leading-snug text-muted">{project.summary}</span>
                  </button>
                  <TechBadgeList items={project.stack} label={`${project.title} stack`} size="sm" className="mt-2.5" />
                </div>
              ))}
            </dd>
          </div>
        )}

        <div>
          <dt className="label-mono">Focus</dt>
          <dd className="mt-2.5">
            <ul className="space-y-1.5 text-sm text-soft">
              {site.nowFocus.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </aside>
  )
}
