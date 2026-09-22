import { GitBranch, Image as ImageIcon, X } from 'lucide-react'
import { AnimatePresence, m } from 'framer-motion'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { statusMeta } from '../lib/status'
import type { Project } from '../types'
import { ArchitectureFlow } from './ArchitectureFlow'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'
import { SystemOverview } from './SystemOverview'
import { TechBadgeList } from './TechBadgeList'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return <AnimatePresence>{project && <ModalContent key={project.slug} project={project} onClose={onClose} />}</AnimatePresence>
}

function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function ModalContent({ project, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  useLockBodyScroll()
  useFocusTrap(panelRef, onClose)

  const status = statusMeta[project.status]
  const repositoryStatus = project.repoStatus === 'archived' ? 'Archived' : project.repoStatus === 'private' ? 'Private' : project.repoStatus === 'public' ? 'Public' : status.label
  const titleId = `${project.slug}-modal-title`

  return (
    <m.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-xl border border-line bg-surface shadow-[0_24px_64px_-16px_rgba(0,0,0,0.7)] focus:outline-none sm:rounded-lg"
      >
        <header className="flex items-start gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[13px] text-muted">{project.name}</p>
            <h2 id={titleId} className="mt-0.5 text-xl font-semibold tracking-tight">
              {project.title}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge tone={status.tone}>{repositoryStatus}</StatusBadge>
              {project.liveNote.toLowerCase() !== repositoryStatus.toLowerCase() && <StatusBadge>{project.liveNote}</StatusBadge>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="scroll-thin space-y-6 overflow-y-auto overscroll-contain px-5 py-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ModalSection title="Problem">
              <p className="text-sm leading-relaxed text-soft">{project.problem}</p>
            </ModalSection>
            <ModalSection title="Solution">
              <p className="text-sm leading-relaxed text-soft">{project.solution}</p>
            </ModalSection>
          </div>

          <ModalSection title="Key features">
            <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-soft">
                  <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-[1px] bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </ModalSection>

          <ModalSection title={project.architectureView === 'flow' ? 'System overview' : 'Architecture'}>
            {project.architectureView === 'flow' ? (
              <SystemOverview nodes={project.architecture} />
            ) : (
              <ArchitectureFlow nodes={project.architecture} />
            )}
          </ModalSection>

          <ModalSection title="Technology">
            <TechBadgeList items={project.technologies} label={`${project.title} technologies`} />
          </ModalSection>

          <ModalSection title="Current status">
            <dl className="grid grid-cols-1 gap-2 text-sm text-soft sm:grid-cols-2">
              <div><dt className="label-mono">Visibility</dt><dd className="mt-1">{project.visibility ?? repositoryStatus}</dd></div>
              <div><dt className="label-mono">Owner</dt><dd className="mt-1">{project.owner ?? 'Portfolio configuration'}</dd></div>
              <div><dt className="label-mono">Default branch</dt><dd className="mt-1">{project.defaultBranch ?? 'Not available'}</dd></div>
              <div><dt className="label-mono">Repository type</dt><dd className="mt-1">{project.isFork ? 'Fork' : 'Original repository'}</dd></div>
              <div><dt className="label-mono">Created</dt><dd className="mt-1">{formatDate(project.createdAt)}</dd></div>
              <div><dt className="label-mono">Updated</dt><dd className="mt-1">{formatDate(project.updatedAt)}</dd></div>
              <div><dt className="label-mono">Last push</dt><dd className="mt-1">{formatDate(project.latestActivity)}</dd></div>
              <div><dt className="label-mono">Stars / forks</dt><dd className="mt-1">{project.stars ?? 0} / {project.forks ?? 0}</dd></div>
            </dl>
            {project.topics && project.topics.length > 0 && <p className="mt-3 text-sm text-soft"><span className="label-mono">Topics</span><br />{project.topics.join(', ')}</p>}
            {project.latestCommit && <p className="mt-3 break-words text-sm text-soft"><span className="label-mono">Latest commit</span><br />{project.latestCommit.sha.slice(0, 7)} {project.latestCommit.message}</p>}
          </ModalSection>

          <ModalSection title="Screenshots">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[1, 2].map((slot) => (
                <div
                  key={slot}
                  className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line-strong bg-canvas text-muted"
                >
                  <ImageIcon size={20} aria-hidden="true" />
                  <span className="text-[13px]">Screenshot coming soon</span>
                </div>
              ))}
            </div>
          </ModalSection>

          <ModalSection title="Links">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                href={project.repoUrl}
                external
                unavailableReason={project.repoUrl ? undefined : 'Repository is private or not linked yet'}
              >
                <GitBranch size={16} aria-hidden="true" />
                Repository
              </Button>
              {project.liveUrl ? (
                <Button variant="primary" href={project.liveUrl} external>
                  Live demo
                </Button>
              ) : (
                <span className="text-[13px] text-muted">Live demo: {project.liveNote}</span>
              )}
            </div>
          </ModalSection>
        </div>
      </m.div>
    </m.div>
  )
}

function formatDate(value?: string) {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}
