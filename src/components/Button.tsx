import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'sm'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  /** Renders a link. */
  href?: string
  external?: boolean
  /** When set, the target link is not configured yet: renders an inert, clearly disabled placeholder. */
  unavailableReason?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  'aria-label'?: string
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-haspopup'?: 'dialog'
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md border font-medium whitespace-nowrap select-none transition-[background-color,border-color,color,transform] duration-150'

const sizes: Record<ButtonSize, string> = {
  md: 'h-10 px-4 text-sm md:h-9 md:px-3.5',
  sm: 'h-9 px-3 text-[13px] md:h-8 md:px-2.5',
}

const variants: Record<ButtonVariant, { rest: string; hover: string }> = {
  primary: { rest: 'border-accent bg-accent text-ink', hover: 'hover:border-accent-strong hover:bg-accent-strong' },
  secondary: { rest: 'border-line-strong bg-raised text-fg', hover: 'hover:border-muted hover:bg-lift' },
  ghost: { rest: 'border-transparent bg-transparent text-muted', hover: 'hover:bg-raised hover:text-fg' },
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  href,
  external,
  unavailableReason,
  type = 'button',
  disabled,
  onClick,
  ...aria
}: ButtonProps) {
  const style = variants[variant]

  if (unavailableReason) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={unavailableReason}
        className={cn(base, sizes[size], style.rest, 'cursor-not-allowed border-dashed opacity-60', className)}
      >
        {children}
        <span className="sr-only"> ({unavailableReason})</span>
      </span>
    )
  }

  const classes = cn(base, sizes[size], style.rest, disabled ? 'cursor-not-allowed opacity-60' : cn(style.hover, 'active:translate-y-px'), className)

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...aria}
      >
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...aria}>
      {children}
    </button>
  )
}
