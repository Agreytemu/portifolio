import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'
import { statusMeta } from '../lib/status'
import { toneStyles } from '../lib/tones'
import type { BuildLogEntry, Project } from '../types'

interface BuildLogProps {
  entries: BuildLogEntry[]
  projects: Project[]
  onOpenProject: (project: Project) => void
}

/** Current work by project. Undated on purpose: no entry claims a date it does not have. */
export function BuildLog({ entries, projects, onOpenProject }: BuildLogProps) {
  const bySlug = new Map(projects.map((project) => [project.slug, project] as const))

  return (
    <div className="mt-4 rounded-lg border border-line bg-surface shadow-panel">
      <div className="border-b border-line px-4 py-3.5">
        <h3 className="text-sm font-semibold">Build log</h3>
        <p className="mt-1 text-[13px] text-muted">Current engineering work, by project.</p>
      </div>

      <ol className="divide-y divide-line">
        {entries.map((entry) => {
          const project = bySlug.get(entry.projectSlug)
          if (!project) return null
          const status = statusMeta[project.status]
          const tone = toneStyles[status.tone]

          return (
            <li key={entry.id}>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => onOpenProject(project)}
                className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-raised/60"
              >
                <span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-full', tone.dot)} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-fg">{project.title}</span>
                  <span className="mt-0.5 block text-[13px] text-muted">{entry.topic}</span>
                </span>
                <span className={cn('hidden text-xs sm:block', tone.text)}>{status.label}</span>
                <ChevronRight
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-faint transition duration-150 group-hover:translate-x-0.5 group-hover:text-muted"
                />
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
