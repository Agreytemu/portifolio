import { Menu, Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { navItems } from '../data/navigation'
import { getSocialLinks, site } from '../data/site'
import { cn } from '../lib/cn'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Container } from './Container'
import { MobileMenu } from './MobileMenu'
import { SocialLinks } from './SocialLinks'

interface NavbarProps {
  activeNavId: string | undefined
  onOpenPalette: () => void
  modifier: string
}

export function Navbar({ activeNavId, onOpenPalette, modifier }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const links = getSocialLinks().filter((link) => link.id !== 'email')

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(true)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, closeMenu])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <Container className="flex h-14 items-center gap-2 lg:gap-6">
        <a
          href="#overview"
          onClick={() => closeMenu()}
          className="flex shrink-0 items-center gap-2.5 rounded-md py-1 pr-2 font-semibold tracking-tight"
        >
          <Avatar name={site.name} src={site.avatarSrc} size="sm" priority />
          <span>{site.name}</span>
        </a>

        <nav aria-label="Primary" className="hidden h-full lg:block">
          <ul className="flex h-full items-stretch gap-1">
            {navItems.map((item) => {
              const active = item.id === activeNavId
              return (
                <li key={item.id} className="flex">
                  <a
                    href={item.href}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      // The accent underline is always present and scales in when the tab becomes active.
                      'relative flex items-center rounded-md px-3 text-sm transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-200',
                      active ? 'font-medium text-fg after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-fg',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-haspopup="dialog"
            aria-label="Open command menu"
            aria-keyshortcuts="Control+K Meta+K"
            className="mr-1 inline-flex h-8 w-8 items-center justify-center gap-2 rounded-md border border-line bg-surface text-sm text-muted transition-colors hover:border-line-strong hover:text-fg xl:w-44 xl:justify-between xl:px-2.5"
          >
            <span className="flex items-center gap-2">
              <Search size={14} aria-hidden="true" />
              <span className="hidden xl:inline">Search</span>
            </span>
            <span aria-hidden="true" className="hidden items-center gap-1 xl:flex">
              <kbd>{modifier}</kbd>
              <kbd>K</kbd>
            </span>
          </button>
          <SocialLinks links={links} variant="nav" />
          <Button variant="primary" size="sm" href="#contact" className="ml-1">
            Contact
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => {
              closeMenu()
              onOpenPalette()
            }}
            aria-haspopup="dialog"
            aria-label="Open command menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            <Search size={18} aria-hidden="true" />
          </button>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <MobileMenu open={open} activeNavId={activeNavId} onNavigate={() => closeMenu()} />
    </header>
  )
}
