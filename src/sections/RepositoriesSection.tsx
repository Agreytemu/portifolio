import { Reveal } from '../components/Reveal'
import { RepositoryGrid } from '../components/RepositoryGrid'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import type { Project } from '../types'

interface RepositoriesSectionProps {
  projects: Project[]
  onOpenProject: (project: Project) => void
}

export function RepositoriesSection({ projects, onOpenProject }: RepositoriesSectionProps) {
  return (
    <Section id="projects" headingId="projects-heading" className="pt-4 md:pt-6">
      <Reveal>
        <SectionHeading
          id="projects-heading"
          title="Repositories"
          count={projects.length}
          description="Select a repository to see the problem, the approach, and the architecture."
        />
        <RepositoryGrid projects={projects} onOpen={onOpenProject} />
      </Reveal>
    </Section>
  )
}
