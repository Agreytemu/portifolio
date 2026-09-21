import { ChevronRight, Folder, GitBranch, Star } from 'lucide-react'
import { cn } from '../lib/cn'
import { statusMeta } from '../lib/status'
import { toneStyles } from '../lib/tones'
import type { Project } from '../types'
import { Button } from './Button'
import { TechBadgeList } from './TechBadgeList'

interface RepositoryCardProps {
  project: Project
  onOpen: (project: Project) => void
}

export function RepositoryCard({ project, onOpen }: RepositoryCardProps) {
  const status = statusMeta[project.status]
  const tone = toneStyles[status.tone]

  return (
    <article className="group relative flex w-full flex-col rounded-lg border border-line bg-surface p-4 shadow-panel transition duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:bg-[#1B2024] hover:shadow-panel-hover sm:p-5">
      <div className="flex items-start gap-2">
        <Folder size={16} aria-hidden="true" className="mt-1 shrink-0 text-muted" />
        <h3 className="min-w-0 flex-1 break-words text-[15px] font-semibold">
          {/* The ::after stretches the button over the whole card so the card is one click target. */}
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`${project.title}: open project details`}
            onClick={() => onOpen(project)}
            className="text-left font-mono text-accent hover:underline after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {project.name}
          </button>
        </h3>
        <ChevronRight
          size={16}
          aria-hidden="true"
          className="mt-1 shrink-0 text-faint transition duration-150 group-hover:translate-x-0.5 group-hover:text-muted"
        />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-line pt-4">
        <div>
          <dt className="label-mono">Status</dt>
          <dd className={cn('mt-1.5 flex items-center gap-1.5 text-[13px] font-medium', tone.text)}>
            <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} />
            {status.label}
          </dd>
        </div>
        <div>
          <dt className="label-mono">Category</dt>
          <dd className="mt-1.5 text-[13px] leading-snug text-soft">{project.category}</dd>
        </div>
        <div className="col-span-2">
          <dt className="label-mono">Technology</dt>
          <dd className="mt-2">
            <TechBadgeList items={project.stack} label={`${project.title} stack`} size="sm" />
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <div className="flex items-center gap-3 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: project.language.color }}
            />
            {project.language.name}
          </span>
          {project.stars !== undefined && (
            <span className="inline-flex items-center gap-1">
              <Star size={13} aria-hidden="true" />
              {project.stars}
              <span className="sr-only"> stars</span>
            </span>
          )}
        </div>

        <div className="relative z-10">
          <Button
            size="sm"
            href={project.repoUrl}
            external
            unavailableReason={project.repoUrl ? undefined : 'Repository link not added yet'}
          >
            <GitBranch size={14} aria-hidden="true" />
            GitHub
          </Button>
        </div>
      </div>
    </article>
  )
}
