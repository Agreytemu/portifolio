import { useMemo } from 'react'
import type { Project, StackGroup } from '../types'
import { TechBadgeList } from './TechBadgeList'

interface TechStackProps {
  groups: StackGroup[]
  projects: Project[]
}

// "REST APIs" and "REST API" should match, so compare without a trailing "s".
const normalize = (name: string) => name.toLowerCase().replace(/s$/, '')

export function TechStack({ groups, projects }: TechStackProps) {
  // Which listed projects use each technology. Shown on hover only, to keep the section quiet.
  const usage = useMemo(() => {
    const titles: Record<string, string> = {}
    for (const group of groups) {
      for (const item of group.items) {
        const users = projects
          .filter((project) => project.technologies.some((tech) => normalize(tech) === normalize(item)))
          .map((project) => project.title)
        if (users.length > 0) titles[item] = `Used in: ${users.join(', ')}`
      }
    }
    return titles
  }, [groups, projects])

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-panel">
      {groups.map((group) => (
        <div
          key={group.id}
          className="grid grid-cols-1 gap-3 border-b border-line p-4 last:border-b-0 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6 sm:p-5"
        >
          <div>
            <h3 className="flex items-baseline gap-2 text-sm font-semibold">
              {group.label}
              <span className="font-mono text-xs font-normal text-muted">{group.items.length}</span>
            </h3>
            <p className="mt-1 text-[13px] leading-snug text-muted">{group.purpose}</p>
          </div>
          <TechBadgeList
            items={group.items}
            highlight={group.highlight}
            titles={usage}
            label={`${group.label} technologies`}
          />
        </div>
      ))}
    </div>
  )
}
