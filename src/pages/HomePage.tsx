import { useCallback, useState } from 'react'
import { CommandPalette } from '../components/CommandPalette'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ProjectModal } from '../components/ProjectModal'
import { navItems, sectionIds } from '../data/navigation'
import { useActiveSection } from '../hooks/useActiveSection'
import { useCommandShortcut } from '../hooks/useCommandShortcut'
import { usePortfolioData } from '../hooks/usePortfolioData'
import { AboutSection } from '../sections/AboutSection'
import { ActivitySection } from '../sections/ActivitySection'
import { ContactSection } from '../sections/ContactSection'
import { FeaturedProjectSection } from '../sections/FeaturedProjectSection'
import { HowIBuildSection } from '../sections/HowIBuildSection'
import { JourneySection } from '../sections/JourneySection'
import { OverviewSection } from '../sections/OverviewSection'
import { RepositoriesSection } from '../sections/RepositoriesSection'
import { TechStackSection } from '../sections/TechStackSection'
import { TerminalSection } from '../sections/TerminalSection'
import { modifierLabel } from '../lib/platform'
import type { Project } from '../types'

export function HomePage() {
  const { projects, repositories, activity, stats, githubLoading, githubError, refreshGithub } = usePortfolioData()
  const [selected, setSelected] = useState<Project | null>(null)
  const openProject = useCallback((project: Project) => setSelected(project), [])
  const closeProject = useCallback(() => setSelected(null), [])

  const [paletteOpen, setPaletteOpen] = useState(false)
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const togglePalette = useCallback(() => setPaletteOpen((value) => !value), [])
  // While a project dialog is open it owns the keyboard, so Ctrl/Cmd+K is ignored.
  useCommandShortcut(togglePalette, selected === null)
  const modifier = modifierLabel()

  const activeSection = useActiveSection(sectionIds)
  const activeNavId = navItems.find((item) => item.sections.includes(activeSection))?.id

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar activeNavId={activeNavId} onOpenPalette={openPalette} modifier={modifier} />
      <main id="main">
        <OverviewSection projects={projects} onOpenProject={openProject} />
        <AboutSection />
        <FeaturedProjectSection project={projects.find((project) => project.featured)} onOpenProject={openProject} />
        <RepositoriesSection
          projects={repositories}
          onOpenProject={openProject}
          githubLoading={githubLoading}
          githubError={githubError}
          onRefresh={refreshGithub}
        />
        <ActivitySection activity={activity} stats={stats} projects={projects} onOpenProject={openProject} />
        <TechStackSection projects={projects} />
        <HowIBuildSection />
        <JourneySection />
        <TerminalSection />
        <ContactSection />
      </main>
      <Footer />
      <ProjectModal project={selected} onClose={closeProject} />
      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        projects={projects}
        onOpenProject={openProject}
        modifier={modifier}
      />
    </>
  )
}
