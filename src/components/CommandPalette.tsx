import { Activity, ArrowUpRight, FileText, Folder, GitBranch, Layers, Mail, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatePresence, m } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { getSocialLinks } from '../data/site'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { cn } from '../lib/cn'
import type { Project } from '../types'

type Group = 'Navigate' | 'Projects' | 'Links'

interface Command {
  id: string
  group: Group
  label: string
  hint?: string
  icon: LucideIcon
  keywords: string
  /** Set when the command cannot run yet, for example a link that has not been configured. */
  unavailable?: string
  run: () => void
}

const GROUPS: Group[] = ['Navigate', 'Projects', 'Links']

function goTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  projects: Project[]
  onOpenProject: (project: Project) => void
  modifier: string
}

export function CommandPalette({ open, onClose, projects, onOpenProject, modifier }: CommandPaletteProps) {
  // Actions run after the exit animation, so focus is restored before a project dialog takes it.
  const pending = useRef<(() => void) | null>(null)

  const runAfterClose = useCallback(
    (action: () => void) => {
      pending.current = action
      onClose()
    },
    [onClose],
  )

  return (
    <AnimatePresence
      onExitComplete={() => {
        const action = pending.current
        pending.current = null
        action?.()
      }}
    >
      {open && (
        <PaletteDialog
          key="palette"
          onClose={onClose}
          runAfterClose={runAfterClose}
          projects={projects}
          onOpenProject={onOpenProject}
          modifier={modifier}
        />
      )}
    </AnimatePresence>
  )
}

interface PaletteDialogProps {
  onClose: () => void
  runAfterClose: (action: () => void) => void
  projects: Project[]
  onOpenProject: (project: Project) => void
  modifier: string
}

function PaletteDialog({ onClose, runAfterClose, projects, onOpenProject, modifier }: PaletteDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  useLockBodyScroll()
  useFocusTrap(panelRef, onClose)

  const commands = useMemo<Command[]>(() => {
    const github = getSocialLinks().find((link) => link.id === 'github')

    const navigate: Command[] = [
      { id: 'projects', label: 'Projects', hint: 'Featured project and repositories', icon: Folder, keywords: 'work repositories featured', target: 'featured' },
      { id: 'activity', label: 'Activity', hint: 'Activity graph and build log', icon: Activity, keywords: 'graph build log stats', target: 'activity' },
      { id: 'stack', label: 'Stack', hint: 'Technologies by category', icon: Layers, keywords: 'tech technologies tools', target: 'stack' },
      { id: 'about', label: 'About', hint: 'README and developer profile', icon: FileText, keywords: 'readme bio profile', target: 'about' },
      { id: 'contact', label: 'Contact', hint: 'Send a message', icon: Mail, keywords: 'email message hire', target: 'contact' },
    ].map(({ target, ...rest }) => ({ ...rest, group: 'Navigate' as const, run: () => goTo(target) }))

    const projectCommands: Command[] = projects.map((project) => ({
      id: `project-${project.slug}`,
      group: 'Projects',
      label: project.title,
      hint: project.category,
      icon: Folder,
      keywords: `${project.name} ${project.stack.join(' ')} repository`,
      run: () => onOpenProject(project),
    }))

    const links: Command[] = [
      {
        id: 'github',
        group: 'Links',
        label: 'GitHub',
        hint: github?.href ? 'Opens in a new tab' : undefined,
        icon: GitBranch,
        keywords: 'code repositories profile',
        unavailable: github?.href ? undefined : (github?.hint ?? 'GitHub link not added yet'),
        run: () => {
          if (github?.href) window.open(github.href, '_blank', 'noopener,noreferrer')
        },
      },
    ]

    return [...navigate, ...projectCommands, ...links]
  }, [projects, onOpenProject])

  const filtered = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (terms.length === 0) return commands
    return commands.filter((command) => {
      const haystack = `${command.label} ${command.hint ?? ''} ${command.keywords} ${command.group}`.toLowerCase()
      return terms.every((term) => haystack.includes(term))
    })
  }, [commands, query])

  const activeId = filtered[active] ? `palette-option-${filtered[active].id}` : undefined

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' })
  }, [activeId])

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setActive(0)
  }

  /** Moves the highlight to the next runnable command, wrapping around. */
  const move = (direction: 1 | -1) => {
    const count = filtered.length
    if (count === 0) return
    for (let step = 1; step <= count; step++) {
      const index = (active + direction * step + count * step) % count
      if (!filtered[index].unavailable) {
        setActive(index)
        return
      }
    }
  }

  const execute = (command: Command | undefined) => {
    if (!command || command.unavailable) return
    runAfterClose(command.run)
  }

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      move(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      execute(filtered[active])
    }
  }

  return (
    <m.div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-3 pt-[8vh] sm:px-4 sm:pt-[14vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        initial={{ opacity: 0, y: -8, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.99 }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} aria-hidden="true" className="shrink-0 text-muted" />
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
            placeholder="Go to a section or project"
            value={query}
            onChange={onQueryChange}
            onKeyDown={onInputKeyDown}
            className="h-12 w-full bg-transparent text-base text-fg placeholder:text-faint focus:outline-none sm:text-[15px]"
          />
          <kbd aria-hidden="true">esc</kbd>
        </div>

        <ul id="palette-list" role="listbox" aria-label="Commands" className="scroll-thin max-h-[min(22rem,55vh)] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li role="presentation" className="px-3 py-8 text-center text-sm text-muted">
              No matching commands.
            </li>
          )}
          {GROUPS.map((group) => {
            const items = filtered.filter((command) => command.group === group)
            if (items.length === 0) return null
            return (
              <li key={group} role="presentation">
                <p className="label-mono px-3 pb-1.5 pt-3">{group}</p>
                <ul role="presentation">
                  {items.map((command) => {
                    const index = filtered.indexOf(command)
                    const selected = index === active
                    const Icon = command.icon
                    return (
                      <li
                        key={command.id}
                        id={`palette-option-${command.id}`}
                        role="option"
                        aria-selected={selected}
                        aria-disabled={command.unavailable ? true : undefined}
                        onMouseMove={() => {
                          if (!command.unavailable && index !== active) setActive(index)
                        }}
                        onClick={() => execute(command)}
                        className={cn(
                          'flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm',
                          command.unavailable ? 'cursor-not-allowed text-faint' : 'cursor-pointer text-soft',
                          selected && !command.unavailable && 'bg-raised text-fg',
                        )}
                      >
                        <Icon size={16} aria-hidden="true" className={cn('shrink-0', selected ? 'text-accent' : 'text-muted')} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{command.label}</span>
                          {(command.unavailable ?? command.hint) && (
                            <span className="block truncate text-xs text-muted">{command.unavailable ?? command.hint}</span>
                          )}
                        </span>
                        {command.id === 'github' && !command.unavailable && (
                          <ArrowUpRight size={14} aria-hidden="true" className="shrink-0 text-muted" />
                        )}
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-muted sm:flex" aria-hidden="true">
          <span className="flex items-center gap-1.5">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd>↵</kbd>
            select
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <kbd>{modifier}</kbd>
            <kbd>K</kbd>
            toggle
          </span>
        </div>
      </m.div>
    </m.div>
  )
}
