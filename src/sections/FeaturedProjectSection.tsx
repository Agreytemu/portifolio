import { FeaturedProject } from '../components/FeaturedProject'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import type { Project } from '../types'

interface FeaturedProjectSectionProps {
  project: Project | undefined
  onOpenProject: (project: Project) => void
}

export function FeaturedProjectSection({ project, onOpenProject }: FeaturedProjectSectionProps) {
  if (!project) return null

  return (
    <Section id="featured" headingId="featured-heading" className="pt-4 md:pt-6">
      <Reveal>
        <SectionHeading id="featured-heading" title="Featured project" />
        <FeaturedProject project={project} onOpen={onOpenProject} />
      </Reveal>
    </Section>
  )
}
