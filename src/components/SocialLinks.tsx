import { Camera, GitBranch, Link2, Mail, Music2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SocialId, SocialLink } from '../types'
import { cn } from '../lib/cn'
import { Button } from './Button'

// Generic icons on purpose: no GitHub or LinkedIn brand marks.
const icons: Record<SocialId, LucideIcon> = {
  github: GitBranch,
  linkedin: Link2,
  instagram: Camera,
  tiktok: Music2,
  email: Mail,
}

interface SocialButtonProps {
  link: SocialLink
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'sm'
  showIcon?: boolean
  className?: string
  onClick?: () => void
}

export function SocialButton({
  link,
  variant = 'secondary',
  size = 'md',
  showIcon = true,
  className,
  onClick,
}: SocialButtonProps) {
  const Icon = icons[link.id]
  return (
    <Button
      variant={variant}
      size={size}
      href={link.href}
      external={link.id !== 'email'}
      unavailableReason={link.href ? undefined : link.hint}
      className={className}
      onClick={onClick}
    >
      {showIcon && <Icon size={16} aria-hidden="true" />}
      {link.label}
    </Button>
  )
}

interface SocialLinksProps {
  links: SocialLink[]
  /** "nav" = compact ghost buttons, "text" = plain text links (footer), "button" = full buttons. */
  variant?: 'nav' | 'text' | 'button'
  className?: string
  onNavigate?: () => void
}

export function SocialLinks({ links, variant = 'nav', className, onNavigate }: SocialLinksProps) {
  if (variant === 'text') {
    return (
      <ul className={cn('flex flex-wrap gap-x-5 gap-y-2 text-sm', className)}>
        {links.map((link) => (
          <li key={link.id}>
            {link.href ? (
              <a
                href={link.href}
                className="rounded text-muted underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:text-fg hover:decoration-line-strong"
                {...(link.id === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {link.label}
                {link.id !== 'email' && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            ) : (
              <span role="link" aria-disabled="true" title={link.hint} className="cursor-not-allowed text-muted/70 underline decoration-line-strong decoration-dashed underline-offset-4">
                {link.label}
                <span className="sr-only"> ({link.hint})</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map((link) => (
        <li key={link.id}>
          <SocialButton
            link={link}
            variant={variant === 'nav' ? 'ghost' : 'secondary'}
            size={variant === 'nav' ? 'sm' : 'md'}
            showIcon={variant === 'button'}
            onClick={onNavigate}
          />
        </li>
      ))}
    </ul>
  )
}

