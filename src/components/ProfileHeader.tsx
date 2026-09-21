import { Briefcase, MapPin } from 'lucide-react'
import { m } from 'framer-motion'
import { getSocialLinks, site } from '../data/site'
import type { Project } from '../types'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { NowPanel } from './NowPanel'
import { SocialButton } from './SocialLinks'
import { StatusBadge } from './StatusBadge'

interface ProfileHeaderProps {
  projects: Project[]
  onOpenProject: (project: Project) => void
}

export function ProfileHeader({ projects, onOpenProject }: ProfileHeaderProps) {
  const github = getSocialLinks().find((link) => link.id === 'github')

  return (
    // The one page-load motion on the site: a short fade and rise.
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14"
    >
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:gap-7">
        <Avatar name={site.name} src={site.avatarSrc} size="lg" priority />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1
              id="profile-heading"
              className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] sm:text-4xl"
            >
              {site.name}
            </h1>
            <StatusBadge tone="accent" pulse>
              {site.statusText}
            </StatusBadge>
          </div>

          <p className="mt-1 text-lg text-fg/90">{site.role}</p>
          <p className="mt-3 max-w-[58ch] leading-relaxed text-muted">{site.tagline}</p>

          <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
            <dt className="flex items-center gap-2 text-muted">
              <MapPin size={15} aria-hidden="true" />
              Location
            </dt>
            <dd>{site.location}</dd>
            <dt className="flex items-center gap-2 text-muted">
              <Briefcase size={15} aria-hidden="true" />
              Available for
            </dt>
            <dd>{site.availability}</dd>
          </dl>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button variant="primary" href="#projects" className="col-span-2 sm:col-auto">
              View Projects
            </Button>
            {github && <SocialButton link={github} />}
            <Button href="#contact">Contact Me</Button>
          </div>
        </div>
      </div>

      <NowPanel projects={projects} onOpenProject={onOpenProject} />
    </m.div>
  )
}
