import { getSocialLinks, site } from '../data/site'
import { Container } from './Container'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-semibold">{site.name}</p>
          <p className="mt-1 text-sm text-muted">Building practical software from {site.location}.</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <nav aria-label="Footer">
            <SocialLinks links={getSocialLinks()} variant="text" />
          </nav>
          <p className="text-xs text-muted">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </Container>
    </footer>
  )
}
