import { AnimatePresence, m } from 'framer-motion'
import { navItems } from '../data/navigation'
import { getSocialLinks } from '../data/site'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { cn } from '../lib/cn'
import { Button } from './Button'
import { Container } from './Container'
import { SocialLinks } from './SocialLinks'

interface MobileMenuProps {
  open: boolean
  activeNavId: string | undefined
  onNavigate: () => void
}

export function MobileMenu({ open, activeNavId, onNavigate }: MobileMenuProps) {
  return (
    <AnimatePresence initial={false}>
      {open && <MenuPanel key="mobile-menu" activeNavId={activeNavId} onNavigate={onNavigate} />}
    </AnimatePresence>
  )
}

function MenuPanel({ activeNavId, onNavigate }: Omit<MobileMenuProps, 'open'>) {
  const links = getSocialLinks().filter((link) => link.id !== 'email')
  useLockBodyScroll()

  return (
    <>
      {/* Tapping the dimmed page behind the menu closes it. */}
      <m.button
        type="button"
        tabIndex={-1}
        aria-label="Close menu"
        onClick={onNavigate}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-x-0 top-full h-[100dvh] cursor-default bg-black/55 lg:hidden"
      />
      <m.div
        id="mobile-menu"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative overflow-hidden border-t border-line bg-canvas lg:hidden"
      >
        <Container className="py-3">
          <nav aria-label="Mobile">
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const active = item.id === activeNavId
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'relative flex min-h-12 items-center rounded-md px-4 text-base transition-colors',
                        active
                          ? 'bg-raised font-medium text-fg before:absolute before:inset-y-2.5 before:left-0 before:w-0.5 before:rounded-full before:bg-accent'
                          : 'text-muted hover:bg-raised hover:text-fg',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <SocialLinks links={links} variant="button" onNavigate={onNavigate} />
            <Button variant="primary" href="#contact" onClick={onNavigate}>
              Contact
            </Button>
          </div>
        </Container>
      </m.div>
    </>
  )
}
