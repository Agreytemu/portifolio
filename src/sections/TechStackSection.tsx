import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { TechStack } from '../components/TechStack'
import { stackGroups } from '../data/stack'
import type { Project } from '../types'

interface TechStackSectionProps {
  projects: Project[]
}

export function TechStackSection({ projects }: TechStackSectionProps) {
  return (
    <Section id="stack" headingId="stack-heading">
      <Reveal>
        <SectionHeading
          id="stack-heading"
          title="Tech Stack"
          description="Grouped by the job each tool does. React is the primary tool. Hover a technology to see which listed projects use it."
        />
        <TechStack groups={stackGroups} projects={projects} />
      </Reveal>
    </Section>
  )
}
