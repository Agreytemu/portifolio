import { ActivityGraph } from '../components/ActivityGraph'
import { BuildLog } from '../components/BuildLog'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { StatCard } from '../components/StatCard'
import { buildLog } from '../data/buildLog'
import type { ActivityData, ProfileStats, Project } from '../types'

interface ActivitySectionProps {
  activity: ActivityData
  stats: ProfileStats
  projects: Project[]
  onOpenProject: (project: Project) => void
}

export function ActivitySection({ activity, stats, projects, onOpenProject }: ActivitySectionProps) {
  return (
    <Section id="activity" headingId="activity-heading">
      <Reveal>
        <SectionHeading
          id="activity-heading"
          title="Activity"
          description="Building, experimenting, and shipping software."
        />
        <dl className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total projects" value={stats.projects} hint="Listed on this page" />
          <StatCard label="Technologies" value={stats.technologies} hint="In the stack below" />
          <StatCard
            label="Repositories"
            value={stats.repositories ?? '—'}
            hint={stats.repositories === null ? 'Links not added yet' : 'Linked from projects'}
          />
          <StatCard label="Current builds" value={stats.inDevelopment} hint="In development now" />
        </dl>
        <ActivityGraph activity={activity} />
        <BuildLog entries={buildLog} projects={projects} onOpenProject={onOpenProject} />
      </Reveal>
    </Section>
  )
}
