import { useMemo, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { RepositoryGrid } from '../components/RepositoryGrid'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import type { Project } from '../types'

interface RepositoriesSectionProps {
  projects: Project[]
  onOpenProject: (project: Project) => void
  githubLoading: boolean
  githubError: string | null
  onRefresh: () => void
}

export function RepositoriesSection({ projects, onOpenProject, githubLoading, githubError, onRefresh }: RepositoriesSectionProps) {
  const [languageFilter, setLanguageFilter] = useState('All')
  const languages = useMemo(() => ['All', ...new Set(projects.map((project) => project.language.name).filter(Boolean))], [projects])
  const filteredProjects = languageFilter === 'All' ? projects : projects.filter((project) => project.language.name === languageFilter)

  return (
    <Section id="projects" headingId="projects-heading" className="pt-4 md:pt-6">
      <Reveal>
        <SectionHeading
          id="projects-heading"
          title="Repositories"
          count={filteredProjects.length}
          description="Select a repository to see the problem, the approach, and the architecture."
        />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {githubLoading ? <p className="text-[13px] text-muted">Refreshing repositories from GitHub...</p> : githubError ? <p className="text-[13px] text-muted">GitHub sync failed: {githubError}</p> : <span />}
          <button type="button" onClick={onRefresh} className="text-[13px] text-muted underline-offset-2 hover:text-fg hover:underline">Refresh GitHub data</button>
        </div>
        {!githubLoading && !githubError && projects.length === 0 && <p className="mb-4 text-[13px] text-muted">No public repositories are available yet.</p>}
        {languages.length > 1 && (
          <label className="mb-4 flex items-center gap-2 text-[13px] text-muted">
            <span className="label-mono">Language</span>
            <select
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
              className="rounded border border-line bg-canvas px-2 py-1.5 text-soft"
            >
              {languages.map((language) => <option key={language}>{language}</option>)}
            </select>
          </label>
        )}
        <RepositoryGrid projects={filteredProjects} onOpen={onOpenProject} />
      </Reveal>
    </Section>
  )
}
