import type { Project } from '../types'
import { Container } from '../components/Container'
import { ProfileHeader } from '../components/ProfileHeader'

interface OverviewSectionProps {
  projects: Project[]
  onOpenProject: (project: Project) => void
}

export function OverviewSection({ projects, onOpenProject }: OverviewSectionProps) {
  return (
    <section id="overview" aria-labelledby="profile-heading" className="border-b border-line bg-surface">
      <Container className="py-10 md:py-14">
        <ProfileHeader projects={projects} onOpenProject={onOpenProject} />
      </Container>
    </section>
  )
}
